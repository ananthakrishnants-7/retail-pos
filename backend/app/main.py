from fastapi import FastAPI

from app.routes.auth import router as auth_router

from app.core.config import settings

from app.routes.products import router as products_router

from app.routes.suppliers import router as suppliers_router

from app.routes.sales import router as sales_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Retail POS and Billing Management System",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(suppliers_router)
app.include_router(sales_router)

@app.get("/")
def root():
    return {
        "message": "RetailPOS API is running",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }