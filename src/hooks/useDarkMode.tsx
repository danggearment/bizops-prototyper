import { useEffect, useState } from "react"

export default function useDarkMode(): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] {
  const [theme, setTheme] = useState("")
  const colorTheme = theme === "dark" ? "light" : "dark"

  useEffect(() => {
    setTimeout(() => {
      const html = document.querySelector("html")
      if (html) {
        html.classList.remove(colorTheme)
        html.classList.add(theme)
      }
    }, 0)
  }, [theme])

  return [colorTheme, setTheme]
}
