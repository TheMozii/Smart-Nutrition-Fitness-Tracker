from .mapper import NutritionInfo


def calculate_macro_ratio(food: NutritionInfo):
    total = food.protein + food.carbs + food.fats
    if total == 0:
        return {"protein": 0, "carbs": 0, "fats": 0}

    return {
        "protein": food.protein / total,
        "carbs": food.carbs / total,
        "fats": food.fats / total,
    }