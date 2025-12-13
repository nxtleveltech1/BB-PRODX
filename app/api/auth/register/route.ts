import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db/client-node";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Force Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const existingUserRows = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()))
      .limit(1)
    const existingUser = existingUserRows[0]

    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this email already exists",
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "user",
        emailVerified: null, // Will be verified via email confirmation
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Return success response (without sensitive data)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Failed to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}