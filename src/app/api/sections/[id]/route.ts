import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json(
                { error: 'Section ID is missing from the URL' },
                { status: 400 }
            );
        }

        const body  = await request.json();
        const { title, content, order } = body;

        if (!title && !content && order === undefined) {
            return NextResponse.json(
                { error: 'At least one of title, content, or order must be provided for update' },
                { status: 400 }
            );
        }

        const updatedSection = await prisma.section.update({
            where: { id },
            data: {
                title,
                content,
                order,
            },
        });

        return NextResponse.json(updatedSection, { status: 200 });
    }

    catch (error) {
        console.error('Error updating section:', error);

        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }

        return NextResponse.json(
            { error: 'Failed to update section' },
            { status: 500 },
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        
        if (!id) {
            return NextResponse.json(
                { error: 'Section ID is missing from the URL' },
                { status: 400 }
            );
        }

        const childCount = await prisma.section.count({
            where: { parentId: id },
        });

        if (childCount > 0) {
            return NextResponse.json(
                { error: 'Cannot delete section with existing child sections' },
                { status: 400 }
            );
        }

        await prisma.section.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    }

    catch (error) {
        console.error('Error deleting section:', error);
        
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }
        return NextResponse.json(
            { error: 'Failed to delete section' },
            { status: 500 },
        );
    }
}