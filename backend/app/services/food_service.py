from dataclasses import asdict
import json
import os
from typing import Any, Dict, Mapping, Optional

import httpx

from app.core.env import load_environment
from app.domain.food.mapper import map_food_api_response
from app.domain.food.pure_logic import (
    normalize_barcode_query,
    normalize_food_name_query,
)

load_environment()

OPEN_FOOD_FACTS_BASE_URL = "https://world.openfoodfacts.org"
OPEN_FOOD_FACTS_SEARCH_BASE_URL = "https://search.openfoodfacts.org"
OPEN_FOOD_FACTS_TIMEOUT_SECONDS = 10.0
OPEN_FOOD_FACTS_HEADERS = {
    "User-Agent": (
        "SmartNutritionFitnessTracker/1.0 "
        "(https://github.com/ruvimsungeitis/Smart-Nutrition-Fitness-Tracker)"
    ),
}
OPEN_FOOD_FACTS_FIELDS = "code,product_name,nutriments"
OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"
OPENAI_TIMEOUT_SECONDS = 20.0
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.2")
AI_ANALYSIS_APPROXIMATION_MESSAGE = "AI estimate. Values are approximate."


async def get_food_by_name(name: str) -> Dict[str, Any]:
    normalized_name = normalize_food_name_query(name)
    if not normalized_name:
        return _to_response(None)

    try:
        api_data = await _search_product_by_name(normalized_name)
    except httpx.HTTPError:
        return _error_response("Open Food Facts search is unavailable right now.")

    return _to_response(api_data)


async def get_food_by_barcode(barcode: str) -> Dict[str, Any]:
    normalized_barcode = normalize_barcode_query(barcode)
    if not normalized_barcode:
        return _to_response(None)

    try:
        api_data = await _get_product_by_barcode(normalized_barcode)
    except httpx.HTTPError:
        return _error_response("Open Food Facts lookup is unavailable right now.")

    return _to_response(api_data)


async def analyze_food_text(description: str) -> Dict[str, Any]:
    normalized_description = " ".join(description.strip().split())
    if not normalized_description:
        return _error_response("Please enter a meal description.")

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return _error_response("OpenAI API key is not configured.")

    try:
        estimate = await _request_ai_nutrition_estimate(
            normalized_description,
            api_key,
        )
    except httpx.HTTPStatusError as error:
        return _error_response(_build_openai_error_message(error))
    except (httpx.HTTPError, ValueError, json.JSONDecodeError):
        return _error_response("AI food analysis is unavailable right now.")

    response = _to_response(
        {
            "name": estimate.get("meal_name") or "Estimated meal",
            "barcode": None,
            "nutriments": {
                "calories": estimate.get("calories"),
                "protein": estimate.get("protein"),
                "carbs": estimate.get("carbs"),
                "fats": estimate.get("fats"),
            },
        }
    )

    if response["status"] == "success":
        response["message"] = AI_ANALYSIS_APPROXIMATION_MESSAGE

    return response


