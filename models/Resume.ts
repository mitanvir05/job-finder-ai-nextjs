import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, default: 'anonymous_user' },
        fileName: { type: String, required: true }, 
        fileUrl: { type: String, required: true },  
        fileSize: { type: Number },                 
        isDefault: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);