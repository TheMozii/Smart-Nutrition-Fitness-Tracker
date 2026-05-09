from dataclasses import asdict
from typing import Any, Dict, Mapping, Optional

import httpx

from app.domain.food.mapper import map_food_api_response
from app.domain.food.pure_logic import (
    normalize_barcode_query,
    normalize_food_name_query,
)


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
