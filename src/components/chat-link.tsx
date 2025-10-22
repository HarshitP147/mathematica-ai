'use client'

import Link from "next/link";
import { useParams } from "next/navigation";

export default  function ChatLink(props: { chatId: string, name: string }) {

    const params = useParams();

    const isActive = params.slug === props.chatId;

    return (
        <Link href={`/chat/${props.chatId}`}
            className={` p-2 rounded-md transition-colors text-lg text-base-content ${isActive ? "bg-primary " : "hover:bg-primary/70"}`}
        >
            {props.name}
        </Link>
    )
}