from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
import os

router = APIRouter()

_flows = {}

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify"
]

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
    auth_url, state = flow.authorization_url(prompt="consent")
    _flows[state] = flow 
    return RedirectResponse(auth_url)

@router.get("/auth/callback")
def callback(code: str, state: str):
    flow = _flows.pop(state, None) 
    if not flow:
        raise HTTPException(status_code=400, detail="State inválido ou expirado")
    
    flow.fetch_token(code=code)
    token = flow.credentials.token
    return {"access_token": token, "token_type": "bearer"}