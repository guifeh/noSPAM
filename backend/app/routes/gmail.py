from fastapi import APIRouter, Header, HTTPException
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import os

from app.routes.auth import SCOPES

router = APIRouter()

def get_gmail_service(token: str):
    creds = Credentials(
        token=token,
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        token_uri="https://oauth2.googleapis.com/token",
        scopes=SCOPES,
    )
    return build("gmail", "v1", credentials=creds)

@router.get("/gmail/emails")
def listar_emails(max_emails: int = 20, authorization: str = Header(...)):
    # Header Authorization pode vir como "Bearer <token>" (case-insensitive).
    token = authorization
    if isinstance(authorization, str) and authorization.lower().startswith("bearer "):
        token = authorization[7:]
    try:
        service = get_gmail_service(token)
        result = service.users().messages().list(
            userId="me",
            maxResults=max_emails,
            q="is:unread"
        ).execute()

        messages = result.get("messages", [])
        emails = []

        for msg in messages:
            detail = service.users().messages().get(
                userId="me",
                id=msg["id"],
                format="metadata",
                metadataHeaders=["From", "Subject"]
            ).execute()

            headers = detail.get("payload", {}).get("headers", [])
            subject = next((h["value"] for h in headers if h["name"] == "Subject"), "sem assunto")
            sender  = next((h["value"] for h in headers if h["name"] == "From"), "desconhecido")

            emails.append({
                "id": msg["id"],
                "subject": subject,
                "sender": sender
            })

        return {"total": len(emails), "emails": emails}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/gmail/emails")
def deletar_emails(ids: list[str], authorization: str = Header(...)):
    # Header Authorization pode vir como "Bearer <token>" (case-insensitive).
    token = authorization
    if isinstance(authorization, str) and authorization.lower().startswith("bearer "):
        token = authorization[7:]
    try:
        service = get_gmail_service(token)
        # Move para lixeira (TRASH) usando gmail.modify.
        service.users().messages().batchModify(
            userId="me",
            body={"ids": ids, "addLabelIds": ["TRASH"]},
        ).execute()
        return {"deletados": len(ids), "ids": ids}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))