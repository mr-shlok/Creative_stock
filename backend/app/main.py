from fastapi import FastAPI

app = FastAPI(
    title="Design Marketplace API",
    description="Backend for image & design selling platform",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "FastAPI is running 🚀"}
