import unittest
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


class ApiRoutesTest(unittest.TestCase):
    def test_health_endpoint(self):
        response = client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {"status": "ok", "message": "Backend is running"},
        )

    def test_food_search_success(self):
        with patch(
            "app.api.routes.food.get_food_by_name",
            new=AsyncMock(
                return_value={
                    "status": "success",
                    "food": {
                        "name": "Apple",
                        "barcode": None,
                        "calories": 95,
                        "protein": 0.5,
                        "carbs": 25,
                        "fats": 0.3,
                    },
                    "message": None,
                }
            ),
        ):
            response = client.get("/food/search", params={"name": "apple"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["food"]["name"], "Apple")

    def test_food_search_not_found_maps_to_404(self):
        with patch(
            "app.api.routes.food.get_food_by_name",
            new=AsyncMock(
                return_value={
                    "status": "not_found",
                    "food": None,
                    "message": "Food not found.",
                }
            ),
        ):
            response = client.get("/food/search", params={"name": "missing"})

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Food not found.")

    def test_ai_error_maps_to_502(self):
        with patch(
            "app.api.routes.food.analyze_food_text",
            new=AsyncMock(
                return_value={
                    "status": "error",
                    "food": None,
                    "message": "OpenAI API key is not configured.",
                }
            ),
        ):
            response = client.post(
                "/food/analyze-text",
                json={"description": "2 eggs and toast"},
            )

        self.assertEqual(response.status_code, 502)
        self.assertEqual(
            response.json()["detail"],
            "OpenAI API key is not configured.",
        )


if __name__ == "__main__":
    unittest.main()
