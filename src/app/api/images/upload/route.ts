import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

// Important: We need to disable the default Next.js body parser for this route
// because we are handling a stream of file data.
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  // 1. Get the FormData from the request
  const formData = await request.formData();

  // 2. Get the file and the associated sectionId from the form data
  const file = formData.get('file') as File | null;
  const sectionId = formData.get('sectionId') as string | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!sectionId) {
    return NextResponse.json({ error: 'Section ID is missing' }, { status: 400 });
  }

  // 3. Create the directory for uploads if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  // 4. Generate a unique filename to prevent overwrites
  const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
  const filePath = path.join(uploadDir, uniqueFilename);

  // 5. Save the file to the filesystem
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }

  // 6. Create a record in the database
  try {
    const newImage = await prisma.image.create({
      data: {
        url: `/uploads/${uniqueFilename}`, // The public URL path
        altText: file.name, // Use the original filename as a default alt text
        order: 0, // You can make this more dynamic later
        sectionId: sectionId,
      },
    });
    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error creating image record:', error);
    // If DB write fails, try to clean up the saved file
    await fs.unlink(filePath);
    return NextResponse.json({ error: 'Failed to create image record in database' }, { status: 500 });
  }
}