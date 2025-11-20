'use client'

import { useRouter } from "next/navigation"
import { LogOut, Moon, Sun, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { createClient } from "@/util/supabase/client"
import { useTheme } from "next-themes"

export default function Settings() {
    const router = useRouter()
    const supabase = createClient()
    const { theme, setTheme } = useTheme()

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error("Error signing out:", error)
        } else {
            router.push('/')
            router.refresh()
        }
    }

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark")
        } else {
            setTheme("light")
        }
    }

    return (
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                    Manage your preferences and account settings
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
                {/* Appearance Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Appearance</h3>
                    </div>
                    <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            {theme === "dark" ? (
                                <Moon className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Sun className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="space-y-0.5">
                                <Label htmlFor="theme-toggle" className="text-sm font-medium">
                                    Dark Mode
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Switch between light and dark themes
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="theme-toggle"
                            checked={theme === "dark"}
                            onCheckedChange={toggleTheme}
                        />
                    </div>
                </div>

                <Separator />

                {/* Account Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Account</h3>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}