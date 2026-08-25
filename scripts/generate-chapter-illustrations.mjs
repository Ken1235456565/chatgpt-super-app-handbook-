import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1920;
const HEIGHT = 930;
const OUT_DIR = path.resolve('public/images');

const C = {
  ink: '#182235',
  muted: '#59677A',
  line: '#D5DDE8',
  page: '#F4F7FB',
  white: '#FFFFFF',
  blue: '#246BEB',
  blueSoft: '#EAF1FF',
  teal: '#0F8177',
  tealSoft: '#E5F5F2',
  orange: '#B95608',
  orangeSoft: '#FFF0E5',
  purple: '#6C2DE1',
  purpleSoft: '#F1EAFF',
  green: '#2E7D32',
  greenSoft: '#EAF6EA',
  red: '#B42318',
  redSoft: '#FDECEC',
  amber: '#A15C00',
  amberSoft: '#FFF5D8',
};

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function text(x, y, value, { size = 28, weight = 400, fill = C.ink, anchor = 'start', family = 'Arial, Helvetica, sans-serif', letterSpacing = 0 } = {}) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${letterSpacing}">${esc(value)}</text>`;
}

function lines(x, y, values, { size = 27, weight = 400, fill = C.ink, gap = 38, anchor = 'start' } = {}) {
  return values.map((value, index) => text(x, y + index * gap, value, { size, weight, fill, anchor })).join('');
}

function rect(x, y, width, height, { fill = C.white, stroke = C.line, strokeWidth = 2, radius = 24 } = {}) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function circle(cx, cy, r, { fill = C.white, stroke = 'none', strokeWidth = 0 } = {}) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function arrow(x1, y1, x2, y2, { color = C.blue, width = 5, dashed = false, end = true } = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${dashed ? 'stroke-dasharray="12 12"' : ''} ${end ? 'marker-end="url(#arrowhead)"' : ''}/>`;
}

function pill(x, y, width, label, { fill = C.blueSoft, color = C.blue } = {}) {
  return `${rect(x, y, width, 48, { fill, stroke: fill, radius: 24 })}${text(x + width / 2, y + 33, label, { size: 22, weight: 700, fill: color, anchor: 'middle' })}`;
}

function iconBadge(cx, cy, label, { fill = C.blue, size = 27 } = {}) {
  return `${circle(cx, cy, 30, { fill })}${text(cx, cy + 10, label, { size, weight: 700, fill: C.white, anchor: 'middle' })}`;
}

function header(titleText, subtitleText) {
  return [
    text(84, 76, titleText, { size: 48, weight: 700 }),
    text(84, 118, subtitleText, { size: 27, fill: C.muted }),
    `<line x1="0" y1="146" x2="${WIDTH}" y2="146" stroke="${C.line}" stroke-width="4"/>`,
  ].join('');
}

function defs() {
  return `<defs>
    <marker id="arrowhead" markerWidth="22" markerHeight="22" refX="19" refY="10" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M0,0 L20,10 L0,20 Z" fill="${C.blue}"/>
    </marker>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#172033" flood-opacity="0.10"/>
    </filter>
  </defs>`;
}

function wrap(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    ${defs()}
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.page}"/>
    ${body}
  </svg>`;
}

