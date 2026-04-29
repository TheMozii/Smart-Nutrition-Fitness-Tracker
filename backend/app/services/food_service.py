from dataclasses import asdict
from typing import Any, Dict, Optional

from app.domain.food.mapper import map_food_api_response
from app.domain.food.pure_logic import (
    normalize_barcode_query,
    normalize_food_name_query,
)


MOCK_FOODS = [
    {
        "name": "Greek yogurt",
        "barcode": "1234567890123",
        "nutriments": {
            "calories": 100,
            "protein": 10,
            "carbs": 4,
            "fats": 5,
        },
    },
    {
        "name": "Banana",
        "barcode": "9876543210987",
        "nutriments": {
            "calories": 89,
            "protein": 1.1,
            "carbs": 22.8,
            "fats": 0.3,
        },
    },
]


async def get_food_by_name(name: str) -> Dict[str, Any]:
    normalized_name = normalize_food_name_query(name)
    food = next(
        (
            food_data
            for food_data in MOCK_FOODS
            if normalize_food_name_query(food_data["name"]) == normalized_name
        ),
        None,
    )

    return _to_response(food)


async def get_food_by_barcode(barcode: str) -> Dict[str, Any]:
    normalized_barcode = normalize_barcode_query(barcode)
    food = next(
        (
            food_data
            for food_data in MOCK_FOODS
            if normalize_barcode_query(food_data["barcode"]) == normalized_barcode
        ),
        None,
    )

    return _to_response(food)


def _to_response(food: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    result = map_food_api_response(food)

    return {
        "status": result.status,
        "food": asdict(result.food) if result.food else None,
        "message": result.message,
    }
