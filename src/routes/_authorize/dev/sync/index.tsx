import { SeedPolicyModal } from "@/services/modals/modal-seed-policy/modal-seed-policy"
import { useSeedPolicyModal } from "@/services/modals/modal-seed-policy/modal-seed-policy-store"
import { SyncCatalogModal } from "@/services/modals/modal-sync-catalog/modal-sync-catalog"
import { useSyncCatalogModal } from "@/services/modals/modal-sync-catalog/modal-sync-catalog-store"
import { Button } from "@gearment/ui3"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authorize/dev/sync/")({
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "#",
        name: "Dev",
        search: undefined,
      },
      {
        link: "/dev/sync",
        name: "Sync",
        search: undefined,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const openSyncCatalogModal = useSyncCatalogModal((state) => state.setOpen)
  const openSeedPolicyModal = useSeedPolicyModal((state) => state.setOpen)

  const handleSyncCatalogModal = () => {
    openSyncCatalogModal({
      title: "Sync Catalog",
      description: "Sync Catalog",
      onConfirm: () => console.log("Sync catalog confirmed"),
    })
  }

  const handleSeedPolicyModal = () => {
    openSeedPolicyModal({
      title: "Seed Policy",
      description: "Seed Policy",
      onConfirm: () => console.log("Seed policy confirmed"),
    })
  }

  return (
    <div className="">
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleSyncCatalogModal}>
          Sync Catalog
        </Button>
        <Button variant="outline" onClick={handleSeedPolicyModal}>
          Seed Policy
        </Button>
      </div>
      <SyncCatalogModal />
      <SeedPolicyModal />
    </div>
  )
}
