import { Button } from "@/components/ui/button"
import Toggle from "@/components/atom/theme-toggle"
import { DialogContent, DialogFooter, DialogHeader, DialogClose, DialogTitle } from "@/components/ui/dialog"

export default function Settings() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
                <Toggle />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" type="submit">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>

    )
}