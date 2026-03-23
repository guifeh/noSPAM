import { useState, useEffect } from "react"
import { getContexto, saveContexto } from "../../utils/storage.js"

export default function Context({ onBack }) {
  const [texto, setTexto] = useState("")
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    getContexto().then(setTexto)
  }, [])

  async function handleSalvar() {
    await saveContexto(texto)
    setSalvo(true)
    setTimeout(() => { setSalvo(false); onBack() }, 1000)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← voltar</button>
        <span style={styles.title}>contexto</span>
      </div>

      <p style={styles.hint}>
        descreva quais emails a IA deve apagar. seja específico para melhores resultados.
      </p>

      <textarea
        style={styles.textarea}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="ex: apague promoções, newsletters que não leio, notificações de apps, emails de marketing..."
        rows={8}
      />

      <button style={styles.saveBtn} onClick={handleSalvar}>
        {salvo ? "✅ salvo!" : "salvar contexto"}
      </button>
    </div>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "480px", padding: "20px", gap: "16px" },
  header: { display: "flex", alignItems: "center", gap: "12px" },
  backBtn: { background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "13px" },
  title: { fontSize: "16px", fontWeight: "600", color: "#fff" },
  hint: { fontSize: "12px", color: "#555", lineHeight: "1.6" },
  textarea: {
    flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a",
    borderRadius: "10px", padding: "14px", color: "#ccc",
    fontSize: "13px", resize: "none", outline: "none", lineHeight: "1.6"
  },
  saveBtn: {
    width: "100%", padding: "12px", borderRadius: "10px",
    border: "none", background: "#1D9E75", color: "#fff",
    fontSize: "14px", fontWeight: "600", cursor: "pointer"
  }
}