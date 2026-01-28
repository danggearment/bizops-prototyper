import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gearment/ui3"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { CaseStudyType } from "../table/columns"
import { usePrototyperContext } from "../../-prototyper-context"

const caseStudySchema = z.object({
  prototypeId: z.string().min(1, "Prototype is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().url("Must be a valid URL"),
  content: z.string().min(1, "Content is required"),
  order: z.number().min(0),
})

type CaseStudyFormData = z.infer<typeof caseStudySchema>

interface CaseStudyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  caseStudy?: CaseStudyType | null
}

export default function CaseStudyDialog({
  open,
  onOpenChange,
  caseStudy,
}: CaseStudyDialogProps) {
  const { prototypes, addCaseStudy, updateCaseStudy } = usePrototyperContext()
  const isEdit = !!caseStudy

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: caseStudy
      ? {
          prototypeId: caseStudy.prototypeId,
          title: caseStudy.title,
          description: caseStudy.description,
          thumbnail: caseStudy.thumbnail,
          content: caseStudy.content,
          order: caseStudy.order,
        }
      : {
          prototypeId: "",
          title: "",
          description: "",
          thumbnail: "",
          content: "",
          order: 1,
        },
  })

  const onSubmit = (data: CaseStudyFormData) => {
    if (isEdit && caseStudy) {
      updateCaseStudy(caseStudy.id, data)
    } else {
      addCaseStudy(data)
    }
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Case Study</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prototypeId">Prototype *</Label>
            <Select
              onValueChange={(value) => setValue("prototypeId", value)}
              defaultValue={caseStudy?.prototypeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a prototype" />
              </SelectTrigger>
              <SelectContent>
                {prototypes.map((proto) => (
                  <SelectItem key={proto.id} value={proto.id}>
                    {proto.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.prototypeId && (
              <p className="text-sm text-destructive">{errors.prototypeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter case study title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the case study"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL *</Label>
            <Input
              id="thumbnail"
              {...register("thumbnail")}
              placeholder="https://example.com/image.jpg"
            />
            {errors.thumbnail && (
              <p className="text-sm text-destructive">{errors.thumbnail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Full case study content"
              rows={6}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="1"
            />
            {errors.order && (
              <p className="text-sm text-destructive">{errors.order.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}