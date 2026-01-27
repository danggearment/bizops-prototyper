import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@gearment/ui3"
import { Building2, Mail, MapPin, Pencil, Phone } from "lucide-react"
import { useClientDetailContext } from "../../-client-detail-context"

export default function ClientInfoCard() {
  const { client } = useClientDetailContext()

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "enterprise":
        return <Badge variant="default">Enterprise</Badge>
      case "small-business":
        return <Badge variant="secondary">Small Business</Badge>
      default:
        return <Badge variant="outline">Individual</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="destructive">Inactive</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Information</CardTitle>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {client.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{client.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {getTypeBadge(client.type)}
              {getStatusBadge(client.status)}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          {client.company && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{client.company}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a href={`mailto:${client.email}`} className="text-primary hover:underline">
              {client.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p>{client.address}</p>
              <p>{client.city}, {client.postalCode}</p>
              <p>{client.country}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
