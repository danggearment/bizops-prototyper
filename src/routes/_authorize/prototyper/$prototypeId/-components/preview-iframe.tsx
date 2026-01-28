import { Card, CardContent, CardHeader, CardTitle } from "@gearment/ui3"

interface Props {
  html: string
}

export default function PreviewIframe({ html }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <iframe
            srcDoc={html}
            className="w-full h-[600px] bg-white"
            title="Prototype Preview"
            sandbox="allow-scripts"
          />
        </div>
      </CardContent>
    </Card>
  )
}