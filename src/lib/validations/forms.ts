import { z } from "zod"

export const fieldTypes = [
  "text", "email", "number", "textarea", "select", 
  "radio", "checkbox", "date", "file"
] as const

export const fieldSchema = z.object({
  id: z.string(),
  type: z.enum(fieldTypes),
  label: z.string().min(1, "Field label is required"),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
  }).optional(),
})

export const formSchema = z.object({
  title: z.string().min(1, "Form title is required").max(100),
  description: z.string().max(500).optional(),
  fields: z.array(fieldSchema).min(1, "At least one field is required"),
  settings: z.object({
    thankYouMessage: z.string().optional(),
    redirectUrl: z.string().url().optional(),
    allowMultipleSubmissions: z.boolean().default(false),
  }).optional(),
})

export const submissionSchema = z.record(z.string(), z.any());

export type Field = z.infer<typeof fieldSchema>
export type FormData = z.infer<typeof formSchema>
export type SubmissionData = z.infer<typeof submissionSchema>