function chapter1WorkSurface() {
  const leftX = 105;
  const rightX = 1045;
  const cardY = 230;
  const cardW = 770;
  const cardH = 480;

  return wrap([
    header('Choose the Work Surface', 'Start with the outcome, then move to the surface that can verify it.'),
    rect(leftX, cardY, cardW, cardH, { fill: C.white, stroke: C.teal, strokeWidth: 4, radius: 30 }),
    iconBadge(leftX + 70, cardY + 72, 'C', { fill: C.teal, size: 28 }),
    text(leftX + 120, cardY + 67, 'ChatGPT', { size: 38, weight: 700, fill: C.teal }),
    text(leftX + 120, cardY + 103, 'General AI workspace', { size: 24, fill: C.muted }),
    lines(leftX + 60, cardY + 182, [
      'Explain and research',
      'Draft and revise content',
      'Work with files and images',
      'Coordinate knowledge tasks',
    ], { size: 29, gap: 61 }),
    pill(leftX + 55, cardY + 405, 312, 'Ideas → useful artifacts', { fill: C.tealSoft, color: C.teal }),

    rect(rightX, cardY, cardW, cardH, { fill: C.white, stroke: C.blue, strokeWidth: 4, radius: 30 }),
    iconBadge(rightX + 70, cardY + 72, '</>', { fill: C.blue, size: 20 }),
    text(rightX + 120, cardY + 67, 'Codex', { size: 38, weight: 700, fill: C.blue }),
    text(rightX + 120, cardY + 103, 'Software-development agent', { size: 24, fill: C.muted }),
    lines(rightX + 60, cardY + 182, [
      'Inspect a repository',
      'Edit project files',
      'Run commands and tests',
      'Review diffs and failures',
    ], { size: 29, gap: 61 }),
    pill(rightX + 55, cardY + 405, 348, 'Requirements → verified code', { fill: C.blueSoft, color: C.blue }),

    arrow(875, 470, 1035, 470, { color: C.blue, width: 6 }),
    text(955, 430, 'HAND OFF', { size: 20, weight: 700, fill: C.blue, anchor: 'middle', letterSpacing: 1.5 }),

    rect(370, 775, 1180, 92, { fill: C.white, stroke: C.line, strokeWidth: 2, radius: 46 }),
    text(960, 831, 'Plan in ChatGPT  →  implement in Codex  →  review the evidence', { size: 30, weight: 700, fill: C.ink, anchor: 'middle' }),
  ].join(''));
}

function chapter1CapabilityLevels() {
  const items = [
    { label: 'Conversation', note: 'Explain · brainstorm', color: C.teal, soft: C.tealSoft },
    { label: 'Artifact revision', note: 'Draft · edit · format', color: C.blue, soft: C.blueSoft },
    { label: 'Research', note: 'Find · compare · cite', color: C.purple, soft: C.purpleSoft },
    { label: 'Connected information', note: 'Retrieve approved context', color: C.orange, soft: C.orangeSoft },
    { label: 'Tool-assisted execution', note: 'Create · run · update', color: C.green, soft: C.greenSoft },
  ];
  const cardW = 300;
  const gap = 56;
  const startX = 98;
  const y = 260;

  let body = header('From Conversation to Outcomes', 'ChatGPT can move through several working levels; authority and review still stay with the human.');
  items.forEach((item, index) => {
    const x = startX + index * (cardW + gap);
    body += rect(x, y, cardW, 350, { fill: C.white, stroke: item.color, strokeWidth: 4, radius: 28 });
    body += iconBadge(x + cardW / 2, y + 78, String(index + 1), { fill: item.color, size: 26 });
    body += text(x + cardW / 2, y + 157, item.label, { size: index === 3 || index === 4 ? 27 : 30, weight: 700, fill: item.color, anchor: 'middle' });
    const noteParts = item.note.split(' · ');
    body += lines(x + cardW / 2, y + 220, noteParts, { size: 25, fill: C.muted, gap: 40, anchor: 'middle' });
    if (index < items.length - 1) body += arrow(x + cardW + 10, y + 188, x + cardW + gap - 12, y + 188, { width: 4 });
  });
  body += rect(230, 690, 1460, 145, { fill: C.white, stroke: C.line, strokeWidth: 2, radius: 26 });
  body += iconBadge(310, 762, '✓', { fill: C.green, size: 29 });
  body += text(365, 748, 'Human responsibility', { size: 30, weight: 700, fill: C.green });
  body += text(365, 792, 'Set the goal · approve access · inspect important outputs · decide what happens next', { size: 28, fill: C.ink });
  return wrap(body);
}

