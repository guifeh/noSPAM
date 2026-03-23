const BACKEND_URL = "http://localhost:8000"

// Faz login com Google e retorna o token
async function doLogin() {
return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
        return
    }
    chrome.storage.local.set({ token }, () => resolve(token))
    })
})
}

// Limpa o token (logout)
async function doLogout(token) {
  return new Promise((resolve) => {
    chrome.identity.removeCachedAuthToken({ token }, () => {
      chrome.storage.local.remove(["token"], resolve)
    })
  })
}

// Dispara a varredura no backend
async function doScan(token, contexto) {
  const params = new URLSearchParams({ contexto })
  const res = await fetch(`${BACKEND_URL}/scan?${params}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// Ouve mensagens do popup
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "LOGIN") {
    doLogin()
      .then((token) => sendResponse({ ok: true, token }))
      .catch((err) => sendResponse({ ok: false, error: err.message }))
    return true // mantém canal aberto para resposta async
  }

  if (msg.type === "LOGOUT") {
    chrome.storage.local.get(["token"], ({ token }) => {
      doLogout(token)
        .then(() => sendResponse({ ok: true }))
        .catch((err) => sendResponse({ ok: false, error: err.message }))
    })
    return true
  }

  if (msg.type === "SCAN") {
    const { token, contexto } = msg
    doScan(token, contexto)
      .then((data) => sendResponse({ ok: true, data }))
      .catch((err) => sendResponse({ ok: false, error: err.message }))
    return true
  }
})