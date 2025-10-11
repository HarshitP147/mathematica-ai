'use client'

import { createContext } from "react";
import { useRouter } from "next/navigation";
import type { CredentialResponse } from "@react-oauth/google";

import { createClient } from "@/util/supabase/client";


const AuthContext = createContext({
    googleSignIn: async (credentialsResponse: CredentialResponse) => { },
    signOut: () => { },
});

export default AuthContext;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const router = useRouter();


    async function googleSignIn(credentialsResponse: CredentialResponse) {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: credentialsResponse.credential || "",
        });

        if (data) {
            console.log("Google sign-in successful:", data);
            // Redirect to home page after successful sign-in
            router.push('/');
        }

        if (error) {
            console.error("Error during Google sign-in:", error);
        }
    }



    const authValue = {
        googleSignIn: googleSignIn,
        signOut: () => {
            supabase.auth.signOut({
                scope: "global",
            }).then(({ error }) => {
                if (error) {
                    console.error("Error during sign-out:", error);
                } else {
                    console.log("Sign-out successful");
                    // Redirect to home after sign-out
                    router.push('/');
                }
            });
        }
    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}