function chapter1RiskMap() {
  const colX = [100, 690, 1280];
  const cards = [
    {
      title: 'Good starting tasks',
      color: C.green,
      soft: C.greenSoft,
      subtitle: 'Low cost · easy to reverse',
      items: ['Summarize notes', 'Draft an outline', 'Explain code', 'Organize ideas'],
      footer: 'Try → review → revise',
    },
    {
      title: 'Verify carefully',
      color: C.amber,
      soft: C.amberSoft,
      subtitle: 'Useful, but errors can hide',
      items: ['Research facts', 'Analyze data', 'Change project files', 'Prepare decisions'],
      footer: 'Check sources and evidence',
    },
    {
      title: 'Human authority required',
      color: C.red,
      soft: C.redSoft,
      subtitle: 'High stakes · costly errors',
      items: ['Medical decisions', 'Investment choices', 'Legal judgments', 'Security-sensitive work'],
      footer: 'Qualified review is essential',
    },
  ];

  let body = header('Match Trust to Risk', 'The harder an error is to detect or undo, the more human review the task needs.');
  cards.forEach((card, index) => {
    const x = colX[index];
    body += rect(x, 235, 540, 520, { fill: C.white, stroke: card.color, strokeWidth: 4, radius: 30 });
    body += rect(x + 1, 236, 538, 106, { fill: card.soft, stroke: card.soft, radius: 28 });
    body += text(x + 36, 287, card.title, { size: index === 2 ? 29 : 32, weight: 700, fill: card.color });
    body += text(x + 36, 324, card.subtitle, { size: 22, fill: C.muted });
    card.items.forEach((item, itemIndex) => {
      const cy = 405 + itemIndex * 70;
      body += circle(x + 55, cy - 8, 12, { fill: card.color });
      body += text(x + 84, cy, item, { size: 27, fill: C.ink });
    });
    body += pill(x + 35, 680, 470, card.footer, { fill: card.soft, color: card.color });
  });
  body += arrow(650, 485, 680, 485, { color: C.blue, width: 5 });
  body += arrow(1240, 485, 1270, 485, { color: C.blue, width: 5 });
  body += text(960, 845, 'Clear goal  +  source material  +  checkable output  +  human review', { size: 31, weight: 700, fill: C.ink, anchor: 'middle' });
  return wrap(body);
}

function chapter2AppComparison() {
  let body = header('Normal App vs. Super-App', 'The key difference is not feature count; it is where the user begins and how services connect.');

  body += rect(90, 220, 780, 600, { fill: C.white, stroke: C.orange, strokeWidth: 4, radius: 32 });
  body += text(480, 280, 'Normal app model', { size: 38, weight: 700, fill: C.orange, anchor: 'middle' });
  body += text(480, 320, 'One app, one main job', { size: 24, fill: C.muted, anchor: 'middle' });
  body += iconBadge(200, 480, 'You', { fill: C.orange, size: 21 });
  const normalApps = [
    { x: 420, y: 390, label: 'Chat' },
    { x: 650, y: 390, label: 'Pay' },
    { x: 420, y: 565, label: 'Shop' },
    { x: 650, y: 565, label: 'Book' },
  ];
  normalApps.forEach((app) => {
    body += arrow(240, 480, app.x - 15, app.y + 52, { color: C.blue, width: 3, dashed: true });
  });
  normalApps.forEach((app) => {
    body += rect(app.x, app.y, 170, 105, { fill: C.orangeSoft, stroke: C.orange, strokeWidth: 2, radius: 22 });
    body += text(app.x + 85, app.y + 64, app.label, { size: 28, weight: 700, fill: C.orange, anchor: 'middle' });
  });
  body += pill(255, 728, 450, 'Separate sign-ins · repeated context', { fill: C.orangeSoft, color: C.orange });

  body += rect(1050, 220, 780, 600, { fill: C.white, stroke: C.teal, strokeWidth: 4, radius: 32 });
  body += text(1440, 280, 'Super-app model', { size: 38, weight: 700, fill: C.teal, anchor: 'middle' });
  body += text(1440, 320, 'One home base, many connected services', { size: 24, fill: C.muted, anchor: 'middle' });
  const serviceNodes = [
    { x: 1145, y: 390, label: 'Chat' },
    { x: 1565, y: 390, label: 'Pay' },
    { x: 1145, y: 590, label: 'Shop' },
    { x: 1565, y: 590, label: 'Book' },
  ];
  serviceNodes.forEach((node) => {
    body += arrow(1440, 510, node.x + 85, node.y + 46, { color: C.blue, width: 3, end: false });
  });
  body += circle(1440, 510, 110, { fill: C.tealSoft, stroke: C.teal, strokeWidth: 5 });
  body += text(1440, 495, 'Shared', { size: 30, weight: 700, fill: C.teal, anchor: 'middle' });
  body += text(1440, 533, 'home base', { size: 30, weight: 700, fill: C.teal, anchor: 'middle' });
  serviceNodes.forEach((node) => {
    body += rect(node.x, node.y, 170, 92, { fill: C.tealSoft, stroke: C.teal, strokeWidth: 2, radius: 46 });
    body += text(node.x + 85, node.y + 57, node.label, { size: 27, weight: 700, fill: C.teal, anchor: 'middle' });
  });
  body += pill(1190, 728, 500, 'Shared identity · context · services', { fill: C.tealSoft, color: C.teal });

  body += arrow(885, 520, 1030, 520, { color: C.blue, width: 6 });
  body += text(958, 482, 'LESS FRICTION', { size: 20, weight: 700, fill: C.blue, anchor: 'middle', letterSpacing: 1.5 });
  return wrap(body);
}

