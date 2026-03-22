from fastapi import APIRouter, Header, HTTPException
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import os

router = APIRouter()

def get_gmail_service(token: str):
    creds = Credentials(
        token=token,
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        token_uri="https://oauth2.googleapis.com/token"
    )
    return build("gmail", "v1", credentials=creds)

@router.get("/gmail/emails")
def listar_emails(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    try:
        service = get_gmail_service(token)
        result = service.users().messages().list(
            userId="me",
            maxResults=20,
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
    token = authorization.replace("Bearer ", "")
    try:
        service = get_gmail_service(token)
        service.users().messages().batchDelete(
            userId="me",
            body={"ids":ids}
        ).execute()
        return {"deletados": len(ids), "ids": ids}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))