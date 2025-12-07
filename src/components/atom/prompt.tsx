import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, File as FileIcon, FileText, Image as ImageIcon } from "lucide-react";

import { Message } from "@/components/ui/message";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/util/supabase/client";

const supabase = createClient();

// File extensions that can be previewed in browser
const PREVIEWABLE_EXTENSIONS = [
    "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico",
    "pdf", "txt", "md", "json", "xml", "html", "css", "js", "ts",
    "mp4", "webm", "mp3", "wav", "ogg",
];

function isPreviewable(filename: string): boolean {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    return PREVIEWABLE_EXTENSIONS.includes(extension);
}

function getFileIcon(filename: string) {
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(extension)) {
        return ImageIcon;
    }
    if (["pdf", "doc", "docx", "txt", "md", "csv", "json", "xml", "html"].includes(extension)) {
        return FileText;
    }
    return FileIcon;
}

type PromptProps = {
    message: {
        content: string;
        msg_media?: string[];
    };
};

function ImageSkeleton() {
    return (
        <div className="relative rounded-xl overflow-hidden">
            <Skeleton className="w-full h-48 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 animate-pulse" />
                    <span className="text-sm">Loading preview...</span>
                </div>
            </div>
        </div>
    );
}

function PromptImageViewer({ mediaUrl, index }: { mediaUrl: string; index: number }) {
    const [signedUrl, setSignedUrl] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        let isMounted = true;
        const bucket = mediaUrl.split("/")[0];
        const fullFilePath = mediaUrl.split("/").slice(1).join("/");

        supabase.storage
            .from(bucket)
            .createSignedUrl(fullFilePath, 60 * 60 * 24)
            .then(({ data, error }) => {
                if (!isMounted) return;
                if (error) {
                    console.error("Error creating signed URL:", error);
                    setErrorMsg("Preview unavailable");
                    return;
                }
                setSignedUrl(data?.signedUrl || "");
            });

        return () => {
            isMounted = false;
        };
    }, [mediaUrl]);

    const fullFilePath = mediaUrl.split("/").slice(1).join("/");
    const fileName = fullFilePath.split("/").pop() || "Image";

    if (!signedUrl) {
        if (errorMsg) {
            return (
                <div className="relative rounded-xl overflow-hidden bg-destructive/10 border border-destructive/20 flex items-center justify-center min-h-32 px-4 py-6 text-sm text-destructive">
                    {errorMsg}
                </div>
            );
        }
        return <ImageSkeleton />;
    }

    return (
        <Link
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative rounded-xl overflow-hidden group/image"
        >
            <Image
                src={signedUrl}
                alt={fileName}
                width={300}
                height={200}
                className="w-full h-auto max-h-48 object-cover transition-all duration-200 group-hover/image:brightness-50"
                priority={index === 0}
            />
            <div className="absolute inset-x-0 top-0 px-3 py-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                <span className="text-sm text-center text-white font-medium truncate block">
                    {fileName}
                </span>
            </div>
        </Link>
    );
}

function FileSkeleton() {
    return (
        <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
            <Skeleton className="h-10 w-10 rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-4 shrink-0" />
        </div>
    );
}

function PromptFileViewer({ mediaUrl, index }: { mediaUrl: string; index: number }) {
    const [signedUrl, setSignedUrl] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        let isMounted = true;
        const bucket = mediaUrl.split("/")[0];
        const fullFilePath = mediaUrl.split("/").slice(1).join("/");

        supabase.storage
            .from(bucket)
            .createSignedUrl(fullFilePath, 60 * 60 * 24)
            .then(({ data, error }) => {
                if (!isMounted) return;
                if (error) {
                    console.error("Error creating signed URL:", error);
                    setErrorMsg("Download unavailable");
                    return;
                }
                setSignedUrl(data?.signedUrl || "");
            });

        return () => {
            isMounted = false;
        };
    }, [mediaUrl]);

    const fullFilePath = mediaUrl.split("/").slice(1).join("/");
    const fileName = fullFilePath.split("/").pop() || "File";
    const Icon = getFileIcon(fileName);
    const canPreview = isPreviewable(fileName);

    if (!signedUrl) {
        if (errorMsg) {
            return (
                <div className="flex items-center gap-3 px-4 py-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="h-8 w-8 rounded-md bg-destructive/10 flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate flex-1">{errorMsg}</span>
                </div>
            );
        }
        return <FileSkeleton />;
    }

    return (
        <Link
            key={`${signedUrl}-${index}`}
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={!canPreview ? fileName : undefined}
            className="flex items-center gap-3 px-4 py-3 hover:bg-primary-foreground/10 transition-colors rounded-lg"
        >
            <div className="h-10 w-10 rounded-md bg-primary-foreground/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary-foreground/80" />
            </div>

            <span className="flex-1 text-sm text-primary-foreground truncate">
                {fileName}
            </span>

            {!canPreview && (
                <Download className="h-4 w-4 text-primary-foreground/60 shrink-0" />
            )}
        </Link>
    );
}

export default function Prompt({ message }: PromptProps) {
    const images = message.msg_media?.filter((url) => /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) || [];
    const otherFiles = message.msg_media?.filter((url) => !/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) || [];

    return (
        <div className="group relative max-w-[85%] sm:max-w-[75%] my-3 ml-auto flex flex-col items-end gap-2">
            {images.length > 0 && (
                <div
                    className={`grid gap-2 ${images.length === 1
                        ? "grid-cols-1"
                        : images.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-2 sm:grid-cols-3"
                        }`}
                >
                    {images.map((mediaUrl, index) => (
                        <Suspense key={`${mediaUrl}-${index}`} fallback={<ImageSkeleton />}>
                            <PromptImageViewer mediaUrl={mediaUrl} index={index} />
                        </Suspense>
                    ))}
                </div>
            )}

            {otherFiles.length > 0 && (
                <div className="w-full rounded-xl bg-primary/90 border border-primary-foreground/20 overflow-hidden">
                    <div className="flex flex-col divide-y divide-primary-foreground/10">
                        {otherFiles.map((mediaUrl, index) => (
                            <Suspense key={`${mediaUrl}-${index}`} fallback={<FileSkeleton />}>
                                <PromptFileViewer mediaUrl={mediaUrl} index={index} />
                            </Suspense>
                        ))}
                    </div>
                </div>
            )}

            {message.content && (
                <Message
                    role="user"
                    className="rounded-2xl px-4 py-3 shadow-md bg-primary text-primary-foreground rounded-br-md hover:shadow-lg transition-shadow duration-200"
                >
                    <div className="prose prose-sm prose-invert max-w-none leading-relaxed">{message.content}</div>
                </Message>
            )}
        </div>
    );
}
