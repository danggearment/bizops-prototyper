import { createFileRoute } from "@tanstack/react-router"
import Login from "./-components/login.tsx"

export const Route = createFileRoute("/_unauthorize/login/")({
  component: Index,
})

function Index() {
  return <Login />
}
