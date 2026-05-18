import uvicorn

def main():
    """
    Launch the FastAPI app using Uvicorn.
    Runs on http://localhost:8000 with hot-reload enabled.
    """
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()
