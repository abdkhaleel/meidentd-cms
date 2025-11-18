// src/app/api/pages/[slug]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Section } from '@prisma/client';

type SectionWithChildren = Section & { children: SectionWithChildren[] };

export async function GET(
  request: Request,
  // We keep the context parameter here for correct function signature,
  // but we will NOT be using it.
  context: { params: { slug: string } }
) {
  try {
    // --- WORKAROUND FOR PARAMS BUG ---
    // We manually parse the slug from the request URL instead of using context.params.
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    // The last part of the path (e.g., 'about-us' from '/api/pages/about-us') is our slug.
    const slug = pathSegments.pop();
    // ------------------------------------

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug could not be determined from the URL' },
        { status: 400 }
      );
    }

    // 1. Find the page by its unique slug
    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 2. Fetch all sections belonging to this page
    const sections = await prisma.section.findMany({
      where: { pageId: page.id },
      orderBy: { order: 'asc' },
    });

    // 3. Arrange sections into a nested structure
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
    
    // 4. Return the page with its fully structured sections
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