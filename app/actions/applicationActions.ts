'use server'

import dbConnect from '@/lib/mongodb';
import Application from '@/models/Application';

export async function saveJobAsDraft(jobData: {
  title: string;
  company: string;
  description: string;
  email?: string | null;
}) {
  try {
    await dbConnect();
    
    // Create the new document in MongoDB
    const newApp = await Application.create({
      jobTitle: jobData.title,
      company: jobData.company,
      description: jobData.description,
      email: jobData.email,
      status: 'Draft'
    });

    return { success: true, id: newApp._id.toString() };
  } catch (error) {
    console.error("Failed to save draft:", error);
    return { success: false, error: "Failed to save to database" };
  }
}