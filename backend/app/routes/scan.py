from fastapi import APIRouter, Header, HTTPException
from app.routes.gmail import get_gmail_service
from app.services.gemini import classificar_emails

router = APIRouter()

@router.post("/scan")
def varrer_emails(contexto:str, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    try:
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

        #delete os caras marcados como DELETAR
        deletar = [e["id"] for e in classificados if e["acao"] == "DELETAR"]
        if deletar:
            service.users().message().batchDelete(
                userId="me",
                body={"ids":deletar}
            ).execute()
        
        return {
            "total_analisados": len(emails),
            "deletados": len(deletar),
            "resultados": classificados #inclui o MANTER e CONFITMAR tbm
        }
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))