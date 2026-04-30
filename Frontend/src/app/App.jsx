import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { useAuth } from "../features/auth/Hooks/useAuth"
import { useEffect } from "react"
import Test from "../features/test/Test"


function App() {


  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()

  }, [])

  return (
    <>
      <RouterProvider router={router} />

      {/* <Test /> */}
    </>
  )
}

export default App
