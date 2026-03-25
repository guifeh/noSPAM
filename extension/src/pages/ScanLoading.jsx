import { useState, useEffect } from "react"

const FRASES = [
  "🔗 conectando com o Gmail...",
  "📬 lendo emails não lidos...",
  "🧠 IA analisando padrões...",
  "🔍 classificando emails...",
  "⚡ identificando spam...",
  "🗑️ preparando limpeza...",
]

export default function ScanLoading({ maxEmails = 20 }) {
  const [fraseIndex, setFraseIndex] = useState(0)
  const [progresso, setProgresso] = useState(0)

  // Rotaciona frases a cada 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIndex(prev => (prev + 1) % FRASES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Barra de progresso falsa — avança rápido no começo, desacelera
  useEffect(() => {
    const interval = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 92) return prev
        const step = prev < 30 ? 3 : prev < 60 ? 1.5 : 0.4
        return Math.min(prev + step, 92)
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      {/* Orb pulsante */}
      <div style={styles.orbWrapper}>
        <div style={styles.orbGlow} />
        <div style={styles.orb}>
          <span style={styles.orbIcon}>🧠</span>
        </div>
      </div>

      <p style={styles.titulo}>analisando seus emails</p>
      <p style={styles.subtitulo}>varrendo até {maxEmails} emails não lidos</p>

      {/* Frase rotativa */}
      <p style={styles.frase} key={fraseIndex}>
        {FRASES[fraseIndex]}
      </p>

      {/* Barra de progresso */}
      <div style={styles.barraContainer}>
        <div style={{ ...styles.barraFill, width: `${progresso}%` }} />
      </div>
      <p style={styles.porcentagem}>{Math.round(progresso)}%</p>
    </div>
  )
}

const pulse = `
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 0.2; }
}
`
const shimmer = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`
const fadeIn = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
`

// Injeta keyframes no head (uma vez)
if (typeof document !== "undefined") {
  const id = "scan-loading-styles"
  if (!document.getElementById(id)) {
    const style = document.createElement("style")
    style.id = id
    style.textContent = pulse + shimmer + fadeIn
    document.head.appendChild(style)
  }
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "480px",
    padding: "32px",
    gap: "12px",
  },
  orbWrapper: {
    position: "relative",
    width: "80px",
    height: "80px",
    marginBottom: "12px",
  },
  orbGlow: {
    position: "absolute",
    inset: "-10px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(29,158,117,0.4) 0%, transparent 70%)",
    animation: "pulse 2s ease-in-out infinite",
  },
  orb: {
    position: "absolute",
    inset: "0",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1D9E75 0%, #0d6b4f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 30px rgba(29,158,117,0.3), 0 0 60px rgba(29,158,117,0.15)",
  },
  orbIcon: {
    fontSize: "32px",
    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
  },
  titulo: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  subtitulo: {
    fontSize: "12px",
    color: "#555",
    marginBottom: "8px",
  },
  frase: {
    fontSize: "13px",
    color: "#1D9E75",
    height: "20px",
    animation: "fadeIn 0.4s ease",
  },
  barraContainer: {
    width: "100%",
    height: "4px",
    background: "#1a1a1a",
    borderRadius: "2px",
    overflow: "hidden",
    marginTop: "16px",
  },
  barraFill: {
    height: "100%",
    background: "linear-gradient(90deg, #1D9E75, #2edba2, #1D9E75)",
    backgroundSize: "200% 100%",
    animation: "shimmer 2s linear infinite",
    borderRadius: "2px",
    transition: "width 0.3s ease",
  },
  porcentagem: {
    fontSize: "11px",
    color: "#444",
    fontVariantNumeric: "tabular-nums",
  },
}
