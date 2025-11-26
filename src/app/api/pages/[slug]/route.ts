import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Section } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

type SectionWithChildren = Section & { children: SectionWithChildren[] };

export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const slug = pathSegments.pop();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug could not be determined from the URL' },
        { status: 400 }
      );
    }

    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const sections = await prisma.section.findMany({
      where: { pageId: page.id },
      orderBy: { order: 'asc' },
      include: {
        images: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
    });

    const sectionMap = new Map<string, SectionWithChildren>();
    const topLevelSections: SectionWithChildren[] = [];

    for (const section of sections) {
      sectionMap.set(section.id, { ...section, children: [] });
    }

    for (const section of sections) {
      const sectionWithChildren = sectionMap.get(section.id)!;
      if (section.parentId) {
        const parent = sectionMap.get(section.parentId);
        if (parent) {
          parent.children.push(sectionWithChildren);
        }
      } else {
        topLevelSections.push(sectionWithChildren);
      }
    }
    
    const pageWithSections = {
      ...page,
      sections: topLevelSections,
    };

    return NextResponse.json(pageWithSections);

  } catch (error) {
    console.error(`Error fetching page for slug extracted from URL:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/');
        const slug = pathSegments.pop();
        
        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is missing from the URL' },
                { status: 400 }
            );
        }

        const page = await prisma.page.findUnique({
            where: { slug }
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        const imagesToDelete = await prisma.image.findMany({
            where: {
                section: {
                    pageId: page.id
                }
            }
        });

        for (const img of imagesToDelete) {
            try {
                const filePath = path.join(process.cwd(), 'public', img.url);
                await fs.unlink(filePath);
            } catch (err) {
                console.warn(`Could not delete file: ${img.url}`, err);
            }
        }

        await prisma.page.delete({
            where: { id: page.id }
        });

        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error('Error deleting page:', error);
        return NextResponse.json(
            { error: 'Failed to delete page' },
            { status: 500 },
        );
    }
}