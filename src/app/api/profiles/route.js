import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ensure this route runs on the Node.js runtime (not Edge), 
// which is required for Prisma to use a direct database connection
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Recommended for dynamic API routes

// --- GET: Retrieve and filter profiles ---
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const major = searchParams.get("major");
    const year = searchParams.get("year");
    const q = searchParams.get("q"); // Used for name search

    const where = {};

    // Filter by major (case-insensitive)
    if (major) {
      where.major = { equals: major, mode: 'insensitive' };
    }

    // Filter by year (must be a valid number)
    if (year) {
      const numericYear = Number(year);
      if (!isNaN(numericYear)) {
        where.year = numericYear;
      }
    }

    // Filter by name (case-insensitive contains/search)
    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }

    // Fetch data using Prisma
    const results = await prisma.profile.findMany({
      where: where,
      // You can add orderBy here if needed, e.g., orderBy: { name: 'asc' }
    });

    return Response.json(results, { status: 200 });

  } catch (error) {
    console.error("Error fetching profiles:", error);
    return Response.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

// --- POST: Create a new profile ---
export async function POST(request) {
  try {
    const { name, major, year, gpa } = await request.json();

    // Basic validation
    if (
      typeof name !== "string" ||
      typeof major !== "string" ||
      typeof year !== "number" ||
      typeof gpa !== "number" ||
      year < 1 || year > 4 ||
      gpa < 0 || gpa > 4
    ) {
      return Response.json({ error: "Invalid fields or data types" }, { status: 400 });
    }

    // Create the record in the database using Prisma
    const newProfile = await prisma.profile.create({
      data: {
        name,
        major,
        year,
        gpa,
      },
    });

    return Response.json(newProfile, { status: 201 });

  } catch (err) {
    // Check for Prisma errors (e.g., if a field has a unique constraint)
    if (err.code) {
        return Response.json({ error: `Database error: ${err.code}` }, { status: 400 });
    }
    console.error("Error creating profile:", err);
    return Response.json({ error: "Invalid JSON or failed to create profile" }, { status: 400 });
  }
}

// --- DELETE: Delete a profile by ID ---
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id || isNaN(id)) {
      return Response.json({ error: "Missing or invalid profile ID" }, { status: 400 });
    }

    // Delete the record using Prisma
    const deleted = await prisma.profile.delete({
      where: {
        // Assumes 'id' is the unique identifier (primary key) in your schema
        id: id,
      },
    });

    return Response.json({ message: `Profile with ID ${deleted.id} deleted successfully` }, { status: 200 });

  } catch (error) {
    // Handle "Not Found" error from Prisma (P2025)
    if (error.code === 'P2025') {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }
    console.error("Error deleting profile:", error);
    return Response.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}