from fastapi import APIRouter, Header, HTTPException
from app.routes.gmail import get_gmail_service
from app.services.gemini import classificar_emails
import httpx

router = APIRouter()

def _token_from_auth_header(authorization: str) -> str:
    if isinstance(authorization, str) and authorization.lower().startswith("bearer "):
        return authorization[7:]
    return authorization

def _tokeninfo_scope(token: str) -> str | None:
    try:
        data = httpx.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"access_token": token},
            timeout=10.0,
        ).json()
        scope = data.get("scope", "")
        return scope if isinstance(scope, str) else None
    except Exception:
        return None

@router.post("/scan")
def varrer_emails(contexto:str, authorization: str = Header(...)):
    token = _token_from_auth_header(authorization)
    try:
        granted_scope = _tokeninfo_scope(token)
        if granted_scope is not None and "https://www.googleapis.com/auth/gmail.modify" not in granted_scope:
            raise HTTPException(
                status_code=403,
                detail={
                    "error": "access_token_sem_gmail_modify",
                    "tokeninfo_scope": granted_scope,
                },
            )

        service = get_gmail_service(token)
        result = service.users().messages().list(
            userId="me",
            maxResults=20,
            q="is:unread"
        ).execute()

        messages = result.get("messages",[])
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
            emails.append({"id": msg["id"], "subject": subject, "sender": sender})

        #gemini que se vire
        classificados = classificar_emails(emails, contexto)

        # Move para lixeira (TRASH). batchDelete exige scope mais forte (mail.google.com).
        deletar = [e["id"] for e in classificados if e["acao"] == "DELETAR"]
        if deletar:
            service.users().messages().batchModify(
                userId="me",
                body={"ids": deletar, "addLabelIds": ["TRASH"]},
            ).execute()
        
        return {
            "total_analisados": len(emails),
            "deletados": len(deletar),
            "resultados": classificados #inclui o MANTER e CONFITMAR tbm
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))