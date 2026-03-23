// Salva o token
export function saveToken(token) {
    return new Promise((resolve) => chrome.storage.local.set({ token }, resolve))
  }
  
  // Pega o token
  export function getToken() {
    return new Promise((resolve) =>
      chrome.storage.local.get(["token"], ({ token }) => resolve(token || null))
    )
  }
  
  // Salva o contexto do usuário
  export function saveContexto(contexto) {
    return new Promise((resolve) => chrome.storage.local.set({ contexto }, resolve))
  }
  
  // Pega o contexto salvo
  export function getContexto() {
    return new Promise((resolve) =>
      chrome.storage.local.get(["contexto"], ({ contexto }) => resolve(contexto || ""))
    )
  }
  
  // Salva o último resultado de varredura
  export function saveResultado(resultado) {
    return new Promise((resolve) =>
      chrome.storage.local.set({ resultado }, resolve)
    )
  }
  
  // Pega o último resultado
  export function getResultado() {
    return new Promise((resolve) =>
      chrome.storage.local.get(["resultado"], ({ resultado }) => resolve(resultado || null))
    )
  }
  
  // Limpa tudo
  export function clearAll() {
    return new Promise((resolve) => chrome.storage.local.clear(resolve))
  }