'use server'

import dbConnect from '@/lib/mongodb';
import UserSettings from '@/models/UserSettings';
import { revalidatePath } from 'next/cache';

const USER_ID = 'anonymous_user'; // Hardcoded for this clone

export async function getUserSettings() {
    await dbConnect();
    let settings = await UserSettings.findOne({ userId: USER_ID });

    // If no settings exist yet, create an empty document
    if (!settings) {
        settings = await UserSettings.create({ userId: USER_ID });
    }

    return JSON.parse(JSON.stringify(settings));
}

export async function updateUserSettings(data: any) {
    try {
        await dbConnect();
        await UserSettings.findOneAndUpdate(
            { userId: USER_ID },
            { $set: data },
            { new: true, upsert: true }
        );

        revalidatePath('/profile');
        revalidatePath('/settings');
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Failed to save settings." };
    }
}