from __future__ import annotations

from typing import TYPE_CHECKING, Any, Dict, Mapping, Optional

if TYPE_CHECKING:
    from .mapper import NutritionInfo


FOOD_NOT_FOUND_MESSAGE = "Information about this food couldn't be found."


def normalize_food_name_query(name: str) -> str:
    return " ".join(name.strip().lower().split())


def normalize_barcode_query(barcode: str) -> str:
    return barcode.strip()


def normalize_food_name_value(value: Any) -> str:
    if isinstance(value, str):
        normalized = value.strip()
        if normalized:
            return normalized

    return "Unknown food"


def normalize_optional_text(value: Any) -> Optional[str]:
    if not isinstance(value, str):
        return None

    normalized = value.strip()
    return normalized or None


def normalize_numeric_value(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def extract_nutriments(api_data: Optional[Mapping[str, Any]]) -> Mapping[str, Any]:
    if not api_data:
        return {}

    nutriments = api_data.get("nutriments", {})
    if isinstance(nutriments, Mapping):
        return nutriments

    return {}


def has_food_data(api_data: Optional[Mapping[str, Any]]) -> bool:
    if not api_data:
        return False

    name = normalize_optional_text(api_data.get("name"))
    barcode = normalize_optional_text(api_data.get("barcode"))
    nutriments = extract_nutriments(api_data)

    return bool(name or barcode or nutriments)


def calculate_macro_ratio(food: "NutritionInfo") -> Dict[str, float]:
    total = food.protein + food.carbs + food.fats
    if total <= 0:
        return {"protein": 0.0, "carbs": 0.0, "fats": 0.0}

    return {
        "protein": food.protein / total,
        "carbs": food.carbs / total,
        "fats": food.fats / total,
    }
