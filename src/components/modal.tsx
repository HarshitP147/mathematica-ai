'use client'
import { useRouter } from "next/navigation";

import { createClient } from "@/util/supabase/client"

export default function Modal() {
    const router = useRouter();
    const closeBtnRef = (node: HTMLButtonElement) => { if (node) node.focus(); };

    const supabase = createClient();

    const handleSignOut = (e: React.FormEvent) => {
        e.preventDefault();
        supabase.auth.signOut({
        }).then(({ error }) => {
            if (error) {
                console.error("Error signing out:", error);
            } else {
                console.log("Sign-out successful");
                (document.getElementById('modal') as HTMLDialogElement).close();
                router.push('/');
                router.refresh()
            }
        });
    };

    {/* Open the modal using document.getElementById('ID').showModal() method */ }
    return (
        <dialog id="modal" className="modal ">
            <div className="modal-box">
                <h3 className="font-bold text-lg ">Hold up!</h3>
                <p className="py-4">Are you sure you want to sign out?</p>
                <form method="dialog" className="modal-action">
                    <button ref={closeBtnRef} className="btn rounded-md btn-active">Cancel</button>
                    <button className="btn text-error-content rounded-md btn-error" onClick={handleSignOut}>Sign out</button>
                </form>
            </div>
        </dialog>
    )
}