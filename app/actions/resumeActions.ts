'use server'

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import dbConnect from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { revalidatePath } from 'next/cache';

const USER_ID = 'anonymous_user';

export async function getResumes() {
    await dbConnect();
    const resumes = await Resume.find({ userId: USER_ID }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(resumes));
}

export async function uploadResume(formData: FormData) {
    const file: File | null = formData.get('file') as unknown as File;

    if (!file) {
        return { success: false, error: "No file uploaded." };
    }

    try {
        // 1. Prepare the file buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 2. Define the path (public/uploads folder)
        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Ensure the directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory already exists, do nothing
        }

        // 3. Create a unique filename to prevent overwriting
        const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const filePath = join(uploadDir, uniqueName);

        // 4. Save the file locally
        await writeFile(filePath, buffer);
        const fileUrl = `/uploads/${uniqueName}`;

        // 5. Save the record in MongoDB
        await dbConnect();
        const count = await Resume.countDocuments({ userId: USER_ID });

        await Resume.create({
            userId: USER_ID,
            fileName: file.name,
            fileUrl: fileUrl,
            fileSize: file.size,
            isDefault: count === 0 // Make it the default if it's the first resume
        });

        revalidatePath('/resumes');
        return { success: true };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Failed to upload file." };
    }
}

export async function deleteResume(id: string) {
    await dbConnect();
    await Resume.findByIdAndDelete(id);
    // Note: For a production app, you would also delete the physical file using fs.unlink() here
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