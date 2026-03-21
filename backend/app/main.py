from fastapi import FastAPI

app = FastAPI(title="noSPAM API")

@app.get("/")
def root():
    return {"status": "noSPAM backend rodando!"}
