from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
import os

router = APIRouter()

_flows = {}

# gmail.modify já inclui leitura + apagar/mover mensagens (necessário para batchDelete no /scan).
SCOPES = ["https://www.googleapis.com/auth/gmail.modify"]

def make_flow():
    return Flow.from_client_config(
        {
            "web": {
                "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                "redirect_uris": [os.getenv("GOOGLE_REDIRECT_URI")],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        },
        scopes=SCOPES,
        redirect_uri=os.getenv("GOOGLE_REDIRECT_URI")
    )

@router.get("/auth/login")
def login():
    flow = make_flow()
    # consent: força a tela de permissões de novo (útil ao mudar SCOPES ou token antigo só com readonly).
    # Sem include_granted_scopes: evita modo incremental que às vezes mantém só escopos antigos (ex.: só readonly).
    auth_url, state = flow.authorization_url(
        prompt="consent",
        access_type="offline",
    )
    _flows[state] = flow 
    return RedirectResponse(auth_url)

@router.get("/auth/callback")
def callback(code: str, state: str):
    flow = _flows.pop(state, None) 
    if not flow:
        raise HTTPException(status_code=400, detail="State inválido ou expirado")
    
    flow.fetch_token(code=code)
    creds = flow.credentials
    granted = list(creds.scopes) if creds.scopes else []
    return {
        "access_token": creds.token,
        "token_type": "bearer",
        # Confira se aparece https://www.googleapis.com/auth/gmail.modify — senão o Gmail vai dar 403 no batchDelete.
        "granted_scopes": granted,
    }