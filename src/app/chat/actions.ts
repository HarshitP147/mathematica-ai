"use server";

export  async function someAction(input: string, files: any[], pathname: string) {

    console.log(input);
    console.log(files);
    console.log(pathname);
}
