import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, default: 'anonymous_user' },
    name: { type: String, required: true }, 
    subject: { type: String, required: true },
    body: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Template || mongoose.model('Template', TemplateSchema);