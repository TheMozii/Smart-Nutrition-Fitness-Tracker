from fastapi import APIRouter, HTTPException, Query
from app.services.food_service import get_food_by_name, get_food_by_barcode

router = APIRouter()

@router.get("/search")
async def search_food(name: str = Query(..., min_length=1)):
    result = await get_food_by_name(name)

    if result["status"] == "not_found":
        raise HTTPException(status_code=404, detail=result["message"])

    return result


@router.get("/barcode/{barcode}")
async def search_food_by_barcode(barcode: str):
    result = await get_food_by_barcode(barcode)

    if result["status"] == "not_found":
        raise HTTPException(status_code=404, detail=result["message"])

    return result