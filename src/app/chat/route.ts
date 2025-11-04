// redirect to home page
import { redirect, RedirectType } from "next/navigation";

export async function GET() {
    return redirect("/", RedirectType.replace);
}
