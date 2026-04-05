import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    // For now, we use a generic user ID until we add login/auth
    userId: { type: String, default: 'anonymous_user' }, 
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    description: { type: String },
    email: { type: String }, 
    status: { 
      type: String, 
      enum: ['Draft', 'Sent'], 
      default: 'Draft' 
    },
    dateApplied: { type: Date }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);