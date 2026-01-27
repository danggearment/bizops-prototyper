import BoringAvatar from "@/components/common/boring-avatar/boring-avatar.tsx"
import { useAuth } from "@/services/auth"
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import { ArrowRightLeftIcon, MoonIcon, SunIcon } from "lucide-react"
import { useEffect, useState } from "react"
import MenuStaff from "../menu-staff/menu-staff"
import ModalChangePassword from "../modal-change-password"
import { TIMEZONES, useTimezone } from "../select-timezone"
import Watcher from "../watcher"

export default function UserAvatar() {
  const { user } = useAuth()
  const [openMenuUser, setOpenMenuUser] = useState(false)
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const { timezone, setTimezone } = useTimezone()

  const handleToggleTheme = () => {
    setIsLight(!isLight)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    )
  }

  useEffect(() => {
    const theme = localStorage.getItem("theme")
    if (theme) {
      document.documentElement.classList.add(theme)
      setIsLight(theme === "light")
    }
  }, [])

  const timezoneLabel = TIMEZONES.find((tz) => tz.value === timezone)?.label

  const handleSelectTimezone = () => {
    const currentIndex = TIMEZONES.findIndex((tz) => tz.value === timezone)
    const nextIndex = (currentIndex + 1) % TIMEZONES.length
    const nextTimezone = TIMEZONES[nextIndex].value
    setTimezone(nextTimezone)
  }

  return (
    <>
      <DropdownMenu open={openMenuUser} onOpenChange={setOpenMenuUser}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-transparent hover:border-border bg-transparent shadow-none"
          >
            <div className="text-sm font-medium">Welcome, {user?.username}</div>
            <BoringAvatar
              className={cn("rounded-lg border", "w-[24px] h-[24px] ")}
              alt={user?.staffId}
              name={user?.staffId}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" collisionPadding={24}>
          <DropdownMenuItem className="md:hidden flex">
            <Watcher />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSelectTimezone}
            className="md:hidden flex"
          >
            {timezoneLabel} <ArrowRightLeftIcon />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleTheme}>
            {isLight ? <MoonIcon /> : <SunIcon />}
            Appearance
          </DropdownMenuItem>
          <MenuStaff
            setOpenMenu={setOpenMenuUser}
            setOpenModalChangePassword={setOpenModalChangePassword}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalChangePassword
        openModal={openModalChangePassword}
        setOpenModal={setOpenModalChangePassword}
      />
    </>
  )
}
