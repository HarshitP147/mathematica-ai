'use client'

const themes = [
    { name: 'dark', label: 'Dark' },
    { name: "sunset", label: "Sunset" },
    { name: "forest", label: "Forest" },
    { name: "night", label: "Night" },
]

export default function Page() {

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedTheme = event.target.value;
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    }


    return (
        <main className="min-h-screen min-w-full">
            <fieldset className="fieldset">
                <legend className="text-lg font-medium mb-4">Select Theme</legend>
                {themes.map((theme) => (
                    <label key={theme.name} className="flex gap-2 cursor-pointer items-center">
                        <input type="radio" name="theme-radios" className="radio radio-sm theme-controller" onChange={handleThemeChange} value={theme.name} />
                        {theme.label}
                    </label>
                ))}
            </fieldset>
        </main>
    )
}