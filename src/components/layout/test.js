// 'use client'
// import { useEffect, useState, useRef } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";

// import ChatPromptInput from "@/components/layout/chat-prompt";
// import { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor } from "@/components/ui/chat-container";
// import { ScrollButton } from "@/components/ui/scroll-button";
// import { Message } from "@/components/ui/message";
// import Response from "@/components/atom/response";

// import { createClient } from "@/util/supabase/client";

// export default function ChatBody() {
//     const [loading, setIsLoading] = useState(false);
//     const [chatMessages, setChatMessages] = useState<Array<{ message_id: string; content: string; role: string; created_at: string }>>([]);
//     const [responseText, setResponseText] = useState("");
//     const initialPromptSent = useRef(false);

//     const { slug } = useParams();
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const supabase = createClient();


//     async function handleSendPrompt(prompt: string, includeThinking: boolean, skipUserMessage = false) {
//         setIsLoading(true);

//         // Handle the chat action (e.g., send the prompt to the backend)
//         const response = await fetch('/api/chat', {
//             method: 'POST',
//             body: JSON.stringify({ messages: chatMessages, includeThinking: includeThinking, prompt: prompt, chatId: slug, skipUserMessage }),
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             keepalive: true,
//         })


//         if (!response.ok) {
//             console.error("Failed to send prompt");
//             setIsLoading(false);
//             return;
//         }

//         if (!response.body) {
//             // Fallback to read full text if stream is not available
//             const text = await response.text();
//             // console.log("Response text:", text);
//             setIsLoading(false);
//             return;
//         }

//         const reader = response.body.getReader();
//         const decoder = new TextDecoder();

//         try {
//             while (true) {
//                 const { done, value } = await reader.read();
//                 if (done) break;
//                 if (value) {
//                     // value is a Uint8Array
//                     const chunk = decoder.decode(value, { stream: true });
//                     console.log(chunk);
//                     setResponseText(prev => prev + chunk);
//                 }
//             }
//         } finally {
//             // ensure the reader is released
//             try {
//                 reader.releaseLock();
//             } catch {
//                 // ignore release errors
//             }
//             setIsLoading(false);

//             // Refresh messages from database after streaming completes
//             // Wait a bit for the onFinish callback to complete in the API
//             setTimeout(async () => {
//                 const { data, error } = await supabase
//                     .from("messages")
//                     .select('message_id, content, role, created_at')
//                     .eq('chat_id', slug)
//                     .order('messages(created_at)', { ascending: true });

//                 // router.replace(`/chat/${slug}`, { scroll: true });


//                 if (!error && data) {
//                     setChatMessages(data.map(item => item).flat());
//                     setResponseText(""); // Clear streaming response after loading from DB
//                 }
//             }, 1000);
//         }
//     }

//     // Handle initial prompt from URL
//     useEffect(() => {
//         const initialPrompt = searchParams.get('initialPrompt');

//         if (initialPrompt && !initialPromptSent.current && slug) {
//             initialPromptSent.current = true;

//             // Remove the query parameter from URL
//             router.replace(`/chat/${slug}`, { scroll: false });

//             // Send the initial prompt but skip creating user message (already in DB from /api/index)
//             handleSendPrompt(decodeURIComponent(initialPrompt), true);
//         }
//     }, [searchParams, slug, router]);

//     return (
//         <>
//             <ChatContainerRoot className="h-full  ">

//                 <ChatContainerContent className="space-y-6 p-6 mb-36">
//                     {chatMessages.length === 0 && !responseText ? (
//                         <div className="flex items-center justify-center h-full text-muted-foreground">
//                             <p>No messages yet. Start the conversation!</p>
//                         </div>
//                     ) : (
//                         <>
//                             {chatMessages.map((msg, index) => (
//                                 <div
//                                     key={msg.message_id}
//                                     className={`flex w-full px-20 ${msg.role === "user" ? "justify-end" : "justify-center"}`}
//                                 >
//                                     {msg.role === "user" ? (
//                                         <div className="group relative max-w-[75%] ml-auto">
//                                             <Message
//                                                 role="user"
//                                                 className="
//                                             animate-in fade-in-50 slide-in-from-bottom-2 duration-300
//                                             rounded-2xl px-4 py-3 shadow-sm
//                                             bg-primary text-primary-foreground rounded-br-sm
//                                             "
//                                             >
//                                                 <div className="prose prose-sm dark:prose-invert max-w-none">
//                                                     {msg.content}
//                                                 </div>
//                                             </Message>
//                                         </div>
//                                     ) : (
//                                         <div className="group relative w-full ">
//                                             {/* AI Response (streaming) - Only show when streaming and not in DB yet */}
//                                             <Response content={msg.content} isStreaming={true} />
//                                        </div>
//                                     )}
//                                 </div>
//                             ))}
//                             <div className="flex px-20  w-full">
//                                 {responseText && <Response content={responseText} isStreaming={loading} />}
//                             </div>
//                         </>
//                     )}
//                 </ChatContainerContent>

//                 <footer className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-transparent">
//                     <div className="max-w-4xl mx-auto relative">
//                         <ScrollButton variant={"default"} className="absolute -top-16 left-1/2 -translate-x-1/2 z-30" />
//                         <ChatPromptInput loading={loading} sendPrompt={handleSendPrompt} />
//                     </div>
//                 </footer>
//             </ChatContainerRoot >
//         </>

//     );
// }