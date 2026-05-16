from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.food_service import (
    analyze_food_text,
    get_food_by_barcode,
    get_food_by_name,
)

router = APIRouter()


class FoodTextAnalysisRequest(BaseModel):
    description: str = Field(..., min_length=1)


@router.get("/search")
async def search_food(name: str = Query(..., min_length=1)):
    result = await get_food_by_name(name)

    if result["status"] == "not_found":
        raise HTTPException(status_code=404, detail=result["message"])
    if result["status"] == "error":
        raise HTTPException(status_code=502, detail=result["message"])

    return result


@router.post("/analyze-text")
async def analyze_food_from_text(request: FoodTextAnalysisRequest):
    result = await analyze_food_text(request.description)

    if result["status"] == "not_found":
        raise HTTPException(status_code=404, detail=result["message"])
    if result["status"] == "error":
        raise HTTPException(status_code=502, detail=result["message"])

    return result


@router.get("/barcode/{barcode}")
async def search_food_by_barcode(barcode: str):
    result = await get_food_by_barcode(barcode)

    if result["status"] == "not_found":
        raise HTTPException(status_code=404, detail=result["message"])
    if result["status"] == "error":
        raise HTTPException(status_code=502, detail=result["message"])

    return result
