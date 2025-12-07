import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';
import path from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const documentId = url.pathname.split('/').pop();

    if (!documentId) return NextResponse.json({ error: 'ID missing' }, { status: 400 });

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    try {
      if (document.url) {
        await del(document.url);
      }
    } catch (fileError) {
      console.warn(`Failed to delete blob file: ${fileError}`);
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) return NextResponse.json({ error: 'ID missing' }, { status: 400 });

    const body = await request.json();
    const { title } = body;

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}