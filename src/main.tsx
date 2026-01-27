import ReactDOM from "react-dom/client"
import { TanstackRoute } from "./tanstack-route"
import AppContext from "./AppContext"

BigInt.prototype.toJSON = function () {
  return Number(this)
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppContext>
    <TanstackRoute />
  </AppContext>,
)
