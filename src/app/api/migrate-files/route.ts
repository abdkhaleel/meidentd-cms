// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { put } from '@vercel/blob';
// import { promises as fs } from 'fs';
// import path from 'path';


// export async function GET() {
//   const log: string[] = [];

//   try {
//     console.log('--- STARTING MIGRATION ---');

//     const images = await prisma.image.findMany();
    
//     for (const image of images) {
//       if (image.url.startsWith('http')) {
//         console.log(`Skipping Image ${image.id} (Already remote)`);
//         continue;
//       }

//       try {
//         const localPath = path.join(process.cwd(), 'public', image.url);
        
//         const fileBuffer = await fs.readFile(localPath);
        
//         const filename = path.basename(image.url);
//         const blob = await put(`images/${filename}`, fileBuffer, {
//           access: 'public',
//         });

//         await prisma.image.update({
//           where: { id: image.id },
//           data: { url: blob.url },
//         });

//         const msg = `[SUCCESS] Image migrated: ${filename} -> ${blob.url}`;
//         console.log(msg);
//         log.push(msg);

//       } catch (err) {
//         const msg = `[ERROR] Failed to migrate Image ID ${image.id} (${image.url}): ${err}`;
//         console.error(msg);
//         log.push(msg);
//       }
//     }

//     const documents = await prisma.document.findMany();

//     for (const doc of documents) {
//       if (doc.url.startsWith('http')) {
//         console.log(`Skipping Document ${doc.id} (Already remote)`);
//         continue;
//       }

//       try {
//         const localPath = path.join(process.cwd(), 'public', doc.url);
//         const fileBuffer = await fs.readFile(localPath);
        
//         const filename = path.basename(doc.url);
//         const blob = await put(`documents/${filename}`, fileBuffer, {
//           access: 'public',
//         });

//         await prisma.document.update({
//           where: { id: doc.id },
//           data: { url: blob.url },
//         });

//         const msg = `[SUCCESS] Document migrated: ${filename} -> ${blob.url}`;
//         console.log(msg);
//         log.push(msg);

//       } catch (err) {
//         const msg = `[ERROR] Failed to migrate Document ID ${doc.id} (${doc.url}): ${err}`;
//         console.error(msg);
//         log.push(msg);
//       }
//     }

//     console.log('--- MIGRATION FINISHED ---');
//     return NextResponse.json({ 
//       status: 'Migration finished', 
//       logs: log 
//     });

//   } catch (error) {
//     console.error('Fatal Migration Error:', error);
//     return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
//   }
// }