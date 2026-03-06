import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function runBenchmark() {
    // Create dummy PDFs with 500 pages to use as source to simulate a more intensive load
    const srcDoc1 = await PDFDocument.create();
    for (let i = 0; i < 500; i++) {
        const page = srcDoc1.addPage([500, 500]);
        page.drawText(`Page ${i}`);
    }
    const srcBytes1 = await srcDoc1.save();

    const srcDoc2 = await PDFDocument.create();
    for (let i = 0; i < 500; i++) {
        const page = srcDoc2.addPage([500, 500]);
        page.drawText(`Page ${i}`);
    }
    const srcBytes2 = await srcDoc2.save();


    const pages = [];
    // interleave pages from two PDFs
    for (let i = 0; i < 500; i++) {
        pages.push({ pdfData: srcBytes1, pageIndex: i });
        pages.push({ pdfData: srcBytes2, pageIndex: i });
    }

    console.log("Starting Sequential (Original)...");
    const start1 = Date.now();
    const mergedPdf1 = await PDFDocument.create();
    const pdfCache = new Map();
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const key = page.pdfData;

        let sDoc;
        if (pdfCache.has(key)) {
            sDoc = pdfCache.get(key);
        } else {
            sDoc = await PDFDocument.load(page.pdfData);
            pdfCache.set(key, sDoc);
        }

        const copiedPages = await mergedPdf1.copyPages(sDoc, [page.pageIndex]);
        mergedPdf1.addPage(copiedPages[0]);
    }
    const end1 = Date.now();
    console.log(`Sequential: ${end1 - start1}ms`);

    console.log("Starting Grouped (Optimized)...");
    const start2 = Date.now();
    const mergedPdf2 = await PDFDocument.create();
    const pdfGroups = new Map();

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const key = page.pdfData;

        if (!pdfGroups.has(key)) {
            pdfGroups.set(key, {
            pdfData: page.pdfData,
            pageIndices: [],
            finalPositions: []
            });
        }

        const group = pdfGroups.get(key);
        group.pageIndices.push(page.pageIndex);
        group.finalPositions.push(i);
    }

    const finalCopiedPages = new Array(pages.length);

    for (const [key, group] of pdfGroups.entries()) {
        const sDoc = await PDFDocument.load(group.pdfData);
        const copiedPages = await mergedPdf2.copyPages(sDoc, group.pageIndices);

        for (let j = 0; j < copiedPages.length; j++) {
            finalCopiedPages[group.finalPositions[j]] = copiedPages[j];
        }
    }

    for (let i = 0; i < finalCopiedPages.length; i++) {
        mergedPdf2.addPage(finalCopiedPages[i]);
    }
    const end2 = Date.now();
    console.log(`Grouped: ${end2 - start2}ms`);
}

runBenchmark().catch(console.error);