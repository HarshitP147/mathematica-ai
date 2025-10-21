export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    return <div>Chat Page for slug: {resolvedParams.slug}</div>;
}