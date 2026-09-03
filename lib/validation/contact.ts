import { z } from "zod"

export const CreateContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .regex(/^\+91\d{10}$/, "Must be valid Indian phone number +91XXXXXXXXXX"),
  email: z.string().email("Must be a valid email address").optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional()
})

export type ContactFormValues = z.infer<typeof CreateContactSchema>