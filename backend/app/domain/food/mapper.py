from dataclasses import dataclass
from typing import Optional, Dict, Any, Literal

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


def map_food_api_response(api_data: Optional[Dict[str, Any]]) -> FoodLookupResult:
    if not api_data:
        return FoodLookupResult(
            status="not_found",
            food=None,
            message="Information about this food couldn't be found."
        )

    nutriments = api_data.get("nutriments", {})

    return FoodLookupResult(
        status="success",
        food=NutritionInfo(
            name=api_data.get("name", "Unknown food"),
            barcode=api_data.get("barcode"),
            calories=float(nutriments.get("calories", 0)),
            protein=float(nutriments.get("protein", 0)),
            carbs=float(nutriments.get("carbs", 0)),
            fats=float(nutriments.get("fats", 0)),
        ),
        message=None
    )