def _to_response(food: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    result = map_food_api_response(food)

    return {
        "status": result.status,
        "food": asdict(result.food) if result.food else None,
        "message": result.message,
    }


def _error_response(message: str) -> Dict[str, Any]:
    return {
        "status": "error",
        "food": None,
        "message": message,
    }


def _build_openai_error_message(error: httpx.HTTPStatusError) -> str:
    status_code = error.response.status_code

    if status_code == 401:
        return "OpenAI API key is invalid or unauthorized."

    if status_code == 429:
        return "OpenAI quota or rate limit was reached. Check the API plan and billing."

    return "AI food analysis is unavailable right now."


async def _search_product_by_name(name: str) -> Optional[Dict[str, Any]]:
    data = await _fetch_json(
        f"{OPEN_FOOD_FACTS_SEARCH_BASE_URL}/search",
        params={
            "q": name,
            "size": 10,
        },
    )
    hits = data.get("hits", [])
    if not isinstance(hits, list):
        return None

    selected_hit: Optional[Dict[str, Any]] = None

    for product in hits:
        normalized_product = _normalize_open_food_facts_search_hit(product)
        if normalized_product:
            product_name = normalized_product.get("name")
            if normalize_food_name_query(str(product_name or "")) == name:
                selected_hit = normalized_product
                break

            if selected_hit is None:
                selected_hit = normalized_product

    if not selected_hit:
        return None

    barcode = selected_hit.get("barcode")
    if isinstance(barcode, str) and barcode.strip():
        product = await _get_product_by_barcode(barcode.strip())
        if product:
            return product

    return selected_hit


async def _get_product_by_barcode(barcode: str) -> Optional[Dict[str, Any]]:
    data = await _fetch_json(
        f"{OPEN_FOOD_FACTS_BASE_URL}/api/v2/product/{barcode}.json",
        params={"fields": OPEN_FOOD_FACTS_FIELDS},
    )
    product = data.get("product")
    return _normalize_open_food_facts_product(product)


async def _fetch_json(url: str, params: Mapping[str, Any]) -> Dict[str, Any]:
    async with httpx.AsyncClient(
        timeout=OPEN_FOOD_FACTS_TIMEOUT_SECONDS,
        headers=OPEN_FOOD_FACTS_HEADERS,
    ) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    if isinstance(data, dict):
        return data

    return {}


async def _request_ai_nutrition_estimate(
    description: str,
    api_key: str,
) -> Dict[str, Any]:
    payload = {
        "model": OPENAI_MODEL,
        "input": [
            {
                "role": "system",
                "content": (
                    "Estimate nutrition for a user's meal description. "
                    "Return approximate values only, not medical advice. "
                    "Use grams for protein, carbs, and fats. "
                    "Use kcal for calories."
                ),
            },
            {
                "role": "user",
                "content": f"Meal description: {description}",
            },
        ],
        "text": {
            "format": {
                "type": "json_schema",
                "name": "nutrition_estimate",
                "strict": True,
                "schema": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "meal_name": {"type": "string"},
                        "calories": {"type": "number"},
                        "protein": {"type": "number"},
                        "carbs": {"type": "number"},
                        "fats": {"type": "number"},
                    },
                    "required": [
                        "meal_name",
                        "calories",
                        "protein",
                        "carbs",
                        "fats",
                    ],
                },
            },
        },
    }

    async with httpx.AsyncClient(timeout=OPENAI_TIMEOUT_SECONDS) as client:
        response = await client.post(
            OPENAI_RESPONSES_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        response.raise_for_status()
        data = response.json()

    output_text = _extract_response_output_text(data)
    if not output_text:
        raise ValueError("OpenAI response did not include output text.")

    estimate = json.loads(output_text)
    if isinstance(estimate, dict):
        return estimate

    raise ValueError("OpenAI response was not a JSON object.")


def _extract_response_output_text(data: Mapping[str, Any]) -> Optional[str]:
    output_text = data.get("output_text")
    if isinstance(output_text, str):
        return output_text

    output = data.get("output")
    if not isinstance(output, list):
        return None

    for item in output:
        if not isinstance(item, Mapping):
            continue

        content = item.get("content")
        if not isinstance(content, list):
            continue

        for content_item in content:
            if not isinstance(content_item, Mapping):
                continue

            if content_item.get("type") == "output_text":
                text = content_item.get("text")
                if isinstance(text, str):
                    return text

    return None


def _normalize_open_food_facts_product(
    product: Optional[Mapping[str, Any]],
) -> Optional[Dict[str, Any]]:
    if not isinstance(product, Mapping):
        return None

    product_name = product.get("product_name")
    barcode = product.get("code")
    nutriments = product.get("nutriments")

    if not isinstance(nutriments, Mapping):
        nutriments = {}

    return {
        "name": product_name,
        "barcode": barcode,
        "nutriments": {
            "calories": _pick_first_numeric(
                nutriments,
                "energy-kcal_100g",
                "energy-kcal",
            ),
            "protein": _pick_first_numeric(
                nutriments,
                "proteins_100g",
                "proteins",
            ),
            "carbs": _pick_first_numeric(
                nutriments,
                "carbohydrates_100g",
                "carbohydrates",
            ),
            "fats": _pick_first_numeric(
                nutriments,
                "fat_100g",
                "fat",
            ),
        },
    }


def _normalize_open_food_facts_search_hit(
    product: Optional[Mapping[str, Any]],
) -> Optional[Dict[str, Any]]:
    if not isinstance(product, Mapping):
        return None

    return {
        "name": product.get("product_name") or product.get("product_name_en"),
        "barcode": product.get("code"),
        "nutriments": {},
    }


def _pick_first_numeric(nutriments: Mapping[str, Any], *keys: str) -> Any:
    for key in keys:
        value = nutriments.get(key)
        if value is not None:
            return value

    return None
