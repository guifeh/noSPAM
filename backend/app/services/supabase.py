import os
from supabase import create_client
import httpx

def get_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    return create_client(url, key)

def salvar_varredura(user_email: str, contexto: str, resultado: dict):
    url = f"{os.getenv('SUPABASE_URL')}/rest/v1/varreduras"
    headers = {
        "apikey": os.getenv("SUPABASE_KEY"),
        "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    data = {
        "user_email": user_email,
        "contexto": contexto,
        "total_analisados": resultado["total_analisados"],
        "total_deletados": resultado["deletados"],
        "resultados": resultado["resultados"]
    }
    res = httpx.post(url, json=data, headers=headers)
    res.raise_for_status()