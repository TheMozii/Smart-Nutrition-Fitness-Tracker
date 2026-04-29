from dataclasses import dataclass
from typing import Optional, Mapping, Any, Literal

from .pure_logic import (
    FOOD_NOT_FOUND_MESSAGE,
    extract_nutriments,
    has_food_data,
    normalize_food_name_value,
    normalize_numeric_value,
    normalize_optional_text,
)

Status = Literal["success", "not_found", "error"]


@dataclass(frozen=True)
class NutritionInfo:
    name: str
    barcode: Optional[str]
    calories: float
    protein: float
    carbs: float
    fats: float


@dataclass(frozen=True)
class FoodLookupResult:
    status: Status
    food: Optional[NutritionInfo]
    message: Optional[str]


def map_food_api_response(api_data: Optional[Mapping[str, Any]]) -> FoodLookupResult:
    if not has_food_data(api_data):
        return build_not_found_result()

    nutriments = extract_nutriments(api_data)

    return FoodLookupResult(
        status="success",
        food=NutritionInfo(
            name=normalize_food_name_value(api_data.get("name")),
            barcode=normalize_optional_text(api_data.get("barcode")),
            calories=normalize_numeric_value(nutriments.get("calories")),
            protein=normalize_numeric_value(nutriments.get("protein")),
            carbs=normalize_numeric_value(nutriments.get("carbs")),
            fats=normalize_numeric_value(nutriments.get("fats")),
        ),
        message=None,
    )


def build_not_found_result() -> FoodLookupResult:
    return FoodLookupResult(
        status="not_found",
        food=None,
        message=FOOD_NOT_FOUND_MESSAGE,
    )
