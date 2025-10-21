
import DrawerContent from "@/components/drawer-content";

export default function Drawer({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className={`drawer drawer-open `}>
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content min-h-screen min-w-[100%] absolute  ">
                {children}
            </div>

            <DrawerContent />

        </div>
    );
}