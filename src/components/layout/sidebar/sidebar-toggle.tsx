import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useSidebar,
} from "@gearment/ui3"

export function SidebarToggle() {
  const { open, toggleSidebar } = useSidebar()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={toggleSidebar}>
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="4" fill="#169DD8" />
              <path
                d="M21.5 11.5V6.5H16.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 16.5V21.5H11.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.5 6.5L15.25 12.75"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.75 15.25L6.5 21.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2520_49962)">
                <path
                  d="M24 0H4C1.79086 0 0 1.79086 0 4V24C0 26.2091 1.79086 28 4 28H24C26.2091 28 28 26.2091 28 24V4C28 1.79086 26.2091 0 24 0Z"
                  fill="#169DD8"
                />
                <path
                  d="M21.5 11.5V6.5H16.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 16.5V21.5H11.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.5 6.5L15.25 12.75"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.75 15.25L6.5 21.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2520_49962">
                  <rect width="28" height="28" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent align="start" side="right">
        Toggle Sidebar
      </TooltipContent>
    </Tooltip>
  )
}
