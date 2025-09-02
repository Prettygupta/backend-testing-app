import { RouteConfig } from "interfaces"
import aiChatController from "../controller/ai-chat"
import { InputValidator } from "../middleware/validators.middleware"

const aiChatRoutes: RouteConfig[] = [
  {
    path: "/ai/chat",
    method: "post",
    validators: [InputValidator.aiChatValidator],
    controller: aiChatController.chatAboutFile,
  },
]

export default aiChatRoutes