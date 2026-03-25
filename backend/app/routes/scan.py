from fastapi import APIRouter, Header, HTTPException
from app.routes.gmail import get_gmail_service
from app.services.gemini import classificar_emails
from app.services.supabase import salvar_varredura

router = APIRouter()

def _token_from_auth_header(authorization: str) -> str:
    if isinstance(authorization, str) and authorization.lower().startswith("bearer "):
        return authorization[7:]
    return authorization

@router.post("/scan")
def varrer_emails(contexto: str, authorization: str = Header(...), max_emails: int = 20):
    token = _token_from_auth_header(authorization)
    try:
        service = get_gmail_service(token)

        profile = service.users().getProfile(userId="me").execute()
        user_email = profile.get("emailAddress", "desconhecido")

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
            emails.append({"id": msg["id"], "subject": subject, "sender": sender})

        classificados = classificar_emails(emails, contexto)

        deletar = [e["id"] for e in classificados if e["acao"] == "DELETAR"]
        if deletar:
            service.users().messages().batchModify(
                userId="me",
                body={"ids": deletar, "addLabelIds": ["TRASH"]},
            ).execute()

        resultado = {
            "total_analisados": len(emails),
            "deletados": len(deletar),
            "resultados": classificados
        }

        # salva log no Supabase apenas se deletou algo
        try:
            if resultado["deletados"] > 0:
                salvar_varredura(user_email, contexto, resultado)
        except Exception as e:
            print(f"[WARN] Falha ao salvar log no Supabase: {e}")

        return resultado

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))