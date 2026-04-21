import mongoose from 'mongoose';

const UserSettingsSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true, default: 'anonymous_user' },

        // Profile Info
        fullName: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        shortIntro: { type: String, default: '' },
        portfolioLink: { type: String, default: '' },
        githubLink: { type: String, default: '' },
        linkedinLink: { type: String, default: '' },
        emailSignature: { type: String, default: '' },

        // SMTP Settings
        smtpHost: { type: String, default: '' },
        smtpPort: { type: String, default: '' },
        smtpUser: { type: String, default: '' },
        smtpPass: { type: String, default: '' },
        fromAddress: { type: String, default: '' },

        // API Overrides
        geminiApiKey: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.models.UserSettings || mongoose.model('UserSettings', UserSettingsSchema);