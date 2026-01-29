import { Button, Card, CardContent, Textarea } from "@gearment/ui3"
import { format } from "date-fns"
import { Plus, User } from "lucide-react"
import { useState } from "react"
import { useClientDetailContext } from "../../-client-detail-context"

export default function NotesList() {
  const { client } = useClientDetailContext()
  const [newNote, setNewNote] = useState("")

  const handleAddNote = () => {
    // TODO: Replace with real API call
    console.log("Adding note:", newNote)
    setNewNote("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Textarea
              placeholder="Add a note about this client..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {client.notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{note.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(
                        new Date(note.createdAt),
                        "MMM dd, yyyy 'at' HH:mm",
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {note.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
