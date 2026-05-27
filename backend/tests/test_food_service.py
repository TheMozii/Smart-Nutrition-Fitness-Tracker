import os
import unittest
from unittest.mock import patch

from app.services.food_service import analyze_food_text


class FoodServiceTest(unittest.IsolatedAsyncioTestCase):
    async def test_analyze_food_text_requires_description(self):
        result = await analyze_food_text("   ")

        self.assertEqual(result["status"], "error")
        self.assertIsNone(result["food"])
        self.assertEqual(result["message"], "Please enter a meal description.")

    async def test_analyze_food_text_requires_openai_api_key(self):
        with patch.dict(os.environ, {}, clear=True):
            result = await analyze_food_text("2 eggs and toast")

        self.assertEqual(result["status"], "error")
        self.assertIsNone(result["food"])
        self.assertEqual(result["message"], "OpenAI API key is not configured.")


if __name__ == "__main__":
    unittest.main()
