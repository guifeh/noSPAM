import { useEffect, useState } from "react"
import { getToken } from "../utils/storage.js"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import Context from "./pages/Context.jsx"
import Confirm from "./pages/Confirm.jsx"

export default function Popup() {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState("home") // home | context | confirm
  const [pendentes, setPendentes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getToken().then((t) => {
      setToken(t)
      setLoading(false)
    })
  }, [])

  if (loading) return <div style={styles.center}>carregando...</div>
  if (!token) return <Login onLogin={setToken} />

  if (page === "context") {
    return <Context onBack={() => setPage("home")} />
  }

  if (page === "confirm") {
    return (
      <Confirm
        pendentes={pendentes}
        onDone={() => { setPendentes([]); setPage("home") }}
      />
    )
  }

  return (
    <Home
      token={token}
      onLogout={() => setToken(null)}
      onEditContext={() => setPage("context")}
      onConfirm={(emails) => { setPendentes(emails); setPage("confirm") }}
    />
  )
}

const styles = {
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "480px",
    color: "#888"
  }
}