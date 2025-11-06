'use client'

import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

import {
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogAction,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"

import { createClient } from "@/util/supabase/client"


export default function DeleteAlert({ chatName, chatId }: { chatName?: string, chatId: string }) {

    const supabase = createClient();
    const router = useRouter();

    const handleDelete = async () => {
        if (!chatId) return;

        const { error } = await supabase
            .from("chats")
            .delete()
            .eq("chat_id", chatId);

        if (error) {
            console.error("Error deleting chat:", error);
            return;
        }

        // redirect to home page after deletion
        router.push('/')
        router.refresh();
    };

    return (
        <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-xl">Delete Chat?</AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-base">
                    {chatName ? (
                        <>
                            Are you sure you want to delete <span className="font-semibold text-foreground">"{chatName}"</span>?
                            This action cannot be undone and all messages in this chat will be permanently deleted.
                        </>
                    ) : (
                        "Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently deleted."
                    )}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-2">
                <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    Delete Chat
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}