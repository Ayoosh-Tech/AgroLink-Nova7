import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    role: z.enum(["farmer", "buyer"]),
    phone: z.string().optional(),
    location: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required."),
  description: z.string().optional(),
  category: z.enum(["Vegetables", "Grains", "Fruits", "Livestock", "Tubers"], {
    errorMap: () => ({ message: "Select a category." }),
  }),
  price: z.coerce.number().positive("Price must be greater than 0."),
  unit: z.string().min(1, "Unit is required (e.g. kg, bag, basket)."),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative."),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5, "Enter a delivery address."),
  deliveryPhone: z.string().min(7, "Enter a contact phone number."),
  notes: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
