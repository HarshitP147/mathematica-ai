"use server";

import { createClient } from "@/util/supabase/server";
import { revalidateTag } from "next/cache";

export default async function generateAudio(data: FormData) {
    // const supabase = createClient();
    console.log(data);

    revalidateTag("story-audio");
}
