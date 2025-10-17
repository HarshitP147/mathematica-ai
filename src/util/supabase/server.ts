import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () => {
    const cookieStore = cookies();

    return createServerClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookies: {
                getAll: async () => {
                    const allCookies = (await cookieStore).getAll();
                    return allCookies;
                },
                setAll: async (cookiesToSet) => {
                    try {
                        const store = await cookieStore;
                        cookiesToSet.forEach(({ name, value, options }) =>
                            store.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        },
    );
};
