import { RouteConfig } from "interfaces"
import saveController from "../controller/save"
import { InputValidator } from "../middleware/validators.middleware"

const getSaveRoutes = (): RouteConfig[] => [
  {
    path: "/save/session",
    method: "post",
    validators: [InputValidator.saveSessionValidator],
    controller: saveController.saveCompleteSession,
  },
]

export default getSaveRoutes