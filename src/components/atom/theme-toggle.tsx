'use client'

import { useTheme } from "next-themes"

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Toggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    return (
        <div className="flex  items-center justify-between space-x-4">
            <Label htmlFor="theme-toggle">Dark Mode</Label>
            <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
            />
        </div>
    );
}