function chapter5Layers() {
  const layersData = [
    { label: 'Content', note: 'What people read or see', color: C.teal, soft: C.tealSoft, width: 1050 },
    { label: 'Design', note: 'How the experience is arranged', color: C.blue, soft: C.blueSoft, width: 1170 },
    { label: 'Logic', note: 'What happens after an action', color: C.purple, soft: C.purpleSoft, width: 1290 },
    { label: 'Data', note: 'What the system remembers', color: C.orange, soft: C.orangeSoft, width: 1410 },
    { label: 'Hosting', note: 'Where other people can reach it', color: C.green, soft: C.greenSoft, width: 1530 },
  ];
  let body = header('The Five Layers of a Digital Product', 'Different tools and languages still solve the same basic product layers.');
  layersData.forEach((layer, index) => {
    const x = (WIDTH - layer.width) / 2;
    const y = 205 + index * 125;
    body += rect(x, y, layer.width, 94, { fill: layer.soft, stroke: layer.color, strokeWidth: 3, radius: 22 });
    body += text(x + 42, y + 59, layer.label, { size: 32, weight: 700, fill: layer.color });
    body += text(x + 330, y + 58, layer.note, { size: 28, fill: C.ink });
    body += pill(x + layer.width - 250, y + 23, 210, String(index + 1).padStart(2, '0'), { fill: C.white, color: layer.color });
  });
  body += text(960, 868, 'AI helps translate human intention into structure across every layer.', { size: 30, weight: 700, fill: C.ink, anchor: 'middle' });
  return wrap(body);
}

function chapter5BeginnerLadder() {
  const steps = [
    { label: 'Explanation', note: 'Understand the idea', color: C.teal, soft: C.tealSoft },
    { label: 'Visual tool', note: 'Try without code', color: C.blue, soft: C.blueSoft },
    { label: 'Template', note: 'Change one part', color: C.purple, soft: C.purpleSoft },
    { label: 'Local practice', note: 'Use a safe copy', color: C.orange, soft: C.orangeSoft },
    { label: 'Production', note: 'Add controls + experts', color: C.red, soft: C.redSoft },
  ];
  let body = header('A Safe Learning Ladder', 'Move toward higher-risk systems only as your understanding and review process improve.');
  body += `<path d="M150 710 L1770 710 L1770 760 L150 760 Z" fill="#E6EBF2"/>`;
  body += `<path d="M150 710 L1770 710 L1770 760 Z" fill="#FFD6D2" opacity="0.75"/>`;
  steps.forEach((step, index) => {
    const x = 95 + index * 360;
    const y = 560 - index * 78;
    body += rect(x, y, 310, 180, { fill: C.white, stroke: step.color, strokeWidth: 4, radius: 26 });
    body += iconBadge(x + 52, y + 52, String(index + 1), { fill: step.color, size: 24 });
    body += text(x + 98, y + 59, step.label, { size: 29, weight: 700, fill: step.color });
    body += text(x + 38, y + 123, step.note, { size: 25, fill: C.muted });
    if (index < steps.length - 1) body += arrow(x + 310, y + 90, x + 345, y + 40, { color: C.blue, width: 4 });
  });
  body += text(165, 825, 'LOWER RISK', { size: 22, weight: 700, fill: C.green, letterSpacing: 1.5 });
  body += text(1755, 825, 'HIGHER RISK', { size: 22, weight: 700, fill: C.red, anchor: 'end', letterSpacing: 1.5 });
  body += arrow(340, 814, 1570, 814, { color: C.blue, width: 5 });
  return wrap(body);
}

