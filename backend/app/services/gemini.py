import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

_DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
_model = genai.GenerativeModel(_DEFAULT_MODEL)

def classificar_emails(emails: list[dict], contexto: str) -> list[dict]:
    lista = "\n".join([
        f"- id:{e['id']} | de:{e['sender']} | assunto:{e['subject']}"
        for e in emails
    ])

    prompt = f"""Você é um assistente especialista em limpeza de caixa de entrada.
Sua missão é ser AGRESSIVO na limpeza — na dúvida, DELETE.

Contexto do usuário: {contexto}

REGRAS OBRIGATÓRIAS (siga à risca):

DELETAR sempre:
- Notificações de apps (ex: "você recebeu um like", "alguém comentou", "nova atividade")
- Emails de marketing e promoções
- Newsletters que o usuário não lê
- Emails com palavras como: "oferta", "desconto", "% OFF", "promoção", "assine", "confira"
- Notificações automáticas de redes sociais (Instagram, LinkedIn, Twitter/X, TikTok, etc)
- Alertas de sistemas que não exigem ação do usuário
- Emails de "não responda" (noreply@...)

MANTER sempre:
- Emails de pessoas físicas (nome próprio no remetente)
- Boletos, recibos, notas fiscais, confirmações de pagamento
- Emails do banco ou operadora de cartão
- Confirmações de compra ou entrega
- Emails com código de verificação ou senha
- Emails de trabalho ou estudo

CONFIRMAR apenas se:
- Genuinamente impossível decidir mesmo com as regras acima
- Nunca use CONFIRMAR por preguiça ou dúvida leve

Responda APENAS com JSON válido, sem texto adicional:
[
  {{"id": "id_do_email", "acao": "DELETAR", "motivo": "motivo curto"}},
  ...
]

Emails para classificar:
{lista}
"""

    response = _model.generate_content(prompt)
    text = response.text.strip()

    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    return json.loads(text.strip())