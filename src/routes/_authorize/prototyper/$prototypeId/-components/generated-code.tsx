import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@gearment/ui3"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export interface GeneratedFileType {
  path: string
  content: string
  type: "create" | "update"
}

interface Props {
  files: GeneratedFileType[]
}

export default function GeneratedCode({ files }: Props) {
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const handleCopy = async (content: string, path: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  if (!files || files.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No generated files
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Files ({files.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={files[0]?.path} className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            {files.map((file, index) => (
              <TabsTrigger
                key={file.path}
                value={file.path}
                className="text-xs"
              >
                {file.path.split("/").pop()}
              </TabsTrigger>
            ))}
          </TabsList>

          {files.map((file) => (
            <TabsContent
              key={file.path}
              value={file.path}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-muted-foreground">
                  {file.path}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(file.content, file.path)}
                >
                  {copiedPath === file.path ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                <code>{file.content}</code>
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
