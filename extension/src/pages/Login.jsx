import { login } from "../../utils/api.js"
import { saveToken } from "../../utils/storage.js"

export default function Login({ onLogin }) {
  async function handleLogin() {
    try {
      const res = await login()
      await saveToken(res.token)
      onLogin(res.token)
    } catch (err) {
      alert("Erro ao fazer login: " + err.message)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.logo}>noSPAM</div>
      <p style={styles.subtitle}>varredura inteligente de emails</p>
      <button style={styles.btn} onClick={handleLogin}>
        entrar com Google
      </button>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "480px",
    gap: "16px",
    padding: "32px"
  },
  logo: {
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "-1px",
    color: "#fff"
  },
  subtitle: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "16px"
  },
  btn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#1D9E75",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  }
}