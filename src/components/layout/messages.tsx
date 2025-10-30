'use client'

import { Key } from "react";


export default function Messages() {
    // const { messages } = useChat();

    const messages:any = []

    return (
        <div id="chat-messages-container" className="h-full p-4 pb-40 overflow-auto text-sm text-muted-foreground">
            {messages.map((message: { id: Key | null | undefined; role: string; parts: any[]; }) => (
                <div key={message.id} className="whitespace-pre-wrap">
                    {message.role === 'user' ? 'User: ' : 'AI: '}
                    {message.parts.map((part, i) => {
                        switch (part.type) {
                            case 'text':
                                return <div key={`${message.id}-${i}`}>{part.text}</div>;
                        }
                    })}
                </div>
            ))}
        </div>
    );
}