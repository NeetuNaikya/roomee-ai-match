"use client"

import * as React from "react"
import { useTheme as useNextTheme } from "next-themes"

type ThemeProviderContextType = {
  theme: string
  setTheme: (theme: string) => void
}

export const ThemeProviderContext = React.createContext<ThemeProviderContextType | undefined>(
  undefined
)

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "roomee-ui-theme",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: "light" | "dark" | "system"
  storageKey?: string
}) {
  const [theme, setThemeState] = React.useState<string>(
    () => (typeof window !== "undefined" ? localStorage.getItem(storageKey) || defaultTheme : defaultTheme)
  );

  const { setTheme: setNextTheme } = useNextTheme()

  const setTheme = (theme: string) => {
    setThemeState(theme)
    setNextTheme(theme)
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, theme)
    }
  }

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}