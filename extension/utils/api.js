const BACKEND_URL = "http://localhost:8000"

// Envia mensagem pro background service worker
function sendMsg(msg) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (res) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError)
      if (!res.ok) return reject(new Error(res.error))
      resolve(res)
    })
  })
}

// Login com Google via background
export function login() {
  return sendMsg({ type: "LOGIN" })
}

// Logout
export function logout() {
  return sendMsg({ type: "LOGOUT" })
}

// Dispara varredura
export function scan(token, contexto) {
  return sendMsg({ type: "SCAN", token, contexto })
}

// Lista emails (chamada direta, sem passar pelo background)
export async function getEmails(token) {
  const res = await fetch(`${BACKEND_URL}/gmail/emails`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}