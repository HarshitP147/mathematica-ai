import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/util/supabase/client";

export async function GET(req: NextRequest) {
    try {
        // Get the authenticated user from Clerk
        console.log(req);

        return NextResponse.redirect(new URL("/", req.url));
    } catch (error) {
        console.error("Error in auth callback:", error);
        return NextResponse.redirect(new URL("/auth", req.url));
    }
}
