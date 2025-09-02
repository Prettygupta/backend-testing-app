import { MONGO_URI } from "../constants"
import mongoose from "mongoose"
import { logger } from "./logger"

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("Connected to MongoDB")
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error)
  })

export default mongoose
