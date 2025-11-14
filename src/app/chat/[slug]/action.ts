"use server";

import { revalidatePath } from "next/cache";

export async function chatAction(data: any) {
    // Implementation for chat action
    console.log(data);

    revalidatePath(`/chat/${data.slug}`);
}
