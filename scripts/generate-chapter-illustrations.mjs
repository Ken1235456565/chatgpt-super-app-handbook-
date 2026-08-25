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

function lineArrow(x1, y1, x2, y2, { color = C.blue, width = 4, head = 12 } = {}) {
  return [
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`,
    `<polyline points="${x2 - head},${y2 - head * 0.65} ${x2},${y2} ${x2 - head},${y2 + head * 0.65}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`,
  ].join('');
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

function chapter1PromptingChatGPTUI() {
  const body = [
    defs(),
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="#F7F7F8"/>`,
    rect(18, 18, 1884, 894, { fill: C.white, stroke: '#D7D7DA', strokeWidth: 2, radius: 22 }),

    // Current ChatGPT-style window chrome and sidebar.
    `<path d="M40 18 H356 V912 H40 Q18 912 18 890 V40 Q18 18 40 18 Z" fill="#F1F1F2"/>`,
    `<line x1="356" y1="18" x2="356" y2="912" stroke="#DDDEE2" stroke-width="2"/>`,
    circle(50, 52, 11, { fill: '#FF5F57' }),
    circle(82, 52, 11, { fill: '#FFBD2E' }),
    circle(114, 52, 11, { fill: '#28C840' }),
    text(36, 114, 'ChatGPT', { size: 31, weight: 700 }),
    text(168, 111, '⌄', { size: 27, fill: C.muted }),
    text(320, 111, '⌕', { size: 34, fill: C.muted, anchor: 'middle' }),
    rect(32, 142, 292, 52, { fill: C.white, stroke: '#DDDEE2', strokeWidth: 2, radius: 15 }),
    text(58, 176, '+', { size: 30, fill: C.ink }),
    text(98, 175, 'New chat', { size: 24, weight: 600 }),
    text(50, 235, '⌕', { size: 28, fill: C.muted }),
    text(98, 235, 'Search', { size: 24, fill: C.ink }),
    text(50, 287, '▱', { size: 25, fill: C.muted }),
    text(98, 287, 'Library', { size: 24, fill: C.ink }),
    text(50, 339, '◉', { size: 24, fill: C.muted }),
    text(98, 339, 'Plugins', { size: 24, fill: C.ink }),
    text(36, 415, 'Projects', { size: 22, weight: 600, fill: '#8A8F98' }),
    text(316, 415, '+', { size: 28, fill: C.muted, anchor: 'middle' }),
    text(50, 465, '□', { size: 23, fill: C.muted }),
    text(98, 465, 'Productivity', { size: 23 }),
    text(50, 512, '□', { size: 23, fill: C.muted }),
    text(98, 512, 'Research', { size: 23 }),
    text(50, 559, '□', { size: 23, fill: C.muted }),
    text(98, 559, 'Writing', { size: 23 }),
    text(50, 868, '⚙', { size: 25, fill: C.muted }),
    text(90, 868, 'Settings', { size: 22, fill: C.muted }),

    // Chat / Work switcher from the current ChatGPT surface.
    rect(864, 35, 328, 58, { fill: '#F1F1F2', stroke: '#F1F1F2', radius: 29 }),
    rect(866, 37, 160, 54, { fill: C.white, stroke: '#DFE1E5', strokeWidth: 1, radius: 27 }),
    text(946, 74, 'Chat', { size: 24, weight: 700, anchor: 'middle' }),
    text(1104, 74, 'Work', { size: 24, fill: '#7D828B', anchor: 'middle' }),

    text(1128, 156, 'Two ways to begin', { size: 40, weight: 700, anchor: 'middle' }),
    text(1128, 192, 'Give ChatGPT a task, or ask it to discover the task with you.', { size: 24, fill: C.muted, anchor: 'middle' }),

    // Prompting comparison inside the new ChatGPT conversation area.
    rect(500, 230, 1250, 142, { fill: '#F2FAF5', stroke: '#9BCDB1', strokeWidth: 3, radius: 24 }),
    rect(528, 255, 88, 88, { fill: '#E0F1E6', stroke: '#E0F1E6', radius: 20 }),
    text(572, 312, '→', { size: 45, weight: 700, fill: C.green, anchor: 'middle' }),
    text(650, 286, 'Straight prompt', { size: 30, weight: 700, fill: C.green }),
    text(650, 330, 'Summarize this PDF into action items.', { size: 27 }),

    rect(500, 397, 1250, 142, { fill: '#F2F6FF', stroke: '#9EBEF5', strokeWidth: 3, radius: 24 }),
    rect(528, 422, 88, 88, { fill: '#E1EBFC', stroke: '#E1EBFC', radius: 20 }),
    text(572, 480, '?', { size: 40, weight: 700, fill: C.blue, anchor: 'middle' }),
    text(650, 453, 'Reverse prompt', { size: 30, weight: 700, fill: C.blue }),
    text(650, 497, 'Ask me questions so you can understand my goals.', { size: 27 }),

    circle(448, 604, 25, { fill: '#F1F1F2', stroke: '#D7D7DA', strokeWidth: 2 }),
    text(448, 613, '✦', { size: 25, weight: 700, fill: C.ink, anchor: 'middle' }),
    rect(500, 569, 1250, 70, { fill: C.white, stroke: '#E0E2E7', strokeWidth: 2, radius: 18 }),
    circle(540, 604, 17, { fill: C.blueSoft }),
    text(540, 611, '1', { size: 19, weight: 700, fill: C.blue, anchor: 'middle' }),
    text(580, 613, 'What are your main goals?', { size: 24 }),
    rect(500, 651, 1250, 70, { fill: C.white, stroke: '#E0E2E7', strokeWidth: 2, radius: 18 }),
    circle(540, 686, 17, { fill: C.blueSoft }),
    text(540, 693, '2', { size: 19, weight: 700, fill: C.blue, anchor: 'middle' }),
    text(580, 695, 'What slows you down?', { size: 24 }),

    // Current composer treatment.
    rect(454, 780, 1320, 86, { fill: C.white, stroke: '#D8DBE1', strokeWidth: 2, radius: 36 }),
    text(492, 835, '+', { size: 34, fill: C.ink }),
    text(548, 833, 'Message ChatGPT', { size: 25, fill: '#9B9FA7' }),
    text(1570, 833, 'Instant', { size: 23, fill: C.muted }),
    text(1660, 833, '♩', { size: 28, fill: C.ink }),
    circle(1728, 823, 27, { fill: '#94989F' }),
    text(1728, 833, '↑', { size: 29, weight: 700, fill: C.white, anchor: 'middle' }),
  ].join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${body}</svg>`;
}

function chapter1ComparisonChatGPTUI() {
  const body = [
    defs(),
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="#F7F7F8"/>`,
    rect(18, 18, 1884, 894, { fill: C.white, stroke: '#D7D7DA', strokeWidth: 2, radius: 22 }),
    `<path d="M40 18 H356 V912 H40 Q18 912 18 890 V40 Q18 18 40 18 Z" fill="#F1F1F2"/>`,
    `<line x1="356" y1="18" x2="356" y2="912" stroke="#DDDEE2" stroke-width="2"/>`,
    circle(50, 52, 11, { fill: '#FF5F57' }),
    circle(82, 52, 11, { fill: '#FFBD2E' }),
    circle(114, 52, 11, { fill: '#28C840' }),
    text(36, 114, 'ChatGPT', { size: 31, weight: 700 }),
    text(168, 111, '⌄', { size: 27, fill: C.muted }),
    text(320, 111, '⌕', { size: 34, fill: C.muted, anchor: 'middle' }),
    rect(32, 142, 292, 52, { fill: C.white, stroke: '#DDDEE2', strokeWidth: 2, radius: 15 }),
    text(58, 176, '+', { size: 30 }),
    text(98, 175, 'New chat', { size: 24, weight: 600 }),
    text(50, 235, '⌕', { size: 28, fill: C.muted }),
    text(98, 235, 'Search', { size: 24 }),
    text(50, 287, '▱', { size: 25, fill: C.muted }),
    text(98, 287, 'Library', { size: 24 }),
    text(50, 339, '◉', { size: 24, fill: C.muted }),
    text(98, 339, 'Plugins', { size: 24 }),
    text(36, 415, 'Projects', { size: 22, weight: 600, fill: '#8A8F98' }),
    text(316, 415, '+', { size: 28, fill: C.muted, anchor: 'middle' }),
    text(50, 465, '□', { size: 23, fill: C.muted }),
    text(98, 465, 'Development', { size: 23 }),
    text(50, 512, '□', { size: 23, fill: C.muted }),
    text(98, 512, 'Research', { size: 23 }),
    text(50, 868, '⚙', { size: 25, fill: C.muted }),
    text(90, 868, 'Settings', { size: 22, fill: C.muted }),

    rect(864, 35, 328, 58, { fill: '#F1F1F2', stroke: '#F1F1F2', radius: 29 }),
    rect(866, 37, 160, 54, { fill: C.white, stroke: '#DFE1E5', strokeWidth: 1, radius: 27 }),
    text(946, 74, 'Chat', { size: 24, weight: 700, anchor: 'middle' }),
    text(1104, 74, 'Work', { size: 24, fill: '#7D828B', anchor: 'middle' }),

    rect(755, 118, 670, 66, { fill: '#F1F1F2', stroke: '#F1F1F2', radius: 24 }),
    text(1090, 160, 'Compare Codex, Claude Code, and Google Antigravity', { size: 24, anchor: 'middle' }),
    circle(430, 241, 25, { fill: '#F1F1F2', stroke: '#D7D7DA', strokeWidth: 2 }),
    text(430, 250, '✦', { size: 25, weight: 700, anchor: 'middle' }),
    text(480, 250, 'Here is a comparison across three practical dimensions.', { size: 23 }),

    // Comparison table inside the current ChatGPT conversation.
    rect(480, 280, 1330, 466, { fill: C.white, stroke: '#D8DBE1', strokeWidth: 2, radius: 22 }),
    `<path d="M480 302 Q480 280 502 280 H1788 Q1810 280 1810 302 V350 H480 Z" fill="#F4F6F8"/>`,
    `<line x1="740" y1="280" x2="740" y2="746" stroke="#D8DBE1" stroke-width="2"/>`,
    `<line x1="1090" y1="280" x2="1090" y2="746" stroke="#D8DBE1" stroke-width="2"/>`,
    `<line x1="1450" y1="280" x2="1450" y2="746" stroke="#D8DBE1" stroke-width="2"/>`,
    `<line x1="480" y1="350" x2="1810" y2="350" stroke="#D8DBE1" stroke-width="2"/>`,
    `<line x1="480" y1="482" x2="1810" y2="482" stroke="#D8DBE1" stroke-width="2"/>`,
    `<line x1="480" y1="614" x2="1810" y2="614" stroke="#D8DBE1" stroke-width="2"/>`,
    text(915, 325, 'Safety model', { size: 24, weight: 700, anchor: 'middle' }),
    text(1270, 325, 'Convenience', { size: 24, weight: 700, anchor: 'middle' }),
    text(1630, 325, 'Technical threshold', { size: 24, weight: 700, anchor: 'middle' }),

    rect(510, 390, 48, 48, { fill: C.tealSoft, stroke: C.tealSoft, radius: 12 }),
    text(534, 422, 'C', { size: 23, weight: 700, fill: C.teal, anchor: 'middle' }),
    text(578, 422, 'Codex', { size: 24, weight: 700 }),
    lines(770, 392, ['Bounded workspace,', 'permissions, and review.'], { size: 20, gap: 30 }),
    lines(1120, 392, ['Integrated tasks, files,', 'commands, and evidence.'], { size: 20, gap: 30 }),
    lines(1480, 392, ['Low to moderate;', 'sensible defaults.'], { size: 20, gap: 30 }),

    rect(510, 522, 48, 48, { fill: C.purpleSoft, stroke: C.purpleSoft, radius: 12 }),
    text(534, 554, 'C', { size: 23, weight: 700, fill: C.purple, anchor: 'middle' }),
    text(578, 554, 'Claude Code', { size: 23, weight: 700 }),
    lines(770, 524, ['User configuration and', 'careful terminal control.'], { size: 20, gap: 30 }),
    lines(1120, 524, ['Lightweight start for', 'terminal workflows.'], { size: 20, gap: 30 }),
    lines(1480, 524, ['Moderate; requires', 'more manual setup.'], { size: 20, gap: 30 }),

    rect(510, 652, 48, 48, { fill: C.blueSoft, stroke: C.blueSoft, radius: 12 }),
    text(534, 684, 'G', { size: 23, weight: 700, fill: C.blue, anchor: 'middle' }),
    lines(578, 672, ['Google', 'Antigravity'], { size: 20, weight: 700, gap: 26 }),
    lines(770, 656, ['Sandboxed execution and', 'policy-based controls.'], { size: 20, gap: 30 }),
    lines(1120, 656, ['Cloud-native workflow with', 'Google integrations.'], { size: 20, gap: 30 }),
    lines(1480, 656, ['Moderate to high;', 'cloud experience helps.'], { size: 20, gap: 30 }),

    rect(454, 795, 1320, 78, { fill: C.white, stroke: '#D8DBE1', strokeWidth: 2, radius: 34 }),
    text(492, 844, '+', { size: 34 }),
    text(548, 842, 'Message ChatGPT', { size: 25, fill: '#9B9FA7' }),
    text(1570, 842, 'Instant', { size: 23, fill: C.muted }),
    circle(1728, 834, 27, { fill: '#94989F' }),
    text(1728, 844, '↑', { size: 29, weight: 700, fill: C.white, anchor: 'middle' }),
  ].join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${body}</svg>`;
}

function chapter4WorkOrder() {
  const cards = [
    {
      title: 'Goal',
      color: C.blue,
      body: ['What should be', 'true when the work', 'is done?'],
    },
    {
      title: 'Context',
      color: C.teal,
      body: ['What situation,', 'files, audience,', 'or source material', 'matters?'],
    },
    {
      title: 'Constraints',
      color: C.orange,
      body: ['What must Codex', 'preserve, avoid,', 'or follow?'],
    },
    {
      title: 'Output',
      color: C.purple,
      body: ['What form should', 'the answer or', 'artifact take?'],
    },
    {
      title: 'Verification',
      color: C.green,
      body: ['How should the', 'result be checked?'],
    },
  ];
  const cardX = [110, 463, 816, 1169, 1522];
  const cardY = 208;
  const cardW = 300;
  const cardH = 246;
  let body = header('The Codex Work Order', 'A useful prompt reduces uncertainty from intention to evidence.');

  cards.forEach((card, index) => {
    const x = cardX[index];
    body += rect(x, cardY, cardW, cardH, { fill: C.white, stroke: card.color, strokeWidth: 4, radius: 26 });
    body += circle(x + 45, cardY + 45, 25, { fill: card.color });
    body += text(x + 94, cardY + 56, card.title, { size: card.title === 'Verification' ? 28 : 30, weight: 700, fill: card.color });
    body += lines(x + 27, cardY + 130, card.body, { size: 24, gap: 33 });
    if (index < cards.length - 1) {
      body += lineArrow(x + cardW + 12, cardY + cardH / 2, cardX[index + 1] - 14, cardY + cardH / 2, { color: card.color, width: 4, head: 11 });
    }
  });

  body += rect(210, 610, 1500, 270, { fill: '#FAFBFD', stroke: C.line, strokeWidth: 3, radius: 26 });
  body += text(260, 688, 'Weak request', { size: 31, weight: 700, fill: C.orange });
  body += text(260, 748, '“Help with my resume.”', { size: 25 });
  body += lineArrow(790, 747, 960, 747, { color: C.green, width: 5, head: 15 });
  body += text(1020, 688, 'Stronger request', { size: 31, weight: 700, fill: C.green });
  body += lines(1020, 748, [
    '“Review my resume for a US software',
    'internship. Improve clarity, do not invent',
    'experience, and return a revised version',
    'plus the key changes.”',
  ], { size: 24, gap: 31 });
  return wrap(body);
}

function chapter4MultilingualWorkflow() {
  const cards = [
    {
      title: 'Explain in your language',
      color: C.blue,
      body: ['Describe goals,', 'background, limits, and', 'audience.'],
    },
    {
      title: 'Confirm meaning',
      color: C.teal,
      body: ['Codex restates', 'assumptions and flags', 'ambiguity.'],
    },
    {
      title: 'Preserve key terms',
      color: C.orange,
      body: ['Keep API, component,', 'state, prompt, context,', 'and other technical terms', 'precise.'],
    },
    {
      title: 'Produce output',
      color: C.green,
      body: ['English document,', 'bilingual table, or', 'native-language', 'explanation.'],
    },
  ];
  const cardX = [105, 551, 997, 1443];
  const cardY = 225;
  const cardW = 390;
  const cardH = 300;
  let body = header('Multilingual Prompting Workflow', 'Use your strongest language for meaning, then control the output language.');

  cards.forEach((card, index) => {
    const x = cardX[index];
    body += rect(x, cardY, cardW, cardH, { fill: C.white, stroke: card.color, strokeWidth: 4, radius: 28 });
    body += text(x + 27, cardY + 62, card.title, { size: index === 0 ? 29 : 32, weight: 700, fill: card.color });
    body += lines(x + 27, cardY + 133, card.body, { size: 27, gap: 33 });
    if (index < cards.length - 1) {
      body += lineArrow(x + cardW + 12, cardY + cardH / 2, cardX[index + 1] - 14, cardY + cardH / 2, { color: card.color, width: 4, head: 11 });
    }
  });

  body += rect(230, 650, 1460, 220, { fill: '#FAFBFD', stroke: C.line, strokeWidth: 3, radius: 26 });
  body += text(305, 716, 'Example instruction', { size: 32, weight: 700, fill: C.purple });
  body += lines(305, 767, [
    'I will explain the requirement in my native language. Please confirm your',
    'understanding in simple terms, preserve key technical terms in English,',
    'and produce a natural English final version.',
  ], { size: 27, gap: 36 });
  return wrap(body);
}

function chapter4PromptingPatterns() {
  const cards = [
    {
      title: 'Beginner',
      subtitle: 'Simple delegation',
      color: C.blue,
      prompt: ['I want X. I am starting from Y. I', 'do not know Z. Ask questions first,', 'then suggest a simple plan.'],
      best: ['The user knows the goal but not', 'the path.'],
    },
    {
      title: 'Technical user',
      subtitle: 'Operational instruction',
      color: C.green,
      prompt: ['Inspect before changing. Make the', 'smallest coherent fix. Run relevant', 'tests. Report evidence.'],
      best: ['The task touches files, tools,', 'tests, or risk.'],
    },
    {
      title: 'Mixed team',
      subtitle: 'Two-layer communication',
      color: C.purple,
      prompt: ['Give a plain-language summary for', 'decision makers and a technical', 'note for implementers.'],
      best: ['Different readers need different', 'levels of detail.'],
    },
  ];
  const cardX = [105, 650, 1255];
  const cardY = 220;
  const cardW = 520;
  const cardH = 640;
  let body = header('Prompting Patterns by User Type', 'Different users need different levels of control, not different magic words.');

  cards.forEach((card, index) => {
    const x = cardX[index];
    body += rect(x, cardY, cardW, cardH, { fill: C.white, stroke: card.color, strokeWidth: 4, radius: 26 });
    body += `<path d="M${x} ${cardY + 26} Q${x} ${cardY} ${x + 26} ${cardY} H${x + cardW - 26} Q${x + cardW} ${cardY} ${x + cardW} ${cardY + 26} V${cardY + 120} H${x} Z" fill="${card.color}"/>`;
    body += text(x + 31, cardY + 76, card.title, { size: 45, weight: 700, fill: C.white });
    body += text(x + 31, cardY + 164, card.subtitle, { size: index === 2 ? 29 : 30, weight: 700, fill: card.color });
    body += `<line x1="${x + 31}" y1="${cardY + 184}" x2="${x + cardW - 31}" y2="${cardY + 184}" stroke="${C.line}" stroke-width="3"/>`;
    body += text(x + 31, cardY + 252, 'Prompt shape', { size: 32, weight: 700 });
    body += lines(x + 31, cardY + 309, card.prompt, { size: 25, gap: 34 });
    body += text(x + 31, cardY + 520, 'Best when', { size: 32, weight: 700 });
    body += lines(x + 31, cardY + 573, card.best, { size: 24, fill: C.muted, gap: 33 });
  });
  return wrap(body);
}

function chapter4FeedbackLoop() {
  const node = (x, y, width, height, label, color, size = 31) => [
    rect(x, y, width, height, { fill: C.white, stroke: color, strokeWidth: 4, radius: 25 }),
    text(x + width / 2, y + height / 2 + 11, label, { size, weight: 700, fill: color, anchor: 'middle' }),
  ].join('');
  const path = (points, color) => `<polyline points="${points.map(([x, y]) => `${x},${y}`).join(' ')}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;

  let body = header('The Feedback Loop', 'Correction is how Codex moves from a plausible answer to a better result.');

  // Connect only at node borders; paths are painted before nodes so no line can cross text.
  body += path([[860, 300], [700, 380]], C.purple);
  body += path([[620, 490], [700, 690]], C.green);
  body += path([[870, 745], [1050, 745]], C.orange);
  body += path([[1230, 690], [1300, 490]], C.teal);
  body += path([[1220, 380], [1060, 300]], C.blue);

  body += node(810, 190, 300, 110, 'First result', C.blue);
  body += node(450, 380, 300, 110, 'Revise', C.purple);
  body += node(1170, 380, 300, 110, 'Review', C.teal);
  body += node(570, 690, 300, 110, 'Verify', C.green);
  body += node(1050, 690, 360, 110, 'Specific correction', C.orange, 29);

  body += rect(770, 430, 380, 205, { fill: '#FAFBFD', stroke: C.line, strokeWidth: 3, radius: 26 });
  body += lines(960, 500, ['What is wrong?', 'What should stay?', 'What should change?'], { size: 31, weight: 700, gap: 42, anchor: 'middle' });

  body += lines(960, 856, [
    'When a loop creates more confusion, pause and ask Codex to restate the goal,',
    'assumptions, and current plan before continuing.',
  ], { size: 24, fill: C.muted, gap: 34, anchor: 'middle' });
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
  ['kix.f18bplqpy9dn.png', chapter1PromptingChatGPTUI()],
  ['kix.8e2oly9rxw1s.png', chapter1ComparisonChatGPTUI()],
  ['kix.s3m1ypkr2vez.png', chapter4WorkOrder()],
  ['kix.22fon7v7odmd.png', chapter4MultilingualWorkflow()],
  ['kix.u5wgw05b4nca.png', chapter4PromptingPatterns()],
  ['kix.pi7mibo6lea2.png', chapter4FeedbackLoop()],
];

await fs.mkdir(OUT_DIR, { recursive: true });

for (const [filename, svg] of assets) {
  const outputPath = path.join(OUT_DIR, filename);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);
  console.log(`${filename} ${WIDTH}x${HEIGHT}`);
}
