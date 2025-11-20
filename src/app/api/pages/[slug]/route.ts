// src/app/api/pages/[slug]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Section } from '@prisma/client';

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