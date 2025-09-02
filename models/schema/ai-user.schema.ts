import mongoose from "mongoose"

const aiUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  uploadedFiles: [{
    type: String // Just store S3 URLs/links as strings
  }],
  conversations: [{
    prompt: {
      type: String,
      required: true
    },
    response: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

// Add indexes for efficient queries
aiUserSchema.index({ email: 1 })

export default aiUserSchema