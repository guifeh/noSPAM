import { useState, useEffect } from "react"
import { scan } from "../../utils/api.js"
import { getContexto, saveResultado } from "../../utils/storage.js"

export default function Home({ token, onLogout, onEditContext, onConfirm }) {
  const [contexto, setContexto] = useState("")
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    getContexto().then(setContexto)
  }, [])

  async function handleScan() {
    if (!contexto) {
      setErro("defina um contexto antes de varrer!")
      return
    }
    setLoading(true)
    setErro(null)
    setResultado(null)
    try {
      const res = await scan(token, contexto)
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

      {resultado && (
        <div style={styles.resultado}>
          <p>✅ {resultado.deletados} emails movidos pra lixeira</p>
          <p style={styles.sub}>de {resultado.total_analisados} analisados</p>
        </div>
      )}

      {erro && <p style={styles.erro}>{erro}</p>}

      <button
        style={{ ...styles.playBtn, opacity: loading ? 0.6 : 1 }}
        onClick={handleScan}
        disabled={loading}
      >
        {loading ? "varrendo..." : "▶ play"}
      </button>
    </div>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "480px", padding: "20px", gap: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: "20px", fontWeight: "700", color: "#fff" },
  logoutBtn: { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px" },
  contextBox: {
    background: "#1a1a1a", borderRadius: "10px", padding: "14px",
    border: "1px solid #2a2a2a", display: "flex", flexDirection: "column", gap: "8px"
  },
  label: { fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" },
  contextoText: { fontSize: "13px", color: "#ccc", lineHeight: "1.5" },
  editBtn: {
    alignSelf: "flex-start", background: "none", border: "1px solid #333",
    color: "#888", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer"
  },
  resultado: {
    background: "#0d2b1f", border: "1px solid #1D9E75",
    borderRadius: "10px", padding: "14px", color: "#1D9E75"
  },
  sub: { fontSize: "12px", color: "#0F6E56", marginTop: "4px" },
  erro: { color: "#E24B4A", fontSize: "13px" },
  playBtn: {
    marginTop: "auto", width: "100%", padding: "14px",
    borderRadius: "10px", border: "none", background: "#1D9E75",
    color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer"
  }
}