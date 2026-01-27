import { CallLogEntry } from "@/schemas/schemas/call-logs"
import {
  ButtonIconCopy,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gearment/ui3"
import { useState } from "react"

interface Props {
  callLog: CallLogEntry
}

// Simple JSON syntax highlighter
const JsonHighlighter = ({ json }: { json: string }) => {
  try {
    const parsed = JSON.parse(json)
    const formatted = JSON.stringify(parsed, null, 2)

    return (
      <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
        <code
          dangerouslySetInnerHTML={{
            __html: formatted
              .replace(
                /(".*?")\s*:/g,
                '<span class="text-blue-600 font-semibold">$1</span>:',
              )
              .replace(
                /:\s*(".*?")/g,
                ': <span class="text-green-600">$1</span>',
              )
              .replace(
                /:\s*(\d+)/g,
                ': <span class="text-orange-600">$1</span>',
              )
              .replace(
                /:\s*(true|false)/g,
                ': <span class="text-purple-600">$1</span>',
              )
              .replace(
                /:\s*(null)/g,
                ': <span class="text-gray-500">$1</span>',
              ),
          }}
        />
      </pre>
    )
  } catch {
    return (
      <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto">
        <code>{json}</code>
      </pre>
    )
  }
}

// Format cURL command for better readability
const formatCurlCommand = (curl: string) => {
  if (!curl) return curl

  // Format the cURL command with line breaks for better readability
  return curl
    .replace(/ -H /g, " \\\n  -H ")
    .replace(/ -X /g, " \\\n  -X ")
    .replace(/ -d /g, " \\\n  -d ")
    .replace(/ --data /g, " \\\n  --data ")
    .replace(/ --header /g, " \\\n  --header ")
    .replace(/curl /, "curl \\\n  ")
}

export function CallLogDetailView({ callLog }: Props) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="request">Request</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="curl">cURL</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {callLog.errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm font-medium text-red-800">Error</div>
              <div className="mt-1 text-sm text-red-600">
                {callLog.errorMessage}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Request Headers</CardTitle>
              </CardHeader>
              <CardContent>
                <JsonHighlighter
                  json={JSON.stringify(callLog.requestHeaders, null, 2)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Response Headers</CardTitle>
              </CardHeader>
              <CardContent>
                <JsonHighlighter
                  json={JSON.stringify(callLog.responseHeaders, null, 2)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Request Body</CardTitle>
            </CardHeader>
            <CardContent>
              {callLog.requestBody ? (
                <JsonHighlighter json={callLog.requestBody} />
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  No request body
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Response Body</CardTitle>
            </CardHeader>
            <CardContent>
              {callLog.responseBody ? (
                <JsonHighlighter json={callLog.responseBody} />
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  No response body
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curl" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">cURL Command</CardTitle>
                <ButtonIconCopy
                  copyValue={callLog.curlCommand}
                  size="default"
                />
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap break-all">
                <code>{formatCurlCommand(callLog.curlCommand)}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
