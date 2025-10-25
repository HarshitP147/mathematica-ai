"use server";

import { redirect } from "next/navigation";

export  async function someAction(input: string, files: any[], pathname: string) {

    console.log(input);
    console.log(files);
    console.log(pathname);

    // check if the incoming pathname is from chat
    if (pathname.startsWith("/chat/")) {
        // perform some action specific to chat
        const chatId = pathname.split("/chat/")[1];
        console.log("Performing action for chat ID:", chatId);

    } else {
        // redirect to a new chat id, go home for now
        redirect("/");
    }
}
