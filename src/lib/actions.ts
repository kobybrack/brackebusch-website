'use server';

import dbClient from './dbClient';

export const submitPost = async (formData: FormData) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a delay
    // return;
    return dbClient.upsertPost(formData);
};
