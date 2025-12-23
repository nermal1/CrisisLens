from fastapi import FastAPI

app = FastAPI(title="CrisisLens API")

@app.get("/")
def read_root():
    return {"message": "CrisisLens Backend is running!"}