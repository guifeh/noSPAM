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

// Dispara varredura (o background usará o seu próprio token salvo pra isso de forma isolada e segura)
export function scan(contexto, maxEmails = 20) {
  return sendMsg({ type: "SCAN", contexto, maxEmails })
}