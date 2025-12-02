import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from 'fs';
import path from 'path';

async function getAllSectionIds(rootId: string): Promise<string[]> {
    const sections = await prisma.section.findMany({
        where: { parentId: rootId },
        select: { id: true }
    });

    let ids = [rootId]; 
    
    for (const section of sections) {
        const descendantIds = await getAllSectionIds(section.id);
        ids = [...ids, ...descendantIds];
    }
    
    return ids;
}

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

// export async function DELETE(request: Request) {
//     try {
//         const url = new URL(request.url);
//         const id = url.pathname.split('/').pop();
        
//         if (!id) {
//             return NextResponse.json(
//                 { error: 'Section ID is missing from the URL' },
//                 { status: 400 }
//             );
//         }

//         const childCount = await prisma.section.count({
//             where: { parentId: id },
//         });

//         if (childCount > 0) {
//             return NextResponse.json(
//                 { error: 'Cannot delete section with existing child sections' },
//                 { status: 400 }
//             );
//         }

//         await prisma.section.delete({
//             where: { id },
//         });

//         return new NextResponse(null, { status: 204 });
//     }

//     catch (error) {
//         console.error('Error deleting section:', error);
        
//         if ((error as any).code === 'P2025') {
//             return NextResponse.json({ error: 'Section not found' }, { status: 404 });
//         }
//         return NextResponse.json(
//             { error: 'Failed to delete section' },
//             { status: 500 },
//         );
//     }
// }
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

        const allSectionIds = await getAllSectionIds(id);

        const imagesToDelete = await prisma.image.findMany({
            where: {
                sectionId: { in: allSectionIds }
            }
        });

        const documentsToDelete = await prisma.document.findMany({
            where: { sectionId: { in: allSectionIds } }
        });

        for (const img of imagesToDelete) {
            try {
                const filePath = path.join(process.cwd(), 'public', img.url);
                await fs.unlink(filePath);
            } catch (err) {
                console.warn(`Could not delete file: ${img.url}`, err);
            }
        }

        for (const doc of documentsToDelete) {
            try {
                const filePath = path.join(process.cwd(), 'public', doc.url);
                await fs.unlink(filePath);
            } catch (err) {
                console.warn(`Could not delete document file: ${doc.url}`, err);
            }
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