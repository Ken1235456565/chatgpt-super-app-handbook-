#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SOURCE_URL = 'https://docs.google.com/document/d/1h-7OtxJBAktYswMUojZBh2NJ2gB9SaNH0hhRCtcb1po/edit';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    args[token.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function usage() {
  return [
    'Usage:',
    '  node scripts/import-google-doc.mjs --outline /path/document-outline.json --document /path/document-result.json',
    '',
    'Optional:',
    '  --output /path/to/src/content/docs',
    '  --assets /path/to/public/images',
  ].join('\n');
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\u000b/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function inlineText(value) {
  return normalizeText(value).replace(/\s*\n\s*/g, ' ');
}

function tableText(value) {
  return inlineText(value).replaceAll('|', '\\|');
}

function excerpt(value, limit = 180) {
  const text = inlineText(value);
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit - 1);
  const naturalEnd = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, naturalEnd > 120 ? naturalEnd : clipped.length)}…`;
}

function sanitizeFilename(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-');
}

function extensionFor(contentType) {
  const type = contentType.split(';')[0].trim().toLowerCase();
  return {
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
  }[type] ?? 'png';
}

function embeddedObjectData(object) {
  const embedded = object?.inlineObjectProperties?.embeddedObject ?? {};
  return {
    uri: embedded?.imageProperties?.contentUri,
    alt: embedded?.description || embedded?.title || 'Illustration from the source document',
  };
}

async function downloadImages(inlineObjects, assetsDirectory) {
  await mkdir(assetsDirectory, { recursive: true });
  const existingFiles = await readdir(assetsDirectory).catch(() => []);
  const images = new Map();

  for (const [objectId, object] of Object.entries(inlineObjects ?? {})) {
    const base = sanitizeFilename(objectId);
    const existing = existingFiles.find((filename) => filename.startsWith(`${base}.`));
    const { uri, alt } = embeddedObjectData(object);

    if (existing) {
      images.set(objectId, { src: `/images/${existing}`, alt });
      continue;
    }

    if (!uri) {
      console.warn(`Skipping ${objectId}: no image URL.`);
      continue;
    }

    try {
      const response = await fetch(uri, { redirect: 'follow' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get('content-type') || 'image/png';
      if (!contentType.toLowerCase().startsWith('image/')) {
        throw new Error(`unexpected content type ${contentType}`);
      }
      const filename = `${base}.${extensionFor(contentType)}`;
      const bytes = Buffer.from(await response.arrayBuffer());
      await writeFile(path.join(assetsDirectory, filename), bytes);
      images.set(objectId, { src: `/images/${filename}`, alt });
      console.log(`Downloaded ${filename}`);
    } catch (error) {
      console.warn(`Could not download ${objectId}: ${error.message}`);
    }
  }

  return images;
}

function collectRawParagraphs(root) {
  const paragraphs = new Map();

  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      for (const child of value) visit(child);
      return;
    }
    if (Number.isFinite(value.startIndex) && value.paragraph) {
      paragraphs.set(value.startIndex, value.paragraph);
    }
    for (const child of Object.values(value)) visit(child);
  }

  visit(root);
  return paragraphs;
}

function imageBlocks(record, rawParagraphs, imageMap) {
  const paragraph = rawParagraphs.get(record.startIndex);
  if (!paragraph) return [];
  const blocks = [];
  for (const element of paragraph.elements ?? []) {
    const objectId = element?.inlineObjectElement?.inlineObjectId;
    if (!objectId) continue;
    const image = imageMap.get(objectId);
    if (image) {
      const safeAlt = image.alt.replaceAll('"', '&quot;');
      blocks.push(`<figure><img src="${image.src}" alt="${safeAlt}" loading="lazy" /><figcaption>${image.alt}</figcaption></figure>`);
    } else {
      blocks.push(`> Illustration unavailable in this build: ${embeddedObjectData({}).alt}`);
    }
  }
  return blocks;
}

function buildTables(records) {
  const tables = new Map();
  for (const record of records) {
    if (!record.table) continue;
    const key = record.table.tableStartIndex;
    if (!tables.has(key)) tables.set(key, new Map());
    const cells = tables.get(key);
    const cellKey = `${record.table.rowIndex}:${record.table.columnIndex}`;
    const existing = cells.get(cellKey) ?? [];
    if (normalizeText(record.text)) existing.push(tableText(record.text));
    cells.set(cellKey, existing);
  }
  return tables;
}

function renderTable(cells) {
  const coordinates = [...cells.keys()].map((key) => key.split(':').map(Number));
  const rowCount = Math.max(...coordinates.map(([row]) => row), 0) + 1;
  const columnCount = Math.max(...coordinates.map(([, column]) => column), 0) + 1;
  const rows = [];

  for (let row = 0; row < rowCount; row += 1) {
    const values = [];
    for (let column = 0; column < columnCount; column += 1) {
      values.push((cells.get(`${row}:${column}`) ?? []).join('<br>'));
    }
    rows.push(values);
  }

  if (!rows.length) return '';
  const header = rows[0].map((value, index) => value || `Column ${index + 1}`);
  const divider = header.map(() => '---');
  const body = rows.slice(1);
  return [header, divider, ...body].map((row) => `| ${row.join(' | ')} |`).join('\n');
}

function renderChapter(records, rawParagraphs, imageMap) {
  const tables = buildTables(records);
  const renderedTables = new Set();
  const output = [];
  let listBuffer = [];

  function flushList() {
    if (!listBuffer.length) return;
    output.push(listBuffer.join('\n'));
    listBuffer = [];
  }

  for (const record of records) {
    if (record.namedStyleType === 'HEADING_1') continue;

    if (record.table) {
      flushList();
      const tableId = record.table.tableStartIndex;
      if (!renderedTables.has(tableId)) {
        output.push(renderTable(tables.get(tableId)));
        renderedTables.add(tableId);
      }
      continue;
    }

    const images = imageBlocks(record, rawParagraphs, imageMap);
    if (images.length) {
      flushList();
      output.push(...images);
      continue;
    }

    const text = normalizeText(record.text);
    if (!text) continue;

    const headingDepth = {
      HEADING_2: 2,
      HEADING_3: 3,
      HEADING_4: 4,
      HEADING_5: 5,
      HEADING_6: 6,
    }[record.namedStyleType];

    if (headingDepth) {
      flushList();
      output.push(`${'#'.repeat(headingDepth)} ${inlineText(text)}`);
      continue;
    }

    if (record.isListItem) {
      const indent = '  '.repeat(Math.max(0, Number(record.nestingLevel) || 0));
      listBuffer.push(`${indent}- ${inlineText(text)}`);
      continue;
    }

    flushList();
    output.push(text);
  }

  flushList();
  return output.filter(Boolean).join('\n\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.outline || !args.document) {
    console.error(usage());
    process.exitCode = 1;
    return;
  }

  const projectRoot = path.resolve(import.meta.dirname, '..');
  const outputDirectory = path.resolve(args.output || path.join(projectRoot, 'src/content/docs'));
  const assetsDirectory = path.resolve(args.assets || path.join(projectRoot, 'public/images'));
  const [outline, documentResult] = await Promise.all([
    readFile(path.resolve(args.outline), 'utf8').then(JSON.parse),
    readFile(path.resolve(args.document), 'utf8').then(JSON.parse),
  ]);

  const tab = documentResult?.structuredContent?.tabs?.[0];
  if (!tab?.body || !Array.isArray(outline?.paragraphs)) {
    throw new Error('The input files do not contain the expected trusted-read document structures.');
  }

  const allRecords = outline.paragraphs;
  const bodyStart = allRecords.find(
    (record) => record.namedStyleType === 'HEADING_1' && /^Chapter 1:\s/.test(record.text),
  )?.startIndex;
  if (!Number.isFinite(bodyStart)) throw new Error('Could not find the full Chapter 1 body.');

  const records = allRecords.filter((record) => record.startIndex >= bodyStart);
  const rawParagraphs = collectRawParagraphs(tab.body);
  const imageMap = await downloadImages(tab.inlineObjects, assetsDirectory);
  const chapterStarts = records
    .map((record, index) => ({ record, index }))
    .filter(({ record }) => record.namedStyleType === 'HEADING_1' && /^Chapter \d+:\s/.test(record.text));

  await mkdir(outputDirectory, { recursive: true });

  for (let chapterIndex = 0; chapterIndex < chapterStarts.length; chapterIndex += 1) {
    const start = chapterStarts[chapterIndex].index;
    const end = chapterStarts[chapterIndex + 1]?.index ?? records.length;
    const chapterRecords = records.slice(start, end);
    const title = inlineText(chapterRecords[0].text);
    const number = Number(title.match(/^Chapter (\d+):/)?.[1] ?? chapterIndex + 1);
    const firstParagraph = chapterRecords.find(
      (record) => record.namedStyleType === 'NORMAL_TEXT' && !record.isListItem && !record.table && normalizeText(record.text),
    );
    const description = excerpt(firstParagraph?.text || title);
    const body = renderChapter(chapterRecords, rawParagraphs, imageMap);
    const filename = `chapter-${String(number).padStart(2, '0')}.md`;
    const content = [
      '---',
      `title: ${yamlString(title)}`,
      `description: ${yamlString(description)}`,
      'sidebar:',
      `  order: ${number}`,
      `  label: ${yamlString(title.replace(/^Chapter \d+:\s*/, ''))}`,
      '---',
      '',
      `<!-- Generated from ${SOURCE_URL}. Edit the source document or this file deliberately. -->`,
      '',
      body,
      '',
    ].join('\n');
    await writeFile(path.join(outputDirectory, filename), content);
    console.log(`Wrote ${filename}`);
  }

  console.log(`Imported ${chapterStarts.length} chapters into ${outputDirectory}`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

