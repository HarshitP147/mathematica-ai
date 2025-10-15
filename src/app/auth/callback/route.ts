import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/util/supabase/server";

export async function GET(request: NextRequest) {
    const supabase = createClient();
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("Error exchanging code for session:", error);
            return NextResponse.redirect(
                `${origin}/auth?error=${error.message}`,
            );
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${origin}/`);
}