function chapter5Workflow() {
  const steps = [
    { label: 'Describe', question: ['What should', 'be true?'], note: 'Goal + boundaries', color: C.teal, soft: C.tealSoft },
    { label: 'Inspect', question: ['What exists', 'right now?'], note: 'Files + structure', color: C.blue, soft: C.blueSoft },
    { label: 'Edit', question: ['What is the', 'smallest change?'], note: 'One coherent step', color: C.purple, soft: C.purpleSoft },
    { label: 'Verify', question: ['What evidence', 'proves it works?'], note: 'Test + preview + diff', color: C.green, soft: C.greenSoft },
  ];
  let body = header('The Beginner Workflow', 'A bounded loop makes changes easier to understand, review, and recover.');
  steps.forEach((step, index) => {
    const x = 105 + index * 455;
    body += rect(x, 245, 360, 420, { fill: C.white, stroke: step.color, strokeWidth: 4, radius: 28 });
    body += iconBadge(x + 62, 310, String(index + 1), { fill: step.color, size: 26 });
    body += text(x + 112, 320, step.label, { size: 34, weight: 700, fill: step.color });
    body += lines(x + 42, 410, step.question, { size: 31, weight: 700, gap: 42 });
    body += pill(x + 35, 565, 290, step.note, { fill: step.soft, color: step.color });
    if (index < steps.length - 1) body += arrow(x + 370, 455, x + 438, 455, { color: C.blue, width: 5 });
  });
  body += rect(260, 742, 1400, 105, { fill: C.white, stroke: C.line, strokeWidth: 2, radius: 52 });
  body += text(960, 808, 'If verification fails: return to Inspect with the new evidence.', { size: 31, weight: 700, fill: C.ink, anchor: 'middle' });
  return wrap(body);
}

function chapter5WebsitePaths() {
  const paths = [
    { key: 'A', title: 'ChatGPT + Sites', note: ['Fastest path', 'Managed hosting'], color: C.teal, soft: C.tealSoft },
    { key: 'B', title: 'No-code / CMS', note: ['Visual editing', 'Established ecosystem'], color: C.blue, soft: C.blueSoft },
    { key: 'C', title: 'Local + hosting', note: ['Maximum control', 'Own deployment flow'], color: C.purple, soft: C.purpleSoft },
    { key: 'D', title: 'Local + Sites', note: ['Source control', 'Managed publishing'], color: C.orange, soft: C.orangeSoft },
  ];
  let body = header('Four Website Building Paths', 'Choose based on speed, technical control, publishing needs, and who will maintain the result.');
  body += text(115, 210, 'FASTER START', { size: 22, weight: 700, fill: C.teal, letterSpacing: 1.4 });
  body += text(1805, 210, 'MORE SOURCE CONTROL', { size: 22, weight: 700, fill: C.purple, anchor: 'end', letterSpacing: 1.4 });
  body += arrow(315, 200, 1435, 200, { color: C.blue, width: 5 });
  paths.forEach((item, index) => {
    const x = 95 + index * 455;
    body += rect(x, 275, 365, 415, { fill: C.white, stroke: item.color, strokeWidth: 4, radius: 28 });
    body += iconBadge(x + 64, 342, item.key, { fill: item.color, size: 27 });
    body += text(x + 112, 350, item.title, { size: index === 1 ? 27 : 29, weight: 700, fill: item.color });
    body += lines(x + 42, 455, item.note, { size: 27, gap: 48 });
    const labels = [
      ['Prototype', 'Small site'],
      ['Content site', 'Commerce'],
      ['Custom app', 'Complex system'],
      ['Custom source', 'Easy sharing'],
    ][index];
    body += pill(x + 35, 560, 295, labels[0], { fill: item.soft, color: item.color });
    body += pill(x + 35, 620, 295, labels[1], { fill: item.soft, color: item.color });
  });
  body += rect(230, 755, 1460, 100, { fill: C.white, stroke: C.line, strokeWidth: 2, radius: 28 });
  body += iconBadge(300, 805, '!', { fill: C.red, size: 27 });
  body += text(355, 816, 'Publishing, DNS, payments, authentication, and real data each require separate verification.', { size: 28, weight: 700 });
  return wrap(body);
}

