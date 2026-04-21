'use server'

import dbConnect from '@/lib/mongodb';
import Template from '@/models/Template';
import { revalidatePath } from 'next/cache';

const USER_ID = 'anonymous_user';

export async function getTemplates() {
  await dbConnect();
  const templates = await Template.find({ userId: USER_ID }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(templates));
}

export async function saveTemplate(data: { id?: string, name: string, subject: string, body: string }) {
  await dbConnect();
  
  if (data.id) {
    // Update existing
    await Template.findByIdAndUpdate(data.id, {
      name: data.name, subject: data.subject, body: data.body
    });
  } else {
    // Check if this is the first template; if so, make it default
    const count = await Template.countDocuments({ userId: USER_ID });
    
    await Template.create({
      userId: USER_ID,
      name: data.name,
      subject: data.subject,
      body: data.body,
      isDefault: count === 0
    });
  }
  
  revalidatePath('/templates');
  return { success: true };
}

export async function deleteTemplate(id: string) {
  await dbConnect();
  await Template.findByIdAndDelete(id);
  revalidatePath('/templates');
  return { success: true };
}

export async function setDefaultTemplate(id: string) {
  await dbConnect();
  // Set all to false
  await Template.updateMany({ userId: USER_ID }, { isDefault: false });
  // Set the selected to true
  await Template.findByIdAndUpdate(id, { isDefault: true });
  
  revalidatePath('/templates');
  return { success: true };
}