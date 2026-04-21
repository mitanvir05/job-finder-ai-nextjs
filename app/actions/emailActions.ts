'use server'

import dbConnect from '@/lib/mongodb';
import UserSettings from '@/models/UserSettings';
import Application from '@/models/Application';
import Resume from '@/models/Resume';
import nodemailer from 'nodemailer';
import { revalidatePath } from 'next/cache';
import { readFile } from 'fs/promises';
import { join } from 'path';

const USER_ID = 'anonymous_user';

export async function sendApplicationEmail(data: {
    applicationId?: string;
    company: string;
    jobTitle: string;
    recruiterEmail: string;
    recruiterName?: string;
    templateSubject: string;
    templateBody: string;
    resumeId: string;
}) {
    try {
        await dbConnect();

        const settings = await UserSettings.findOne({ userId: USER_ID });
        if (!settings || !settings.smtpHost || !settings.smtpPass) {
            return { success: false, error: "SMTP settings are incomplete. Please configure them in Settings." };
        }

        const resume = await Resume.findById(data.resumeId);
        if (!resume) {
            return { success: false, error: "Selected resume not found." };
        }

        // Process Template Variables (ADDED RECRUITER NAME)
        const finalRecruiterName = data.recruiterName?.trim() || 'Hiring Manager';

        const processedSubject = data.templateSubject
            .replace(/{job_title}/gi, data.jobTitle)
            .replace(/{company_name}/gi, data.company)
            .replace(/{recruiter_name}/gi, finalRecruiterName);

        let processedBody = data.templateBody
            .replace(/{job_title}/gi, data.jobTitle)
            .replace(/{company_name}/gi, data.company)
            .replace(/{recruiter_name}/gi, finalRecruiterName);

        if (settings.emailSignature) {
            processedBody += `\n\n--\n${settings.emailSignature}`;
        }

        const transporter = nodemailer.createTransport({
            host: settings.smtpHost,
            port: Number(settings.smtpPort) || 465,
            secure: Number(settings.smtpPort) === 465,
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPass,
            },
        });

        const fileName = resume.fileUrl.split('/').pop();
        const filePath = join(process.cwd(), 'public', 'uploads', fileName);
        const fileBuffer = await readFile(filePath);

        await transporter.sendMail({
            from: settings.fromAddress || settings.smtpUser,
            to: data.recruiterEmail,
            subject: processedSubject,
            text: processedBody,
            attachments: [
                {
                    filename: resume.fileName,
                    href: resume.fileUrl,
                    contentType: 'application/pdf'
                }
            ]
        });

        if (data.applicationId) {
            await Application.findByIdAndUpdate(data.applicationId, { status: 'Sent' });
        } else {
            await Application.create({
                userId: USER_ID,
                company: data.company,
                jobTitle: data.jobTitle,
                email: data.recruiterEmail,
                status: 'Sent'
            });
        }

        revalidatePath('/applications');
        revalidatePath('/');
        return { success: true };

    } catch (error: any) {
        console.error("Failed to send email:", error);
        return { success: false, error: error.message || "Failed to send email via SMTP." };
    }
}