import { z } from "zod"

export const FileSchema = z.object({
  fileName: z.string(),
  filePath: z.string(),
  fileUrl: z.string(),
})

export type FileType = z.infer<typeof FileSchema>
