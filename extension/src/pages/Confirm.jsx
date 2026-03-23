export default function Confirm({ pendentes, onDone }) {
    const [lista, setLista] = useState(pendentes)
  
    function handleAprovar(id) {
      // aprovado = confirma deleção (por enquanto só remove da lista)
      setLista(prev => prev.filter(e => e.id !== id))
      if (lista.length === 1) onDone()
    }
  
    function handleRejeitar(id) {
      // rejeitado = mantém o email
      setLista(prev => prev.filter(e => e.id !== id))
      if (lista.length === 1) onDone()
    }
  
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.title}>confirmar exclusões</span>
          <span style={styles.count}>{lista.length} pendentes</span>
        </div>
  
        <p style={styles.hint}>a IA não tem certeza sobre esses emails. o que fazer?</p>
  
        <div style={styles.lista}>
          {lista.map(email => (
            <div key={email.id} style={styles.card}>
              <p style={styles.motivo}>⚠️ {email.motivo}</p>
              <p style={styles.emailText}>{email.id}</p>
              <div style={styles.actions}>
                <button style={styles.rejeitarBtn} onClick={() => handleRejeitar(email.id)}>
                  manter
                </button>
                <button style={styles.aprovarBtn} onClick={() => handleAprovar(email.id)}>
                  apagar
                </button>
              </div>
            </div>
          ))}
        </div>
  
        <button style={styles.doneBtn} onClick={onDone}>pular todos</button>
      </div>
    )
  }
  
  import { useState } from "react"
  
  const styles = {
    container: { display: "flex", flexDirection: "column", height: "480px", padding: "20px", gap: "12px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: "16px", fontWeight: "600", color: "#fff" },
    count: { fontSize: "12px", color: "#666", background: "#1a1a1a", padding: "2px 8px", borderRadius: "10px" },
    hint: { fontSize: "12px", color: "#555" },
    lista: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" },
    card: { background: "#1a1a1a", borderRadius: "10px", padding: "14px", border: "1px solid #2a2a2a" },
    motivo: { fontSize: "12px", color: "#EF9F27", marginBottom: "6px" },
    emailText: { fontSize: "11px", color: "#555", marginBottom: "12px" },
    actions: { display: "flex", gap: "8px" },
    rejeitarBtn: {
      flex: 1, padding: "8px", borderRadius: "6px",
      border: "1px solid #333", background: "none", color: "#888", cursor: "pointer", fontSize: "13px"
    },
    aprovarBtn: {
      flex: 1, padding: "8px", borderRadius: "6px",
      border: "none", background: "#E24B4A", color: "#fff", cursor: "pointer", fontSize: "13px"
    },
    doneBtn: {
      width: "100%", padding: "12px", borderRadius: "10px",
      border: "1px solid #333", background: "none", color: "#666",
      fontSize: "13px", cursor: "pointer"
    }
  }