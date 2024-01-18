import { Gender } from "@prisma/client";
import * as z from "zod";

export const MemberSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot be more than 50 characters in length" }),
  phone: z
    .string()
    .refine((value) => value.length === 11, {
      message: "Phone number must contain 11 digits in length",
    })
    .refine((value) => value.startsWith("01"), {
      message: "Phone number must start with 01",
    }),
  email: z
    .string()
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      {
        message: "Invalid Email",
      }
    ),
  memberId: z
    .string().min(1, {message: "Id is required"}),
  address: z
    .string()
    .max(70, { message: "Address is too long" })
    .optional(),
  age: z.coerce
    .number({
      required_error: "phone is required",
      invalid_type_error: "Phone is required",
    })
    .min(8, { message: "Minimum age must be 8 years" })
    .max(100, { message: "Maximum age must be 100 years" }),
  gender: z.nativeEnum(Gender, {
    required_error: "Gender is required",
    invalid_type_error: "Gender is required",
  }),
  image: z.string(),
  startDate: z.date({
    invalid_type_error: "Joining date is missing",
    required_error: "Joining date is missing",
  }),
});

export const MembershipPlanSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot be more than 50 characters in length" }),
  durationInMonth: z.coerce
    .number()
    .min(1, { message: "Duration cannot be less than 1 month" })
    .max(60, { message: "Duration cannot be higher than 5 years" }),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price is required",
    })
    .max(100000, {
      message: "Price is too high",
    }),
  benefitIds: z.array(z.string()),
});

export const MembershipBenefitSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot be more than 100 characters in length" }),
});

export const AdmissionFeeSchema = z.object({
  admissionFee: z.coerce
    .number()
    .max(10000, { message: "Admission fee is too high." })
    .nullable(),
});

export const FaqSchema = z.object({
  question: z
    .string()
    .min(10, {
      message: "Question is too short. Expected at least 10 characters",
    })
    .max(200, { message: "No more than 200 characters." }),
  answer: z
    .string()
    .min(10, {
      message: "Question is too short. Expected at least 10 characters.",
    })
    .max(10000, { message: "No more than 1000 characters." }),
});

export const QuestionSchema = z.object({
  question: z.string().min(10, { message: "Question is too short" }).max(200, {
    message: "Question is too long. Expected at least 10 characters.",
  }),
});

export const AnswerSchema = z.object({
  answer: z.string().min(10, { message: "Answer is too short" }).max(200, {
    message: "Answer is too long. Expected at least 10 characters.",
  }),
});
