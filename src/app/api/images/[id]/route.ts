import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';
import path from 'path';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const imageId = url.pathname.split('/').pop();

    if (!imageId) return NextResponse.json({ error: 'ID missing' }, { status: 400 });

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.image.delete({
      where: { id: imageId },
    });

    try {
        if(image.url) {
            await del(image.url);
        }
    } catch (fileError) {
      console.error(`Failed to delete blob file: ${fileError}`);
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json( { error: 'Failed to delete image' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Image ID is missing' }, { status: 400 });
    }

    const body = await request.json();
    const { caption, altText } = body;

    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        caption,
        altText,
      },
    });

    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image details' },
      { status: 500 }
    );
  }
}