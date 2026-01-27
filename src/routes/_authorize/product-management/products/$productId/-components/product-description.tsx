import { NotepadText } from "lucide-react"
import { useState } from "react"
import { useProductDetail } from "../-product-detail-context"

const MAX_DESCRIPTION_LENGTH = 300

export function ProductDescription() {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const { productDetail } = useProductDetail()
  const { description } = productDetail

  return (
    <div className="p-4 rounded-md bg-background space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <NotepadText className="h-5 w-5 text-primary" />
          <p className="text-lg font-medium">Description</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Product description for customers and manufacturing teams
        </p>
      </div>
      <div>
        {description && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {showFullDescription || description.length <= 0 ? (
                <span dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      description.substring(0, MAX_DESCRIPTION_LENGTH) + "...",
                  }}
                />
              )}
            </p>
            {description.length > MAX_DESCRIPTION_LENGTH && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFullDescription(!showFullDescription)
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
