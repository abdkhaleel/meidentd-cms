import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET() {
  try {
    // Use the Prisma client to find all users in the database
    const users = await prisma.user.findMany();

    // If successful, return the users (will be an empty array for now)
    return NextResponse.json({ users });
  } catch (error) {
    // If an error occurs, log it and return a server error response
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}