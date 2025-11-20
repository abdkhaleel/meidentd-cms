// src/app/api/images/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE(
  request: Request,
  // We keep the context parameter for correct function signature, but will not use it.
  context: { params: { id: string } }
) {
  try {
    // --- WORKAROUND FOR PARAMS BUG ---
    // Manually parse the ID from the request URL.
    const url = new URL(request.url);
    const imageId = url.pathname.split('/').pop();
    // ------------------------------------

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is missing' }, { status: 400 });
    }

    // 1. Find the image record in the database
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 2. Delete the image record from the database
    await prisma.image.delete({
      where: { id: imageId },
    });

    // 3. Delete the actual file from the filesystem
    try {
      const filePath = path.join(process.cwd(), 'public', image.url);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error(`Failed to delete image file, but DB record was removed: ${fileError}`);
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Error deleting image:', error);
    if ((error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}