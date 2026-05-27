import unittest

from app.domain.food.mapper import map_food_api_response


class FoodMapperTest(unittest.TestCase):
    def test_maps_valid_food_response(self):
        result = map_food_api_response(
            {
                "name": "Greek Yogurt",
                "barcode": "123456789",
                "nutriments": {
                    "calories": "120",
                    "protein": "15.5",
                    "carbs": 8,
                    "fats": 2.5,
                },
            }
        )

        self.assertEqual(result.status, "success")
        self.assertIsNotNone(result.food)
        self.assertEqual(result.food.name, "Greek Yogurt")
        self.assertEqual(result.food.barcode, "123456789")
        self.assertEqual(result.food.calories, 120)
        self.assertEqual(result.food.protein, 15.5)
        self.assertEqual(result.food.carbs, 8)
        self.assertEqual(result.food.fats, 2.5)

    def test_missing_nutrition_fields_default_to_zero(self):
        result = map_food_api_response(
            {
                "name": "Unknown Food",
                "barcode": "",
                "nutriments": {},
            }
        )

        self.assertEqual(result.status, "success")
        self.assertIsNotNone(result.food)
        self.assertEqual(result.food.name, "Unknown Food")
        self.assertIsNone(result.food.barcode)
        self.assertEqual(result.food.calories, 0)
        self.assertEqual(result.food.protein, 0)
        self.assertEqual(result.food.carbs, 0)
        self.assertEqual(result.food.fats, 0)

    def test_none_response_maps_to_not_found(self):
        result = map_food_api_response(None)

        self.assertEqual(result.status, "not_found")
        self.assertIsNone(result.food)
        self.assertIsNotNone(result.message)


if __name__ == "__main__":
    unittest.main()
