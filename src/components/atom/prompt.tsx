import Image from "next/image";
import Link from "next/link";
import { FileText, Image as ImageIcon, File, Download } from "lucide-react";

import { Message } from "@/components/ui/message"

import { createClient } from "@/util/supabase/client"

const supabase = createClient()

// File extensions that can be previewed in browser
const PREVIEWABLE_EXTENSIONS = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico',
    'pdf', 'txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts',
    'mp4', 'webm', 'mp3', 'wav', 'ogg'
];

function isPreviewable(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    return PREVIEWABLE_EXTENSIONS.includes(extension);
}

function getFileIcon(filename: string) {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(extension)) {
        return ImageIcon;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'md', 'csv', 'json', 'xml', 'html'].includes(extension)) {
        return FileText;
    }
    return File;
}

type PromptProps = {
    message: {
        content: string;
        msg_media?: string[]; // Optional array of media IDs
    }
};

export default function Prompt({ message }: PromptProps) {
    // Separate images and other files
    const images = message.msg_media?.filter(url => /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) || [];
    const otherFiles = message.msg_media?.filter(url => !/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) || [];

    return (
        <div className="group relative max-w-[85%] sm:max-w-[75%] my-3 ml-auto flex flex-col items-end gap-2">
            {/* Images section - displayed without box, with hover overlay */}
            {images.length > 0 && (
                <div className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                    {images.map((mediaUrl, index) => {
                        const bucket = mediaUrl.split('/')[0];
                        const fullFilePath = mediaUrl.split('/').slice(1).join('/');
                        const fileName = fullFilePath.split('/').pop() || 'Image';
                        const { data } = supabase.storage.from(bucket).getPublicUrl(fullFilePath);

                        return (
                            <Link
                                key={`${data.publicUrl}-${index}`}
                                href={data.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative rounded-xl overflow-hidden group/image"
                            >
                                <Image
                                    src={data.publicUrl}
                                    alt={fileName}
                                    width={300}
                                    height={200}
                                    className="w-full h-auto max-h-48 object-cover transition-all duration-200 group-hover/image:brightness-50"
                                    unoptimized
                                />
                                {/* Filename overlay - visible on hover at top */}
                                <div className="absolute inset-x-0 top-0 px-3 py-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                                    <span className="text-sm text-white font-medium truncate block">
                                        {fileName}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Other files section - in a box with list style */}
            {otherFiles.length > 0 && (
                <div className="w-full rounded-xl bg-primary/90 border border-primary-foreground/20 overflow-hidden">
                    <div className="flex flex-col divide-y divide-primary-foreground/10">
                        {otherFiles.map((mediaUrl, index) => {
                            const bucket = mediaUrl.split('/')[0];
                            const fullFilePath = mediaUrl.split('/').slice(1).join('/');
                            const fileName = fullFilePath.split('/').pop() || 'File';
                            const { data } = supabase.storage.from(bucket).getPublicUrl(fullFilePath);
                            
                            const canPreview = isPreviewable(fileName);
                            const Icon = getFileIcon(fileName);

                            return (
                                <Link
                                    key={`${data.publicUrl}-${index}`}
                                    href={data.publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={!canPreview ? fileName : undefined}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-primary-foreground/10 transition-colors"
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
                        })}
                    </div>
                </div>
            )}

            {/* Text prompt - BELOW the files */}
            {message.content && (
                <Message
                    role="user"
                    className="rounded-2xl px-4 py-3 shadow-md bg-primary text-primary-foreground rounded-br-md hover:shadow-lg transition-shadow duration-200"
                >
                    <div className="prose prose-sm prose-invert max-w-none leading-relaxed">
                        {message.content}
                    </div>
                </Message>
            )}
        </div>
    )
}