import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# gemini-1.5-* foi descontinuado na API; use um modelo atual (grátis no AI Studio com cota).
# Sobrescreva com GEMINI_MODEL no .env se quiser (ex.: gemini-2.5-flash-lite, gemini-flash-latest).
_DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
_model = genai.GenerativeModel(_DEFAULT_MODEL)

def classificar_emails(emails: list[dict], contexto: str) -> list[dict]:
    lista = "\n".join([
        f"- id:{e['id']} | de:{e['sender']} | assunto:{e['subject']}"
        for e in emails
    ])

    prompt = f"""Você é um assistente que classifica emails para deletar.

Contexto do usuário: {contexto}

Classifique cada email abaixo com uma das ações:
- DELETAR: email claramente indesejado segundo o contexto
- MANTER: email possivelmente importante
- CONFIRMAR: email duvidoso, precisa de confirmação do usuário

Responda APENAS com um JSON válido neste formato, sem texto adicional:
[
    {{"id": "id_do_email", "acao": "DELETAR", "motivo": "motivo curto"}},
    ...
]

Emails:
{lista}
"""

    response = _model.generate_content(prompt)

    text = response.text.strip()

    # Remove markdown code block se o Gemini retornar ```json ... ```
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    return json.loads(text.strip())