import Markdown from "react-markdown"

type Props = {
  content: string
  className?: string
}

export function LogMarkdown({ content, className }: Props) {
  return (
    <div className={className}>
      <Markdown>{content}</Markdown>
    </div>
  )
}
