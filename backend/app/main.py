from dotenv import load_dotenv
load_dotenv() 

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.gmail import router as gmail_router
from app.routes.scan import router as scan_router

app = FastAPI(title="noSPAM API")

# Protegendo o Backend contra ataques CSRF e requisições maliciosas. 
# Permitindo, por padrão para a POC, que origens do Chrome chamem a API, mas 
# restringindo demais origens. O ideal em prod para essa POC é passar uma ENV.
origins = [
    "http://localhost:8000",
    "chrome-extension://*", # Idealmente id específico da extensão após publicação
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(gmail_router)
app.include_router(scan_router)

@app.get("/")
def root():
    return {"status": "noSPAM backend rodando!"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(title="noSPAM API", version="0.1.0", routes=app.routes)
    schema["components"]["securitySchemes"] = {
        "BearerAuth": {"type": "http", "scheme": "bearer"}
    }
    for path in schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = schema
    return schema

app.openapi = custom_openapi