'use server'

import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { revalidatePath } from 'next/cache';

const USER_ID = 'anonymous_user';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getResumes() {
    await dbConnect();
    const resumes = await Resume.find({ userId: USER_ID }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(resumes));
}

export async function uploadResume(formData: FormData) {
    const file: File | null = formData.get('file') as unknown as File;

    if (!file) return { success: false, error: "No file uploaded." };

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload directly to Cloudinary from memory buffer
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'raw' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        const fileUrl = (uploadResult as any).secure_url;

        await dbConnect();
        const count = await Resume.countDocuments({ userId: USER_ID });

        await Resume.create({
            userId: USER_ID,
            fileName: file.name,
            fileUrl: fileUrl,
            fileSize: file.size,
            isDefault: count === 0
        });

        revalidatePath('/resumes');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to upload file to Cloudinary." };
    }
}

export async function deleteResume(id: string) {
    await dbConnect();
    // Optional: Add logic here to delete the file from Cloudinary as well
    await Resume.findByIdAndDelete(id);
    revalidatePath('/resumes');
    return { success: true };
}

export async function setDefaultResume(id: string) {
    await dbConnect();
    await Resume.updateMany({ userId: USER_ID }, { isDefault: false });
    await Resume.findByIdAndUpdate(id, { isDefault: true });
    revalidatePath('/resumes');
    return { success: true };
}