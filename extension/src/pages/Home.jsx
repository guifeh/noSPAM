import { useState, useEffect } from "react"
import { scan } from "../../utils/api.js"
import { getContexto, saveResultado } from "../../utils/storage.js"
import ScanLoading from "./ScanLoading.jsx"

const EMAIL_OPTIONS = [10, 20, 30, 40, 50]

export default function Home({ token, onLogout, onEditContext, onConfirm }) {
  const [contexto, setContexto] = useState("")
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)
  const [maxEmails, setMaxEmails] = useState(20)

  useEffect(() => {
    getContexto().then(setContexto)
    // Restaura a preferência do usuário
    chrome.storage.local.get(["maxEmails"], ({ maxEmails: saved }) => {
      if (saved) setMaxEmails(saved)
    })
  }, [])

  function handleMaxChange(val) {
    setMaxEmails(val)
    chrome.storage.local.set({ maxEmails: val })
  }

  async function handleScan() {
    if (!contexto) {
      setErro("defina um contexto antes de varrer!")
      return
    }
    setLoading(true)
    setErro(null)
    setResultado(null)
    try {
      // O token agora é gerenciado com segurança diretamente pelo background da extensão
      const res = await scan(contexto, maxEmails)
      await saveResultado(res.data)
      setResultado(res.data)

      // emails que precisam de confirmação
      const confirmar = res.data.resultados.filter(e => e.acao === "CONFIRMAR")
      if (confirmar.length > 0) onConfirm(confirmar)

    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Mostra o loading de IA em tela cheia
  if (loading) return <ScanLoading maxEmails={maxEmails} />

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.logo}>noSPAM</span>
        <button style={styles.logoutBtn} onClick={onLogout}>sair</button>
      </div>

      <div style={styles.contextBox}>
        <p style={styles.label}>contexto atual</p>
        <p style={styles.contextoText}>
          {contexto || "nenhum contexto definido"}
        </p>
        <button style={styles.editBtn} onClick={onEditContext}>
          ✏️ editar
        </button>
      </div>

      {/* Seletor de quantidade de emails */}
      <div style={styles.selectorBox}>
        <p style={styles.label}>emails para varrer</p>
        <div style={styles.pillRow}>
          {EMAIL_OPTIONS.map(val => (
            <button
              key={val}
              style={{
                ...styles.pill,
                ...(val === maxEmails ? styles.pillActive : {}),
              }}
              onClick={() => handleMaxChange(val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado do scan */}
      {resultado && (
        <>
          <div style={styles.resultado}>
            <p>✅ {resultado.deletados} emails movidos pra lixeira</p>
            <p style={styles.sub}>de {resultado.total_analisados} analisados</p>
          </div>

          {resultado.deletados > 0 && (
            <div style={styles.trashBanner}>
              <p style={styles.trashTitle}>
                🗑️ Os emails excluídos foram movidos para a <strong>Lixeira</strong> do Gmail
              </p>
              <p style={styles.trashSub}>
                Você pode recuperá-los na Lixeira em até 30 dias
              </p>
              <a
                href="https://mail.google.com/mail/#trash"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.trashLink}
              >
                abrir lixeira do Gmail ↗
              </a>
            </div>
          )}
        </>
      )}

      {erro && <p style={styles.erro}>{erro}</p>}

      <button
        style={{ ...styles.playBtn, opacity: loading ? 0.6 : 1 }}
        onClick={handleScan}
        disabled={loading}
      >
        ▶ play
      </button>
    </div>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "480px", padding: "20px", gap: "12px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: "20px", fontWeight: "700", color: "#fff" },
  logoutBtn: { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px" },
  contextBox: {
    background: "#1a1a1a", borderRadius: "10px", padding: "14px",
    border: "1px solid #2a2a2a", display: "flex", flexDirection: "column", gap: "8px"
  },
  label: { fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 },
  contextoText: { fontSize: "13px", color: "#ccc", lineHeight: "1.5", margin: 0 },
  editBtn: {
    alignSelf: "flex-start", background: "none", border: "1px solid #333",
    color: "#888", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer"
  },
  // Seletor de emails
  selectorBox: {
    background: "#1a1a1a", borderRadius: "10px", padding: "12px 14px",
    border: "1px solid #2a2a2a", display: "flex", flexDirection: "column", gap: "8px"
  },
  pillRow: {
    display: "flex", gap: "6px",
  },
  pill: {
    flex: 1, padding: "6px 0", borderRadius: "6px",
    border: "1px solid #333", background: "none",
    color: "#666", fontSize: "13px", fontWeight: "500",
    cursor: "pointer", textAlign: "center",
    transition: "all 0.15s ease",
  },
  pillActive: {
    background: "#1D9E75", border: "1px solid #1D9E75",
    color: "#fff", fontWeight: "700",
    boxShadow: "0 0 12px rgba(29,158,117,0.3)",
  },
  // Resultado
  resultado: {
    background: "#0d2b1f", border: "1px solid #1D9E75",
    borderRadius: "10px", padding: "14px", color: "#1D9E75"
  },
  sub: { fontSize: "12px", color: "#0F6E56", marginTop: "4px" },
  // Aviso de lixeira
  trashBanner: {
    background: "#2a2000", border: "1px solid #5c4a00",
    borderRadius: "10px", padding: "14px",
    display: "flex", flexDirection: "column", gap: "6px",
  },
  trashTitle: {
    fontSize: "12px", color: "#EF9F27", margin: 0, lineHeight: "1.5",
  },
  trashSub: {
    fontSize: "11px", color: "#a07a1a", margin: 0,
  },
  trashLink: {
    fontSize: "12px", color: "#EF9F27", fontWeight: "600",
    textDecoration: "none", marginTop: "4px",
    alignSelf: "flex-start",
  },
  erro: { color: "#E24B4A", fontSize: "13px" },
  playBtn: {
    marginTop: "auto", width: "100%", padding: "14px",
    borderRadius: "10px", border: "none", background: "#1D9E75",
    color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer",
    flexShrink: 0,
  }
}