function chapter5DataFlow() {
  const flow = [
    { x: 90, title: 'Input', color: C.teal, soft: C.tealSoft, lines: ['Files', 'Text', 'Rows', 'Form data'] },
    { x: 530, title: 'Transformation', color: C.blue, soft: C.blueSoft, lines: ['Count', 'Clean', 'Calculate', 'Reformat'] },
    { x: 970, title: 'Dry run', color: C.orange, soft: C.orangeSoft, lines: ['Preview actions', 'Check scope', 'Approve changes', 'No writes yet'] },
    { x: 1410, title: 'Output', color: C.green, soft: C.greenSoft, lines: ['Report', 'New file', 'Saved record', 'Clear message'] },
  ];
  let body = header('Design a Small Script as a Data Flow', 'Make the input, transformation, preview, and output explicit before automation changes anything.');
  flow.forEach((item, index) => {
    body += rect(item.x, 250, 360, 435, { fill: C.white, stroke: item.color, strokeWidth: 4, radius: 28 });
    body += iconBadge(item.x + 62, 317, String(index + 1), { fill: item.color, size: 26 });
    body += text(item.x + 110, 326, item.title, { size: 33, weight: 700, fill: item.color });
    item.lines.forEach((label, itemIndex) => {
      body += circle(item.x + 58, 418 + itemIndex * 58, 9, { fill: item.color });
      body += text(item.x + 82, 428 + itemIndex * 58, label, { size: 27 });
    });
    body += pill(item.x + 34, 615, 292, index === 2 ? 'Safety checkpoint' : ['What enters?', 'What changes?', '', 'What exists?'][index], { fill: item.soft, color: item.color });
    if (index < flow.length - 1) body += arrow(item.x + 368, 470, item.x + 425, 470, { color: C.blue, width: 5 });
  });
  body += rect(300, 765, 1320, 92, { fill: C.white, stroke: C.line, strokeWidth: 2, radius: 46 });
  body += text(960, 823, 'After execution: verify the output, count affected items, and report anything skipped.', { size: 29, weight: 700, anchor: 'middle' });
  return wrap(body);
}

const assets = [
  ['kix.m4a7d2c9f1be.png', chapter1WorkSurface()],
  ['kix.b8e2f6a1c4d7.png', chapter1CapabilityLevels()],
  ['kix.c5f9a3d7e1b4.png', chapter1RiskMap()],
  ['kix.d7a1f5c9b3e6.png', chapter2AppComparison()],
  ['kix.e9b3d7a1f5c8.png', chapter5Layers()],
  ['kix.f1c5e9b3d7a2.png', chapter5BeginnerLadder()],
  ['kix.a3d7f1c5e9b4.png', chapter5Workflow()],
  ['kix.b5e9a3d7f1c6.png', chapter5WebsitePaths()],
  ['kix.c7f1b5e9a3d8.png', chapter5DataFlow()],
];

await fs.mkdir(OUT_DIR, { recursive: true });

for (const [filename, svg] of assets) {
  const outputPath = path.join(OUT_DIR, filename);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);
  console.log(`${filename} ${WIDTH}x${HEIGHT}`);
}
