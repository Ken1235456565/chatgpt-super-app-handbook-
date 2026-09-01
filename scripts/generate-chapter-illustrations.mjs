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

function diagramText(x, y, value, { size = 28, weight = 400, fill = C.ink, anchor = 'start', gap = 34 } = {}) {
  const values = String(value).split('|');
  return lines(x, y - ((values.length - 1) * gap) / 2, values, { size, weight, fill, gap, anchor });
}

function conceptFlow({ title: titleText, subtitle, steps, footer }) {
  const count = steps.length;
  const gap = count >= 5 ? 34 : 52;
  const cardW = Math.floor((1740 - gap * (count - 1)) / count);
  const startX = (WIDTH - (cardW * count + gap * (count - 1))) / 2;
  const cardY = 245;
  const cardH = 430;
  let body = header(titleText, subtitle);

  steps.forEach((step, index) => {
    const x = startX + index * (cardW + gap);
    const color = step.color || [C.blue, C.teal, C.purple, C.orange, C.green][index % 5];
    const soft = step.soft || [C.blueSoft, C.tealSoft, C.purpleSoft, C.orangeSoft, C.greenSoft][index % 5];
    body += rect(x, cardY, cardW, cardH, { fill: C.white, stroke: color, strokeWidth: 4, radius: 28 });
    body += circle(x + cardW / 2, cardY + 72, 34, { fill: color });
    body += text(x + cardW / 2, cardY + 83, String(index + 1), { size: 28, weight: 700, fill: C.white, anchor: 'middle' });
    body += diagramText(x + cardW / 2, cardY + 165, step.label, { size: count >= 5 ? 28 : 31, weight: 700, fill: color, anchor: 'middle', gap: 33 });
    body += diagramText(x + cardW / 2, cardY + 285, step.note, { size: count >= 5 ? 23 : 25, fill: C.muted, anchor: 'middle', gap: 32 });
    body += rect(x + 28, cardY + 366, cardW - 56, 42, { fill: soft, stroke: soft, radius: 21 });
    body += text(x + cardW / 2, cardY + 395, step.tag || 'CHECK', { size: 19, weight: 700, fill: color, anchor: 'middle', letterSpacing: 1.2 });
    if (index < count - 1) {
      body += lineArrow(x + cardW + 8, cardY + cardH / 2, x + cardW + gap - 10, cardY + cardH / 2, { color: C.blue, width: 4, head: 10 });
    }
  });

  body += rect(225, 760, 1470, 96, { fill: C.white, stroke: C.line, strokeWidth: 2, radius: 48 });
  body += text(960, 820, footer, { size: 28, weight: 700, fill: C.ink, anchor: 'middle' });
  return wrap(body);
}

function conceptComparison({ title: titleText, subtitle, left, right, footer }) {
  const panels = [left, right];
  const xs = [100, 1010];
  let body = header(titleText, subtitle);
  panels.forEach((panel, index) => {
    const x = xs[index];
    const color = panel.color || (index === 0 ? C.blue : C.teal);
    const soft = panel.soft || (index === 0 ? C.blueSoft : C.tealSoft);
    body += rect(x, 220, 810, 535, { fill: C.white, stroke: color, strokeWidth: 4, radius: 30 });
    body += rect(x + 1, 221, 808, 116, { fill: soft, stroke: soft, radius: 29 });
    body += text(x + 42, 276, panel.title, { size: 36, weight: 700, fill: color });
    body += text(x + 42, 315, panel.subtitle, { size: 23, fill: C.muted });
    panel.items.forEach((item, itemIndex) => {
      const cy = 405 + itemIndex * 74;
      body += circle(x + 58, cy - 8, 12, { fill: color });
      body += diagramText(x + 92, cy, item, { size: 26, fill: C.ink, gap: 30 });
    });
  });
  body += lineArrow(925, 485, 995, 485, { color: C.purple, width: 5, head: 14 });
  body += rect(250, 800, 1420, 82, { fill: C.white, stroke: C.line, strokeWidth: 2, radius: 41 });
  body += text(960, 852, footer, { size: 27, weight: 700, anchor: 'middle' });
  return wrap(body);
}

function conceptHub({ title: titleText, subtitle, center, nodes, footer }) {
  const positions = [
    [250, 300], [650, 210], [1270, 210], [1670, 300],
    [500, 650], [1420, 650],
  ];
  let body = header(titleText, subtitle);
  const centerX = 960;
  const centerY = 465;
  nodes.forEach((node, index) => {
    const [x, y] = positions[index];
    const color = node.color || [C.blue, C.teal, C.purple, C.orange, C.green, C.amber][index % 6];
    body += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="${C.line}" stroke-width="5" stroke-linecap="round"/>`;
    body += circle(x, y, 92, { fill: C.white, stroke: color, strokeWidth: 4 });
    body += diagramText(x, y - 5, node.label, { size: 25, weight: 700, fill: color, anchor: 'middle', gap: 30 });
    if (node.note) body += text(x, y + 124, node.note, { size: 20, fill: C.muted, anchor: 'middle' });
  });
  body += circle(centerX, centerY, 140, { fill: C.blueSoft, stroke: C.blue, strokeWidth: 6 });
  body += diagramText(centerX, centerY + 4, center, { size: 33, weight: 700, fill: C.blue, anchor: 'middle', gap: 40 });
  body += rect(300, 820, 1320, 72, { fill: C.white, stroke: C.line, strokeWidth: 2, radius: 36 });
  body += text(960, 867, footer, { size: 25, weight: 700, anchor: 'middle' });
  return wrap(body);
}

function conceptStack({ title: titleText, subtitle, levels, footer }) {
  let body = header(titleText, subtitle);
  levels.forEach((level, index) => {
    const color = level.color || [C.green, C.teal, C.blue, C.purple, C.orange, C.red][index % 6];
    const soft = level.soft || [C.greenSoft, C.tealSoft, C.blueSoft, C.purpleSoft, C.orangeSoft, C.redSoft][index % 6];
    const inset = index * 72;
    const x = 210 + inset;
    const width = 1500 - inset * 2;
    const y = 195 + index * 105;
    body += rect(x, y, width, 78, { fill: soft, stroke: color, strokeWidth: 3, radius: 22 });
    body += text(x + 34, y + 50, level.label, { size: 29, weight: 700, fill: color });
    body += text(x + width - 34, y + 49, level.note, { size: 24, fill: C.ink, anchor: 'end' });
  });
  body += text(960, 874, footer, { size: 27, weight: 700, anchor: 'middle' });
  return wrap(body);
}

const chapterDiagramSpecs = [
  ['chapter-06-debugging-funnel.png', 'flow', {
    title: 'A Disciplined Debugging Funnel', subtitle: 'Move from a repeatable symptom to a small, verified fix.',
    steps: [
      { label: 'Reproduce', note: 'Capture the exact|failure and inputs', tag: 'KNOWN SYMPTOM' },
      { label: 'Localize', note: 'Narrow the failing|layer or boundary', tag: 'SMALLER SEARCH' },
      { label: 'Explain', note: 'State the likely|cause and evidence', tag: 'TESTABLE IDEA' },
      { label: 'Fix', note: 'Change the smallest|coherent surface', tag: 'BOUNDED EDIT' },
      { label: 'Verify', note: 'Run the original case|and regressions', tag: 'EVIDENCE' },
    ], footer: 'If the failure cannot be reproduced, preserve the observations and avoid speculative edits.',
  }],
  ['chapter-06-test-strategy.png', 'stack', {
    title: 'Build Confidence in Layers', subtitle: 'Different tests catch different failures; no single layer proves the whole system.',
    levels: [
      { label: 'Static checks', note: 'Types · lint · formatting' },
      { label: 'Unit tests', note: 'Small rules and edge cases' },
      { label: 'Integration tests', note: 'Boundaries between modules and services' },
      { label: 'End-to-end tests', note: 'Critical user journeys' },
      { label: 'Human review', note: 'Intent · usability · production judgment' },
    ], footer: 'Choose the smallest test set that covers the changed behavior, then inspect the evidence.',
  }],
  ['chapter-06-review-evidence.png', 'hub', {
    title: 'A Reviewable Engineering Change', subtitle: 'A pull request is strongest when the change and its evidence travel together.', center: 'Reviewable|change',
    nodes: [
      { label: 'Focused|diff', note: 'What changed' }, { label: 'Test|results', note: 'What passed' },
      { label: 'Screenshots', note: 'What users see' }, { label: 'Tradeoffs', note: 'Why this path' },
      { label: 'Risk|notes', note: 'What could fail' }, { label: 'Rollback', note: 'How to recover' },
    ], footer: 'The reviewer should be able to reconstruct the decision without guessing.',
  }],

  ['chapter-07-idea-to-product.png', 'flow', {
    title: 'From Idea to a Buildable Product', subtitle: 'Turn an ambition into a sequence that can be reviewed and tested.',
    steps: [
      { label: 'Problem', note: 'Whose pain are|you solving?', tag: 'USER NEED' },
      { label: 'Outcome', note: 'What should become|easier or possible?', tag: 'SUCCESS' },
      { label: 'Scope', note: 'What is the smallest|useful version?', tag: 'BOUNDARY' },
      { label: 'Prototype', note: 'Make the workflow|visible and testable', tag: 'LEARN' },
      { label: 'Product', note: 'Add reliability,|ownership, and support', tag: 'OPERATE' },
    ], footer: 'A product begins with a validated problem, not with a long feature list.',
  }],
  ['chapter-07-form-choice.png', 'comparison', {
    title: 'Choose the Right Product Form', subtitle: 'The interaction pattern should determine the implementation form.',
    left: { title: 'Website or app', subtitle: 'People interact directly', items: ['A visible interface', 'Multiple user choices', 'Persistent state or accounts', 'Ongoing product ownership'] },
    right: { title: 'Automation', subtitle: 'A repeated process runs', items: ['Clear trigger and input', 'Predictable transformation', 'Defined output destination', 'Exception and stop handling'] },
    footer: 'If people need to explore, choose an interface; if the steps repeat, consider automation.',
  }],
  ['chapter-07-requirements-handoff.png', 'flow', {
    title: 'Turn Requirements Into a Build Handoff', subtitle: 'Each artifact removes a different kind of ambiguity.',
    steps: [
      { label: 'Requirements', note: 'Users, goals, limits,|and acceptance', tag: 'WHY' },
      { label: 'Flows', note: 'Steps, states, and|failure paths', tag: 'HOW' },
      { label: 'Screens', note: 'Layout, content, and|interaction intent', tag: 'WHAT USERS SEE' },
      { label: 'Tasks', note: 'Small implementation|units with owners', tag: 'WHAT CHANGES' },
      { label: 'Checks', note: 'Tests, preview, and|stakeholder review', tag: 'PROOF' },
    ], footer: 'A clear handoff connects every implementation task back to a user outcome.',
  }],
  ['chapter-07-prototype-feedback.png', 'hub', {
    title: 'Prototype Review With Real Users', subtitle: 'Observe behavior, not only opinions.', center: 'Prototype|learning',
    nodes: [
      { label: 'Task', note: 'A real goal' }, { label: 'Observe', note: 'Where they pause' },
      { label: 'Ask', note: 'What they expected' }, { label: 'Evidence', note: 'Notes and measures' },
      { label: 'Prioritize', note: 'Impact first' }, { label: 'Revise', note: 'One loop' },
    ], footer: 'Do not explain the interface while testing it; let the prototype reveal the confusion.',
  }],
  ['chapter-07-production-gates.png', 'stack', {
    title: 'Prototype-to-Production Gates', subtitle: 'A working demo becomes a product only after operational risks are addressed.',
    levels: [
      { label: 'Useful workflow', note: 'The core user outcome works' },
      { label: 'Reliable behavior', note: 'Errors and edge cases are handled' },
      { label: 'Secure access', note: 'Identity, permissions, and data boundaries' },
      { label: 'Observable service', note: 'Logs, monitoring, and recovery' },
      { label: 'Owned product', note: 'Support, cost, policy, and maintenance' },
    ], footer: 'Passing the demo is the beginning of production readiness, not the end.',
  }],

  ['chapter-08-preserve-your-voice.png', 'flow', {
    title: 'Write With AI Without Losing Your Voice', subtitle: 'Separate your intent from the drafting assistance.',
    steps: [
      { label: 'Intent', note: 'Your point, audience,|and desired effect', tag: 'HUMAN' },
      { label: 'Evidence', note: 'Your facts, stories,|and examples', tag: 'SOURCE' },
      { label: 'Draft', note: 'AI helps organize|and phrase', tag: 'ASSIST' },
      { label: 'Voice pass', note: 'Restore rhythm,|specificity, and taste', tag: 'AUTHOR' },
      { label: 'Final review', note: 'Check truth, tone,|and consequences', tag: 'APPROVE' },
    ], footer: 'Your voice lives in the choices you keep, remove, and rewrite.',
  }],
  ['chapter-08-notes-to-draft.png', 'flow', {
    title: 'From Rough Notes to a Shareable Draft', subtitle: 'Do not ask one pass to solve structure, accuracy, and polish at once.',
    steps: [
      { label: 'Collect', note: 'Notes, facts, quotes,|and open questions', tag: 'RAW INPUT' },
      { label: 'Organize', note: 'Group ideas around|the reader journey', tag: 'STRUCTURE' },
      { label: 'Draft', note: 'Write a complete|working version', tag: 'COHERENCE' },
      { label: 'Verify', note: 'Check claims, names,|dates, and sources', tag: 'ACCURACY' },
      { label: 'Polish', note: 'Improve clarity, tone,|and formatting', tag: 'READY' },
    ], footer: 'Keep unresolved questions visible until a human or reliable source answers them.',
  }],
  ['chapter-08-collaboration-lanes.png', 'comparison', {
    title: 'Separate Drafting From Approval', subtitle: 'Collaboration is clearer when creation and authority are visible.',
    left: { title: 'AI-assisted drafting', subtitle: 'Fast exploration and revision', items: ['Organize source material', 'Generate options', 'Rewrite for clarity', 'Track requested changes'] },
    right: { title: 'Human approval', subtitle: 'Accountability stays explicit', items: ['Confirm facts and promises', 'Protect confidential details', 'Resolve stakeholder conflict', 'Approve sending or publishing'] },
    footer: 'A polished document is still a draft until the accountable person approves it.',
  }],
  ['chapter-08-tone-audience.png', 'hub', {
    title: 'Tone Begins With the Reader', subtitle: 'Choose language by relationship and purpose, not by adjectives alone.', center: 'Message|design',
    nodes: [
      { label: 'Audience', note: 'Who reads it' }, { label: 'Purpose', note: 'What changes' },
      { label: 'Relationship', note: 'Power and trust' }, { label: 'Channel', note: 'Email or report' },
      { label: 'Culture', note: 'Shared norms' }, { label: 'Risk', note: 'Cost of ambiguity' },
    ], footer: '“Professional” is not one tone; it is a fit between reader, purpose, and consequence.',
  }],
  ['chapter-08-writing-review.png', 'stack', {
    title: 'The Important-Writing Review Stack', subtitle: 'Review from meaning outward; surface polish cannot repair a false claim.',
    levels: [
      { label: 'Truth', note: 'Facts, sources, dates, names, numbers' },
      { label: 'Intent', note: 'Purpose, audience, decision, next step' },
      { label: 'Risk', note: 'Privacy, promises, legal or cultural impact' },
      { label: 'Clarity', note: 'Structure, examples, ambiguity, omissions' },
      { label: 'Finish', note: 'Tone, grammar, formatting, accessibility' },
    ], footer: 'Review high-consequence layers before spending time on cosmetic refinement.',
  }],

  ['chapter-09-research-question.png', 'stack', {
    title: 'Build a Research Question That Leads Somewhere', subtitle: 'A useful question defines both the decision and the evidence needed.',
    levels: [
      { label: 'Decision', note: 'What will this research help you choose?' },
      { label: 'Scope', note: 'Population · place · time · constraints' },
      { label: 'Evidence', note: 'What sources or data could answer it?' },
      { label: 'Comparison', note: 'Which alternatives or viewpoints matter?' },
      { label: 'Output', note: 'What form will make the result usable?' },
    ], footer: 'If no decision or learning outcome follows, narrow the question before searching.',
  }],
  ['chapter-09-learning-loop.png', 'flow', {
    title: 'Learn Through an Active Loop', subtitle: 'Understanding grows when explanation leads to practice and feedback.',
    steps: [
      { label: 'Explain', note: 'Build a simple|mental model', tag: 'UNDERSTAND' },
      { label: 'Example', note: 'See the model in|a concrete case', tag: 'CONNECT' },
      { label: 'Practice', note: 'Solve a new problem|without copying', tag: 'APPLY' },
      { label: 'Feedback', note: 'Find the exact|misconception', tag: 'CORRECT' },
      { label: 'Teach back', note: 'Explain it in|your own words', tag: 'RETAIN' },
    ], footer: 'A fluent explanation from AI is an input to learning, not evidence that you understand.',
  }],
  ['chapter-09-source-comparison.png', 'comparison', {
    title: 'Compare Sources Before Combining Them', subtitle: 'Agreement matters less when every source repeats the same weak origin.',
    left: { title: 'Source quality', subtitle: 'Can this source support the claim?', items: ['Relevant expertise', 'Direct access to evidence', 'Transparent method', 'Current publication date'] },
    right: { title: 'Source independence', subtitle: 'Is this genuinely another view?', items: ['Different original evidence', 'Distinct incentives', 'Visible disagreement', 'Traceable citations'] },
    footer: 'Prefer several independent, appropriate sources over many pages that echo one another.',
  }],
  ['chapter-09-claim-verification.png', 'flow', {
    title: 'Verify a Claim, Not Just a Page', subtitle: 'Trace each important statement to evidence that directly supports it.',
    steps: [
      { label: 'Isolate claim', note: 'Write the exact|statement to test', tag: 'SPECIFIC' },
      { label: 'Find origin', note: 'Prefer primary or|authoritative sources', tag: 'PROVENANCE' },
      { label: 'Check date', note: 'Confirm the evidence|is still current', tag: 'TIMELY' },
      { label: 'Read context', note: 'Inspect limits, scope,|and exceptions', tag: 'COMPLETE' },
      { label: 'Cite precisely', note: 'Link the support near|the final claim', tag: 'TRACEABLE' },
    ], footer: 'If the source does not directly support the wording, weaken or remove the claim.',
  }],
  ['chapter-09-personal-learning-loop.png', 'hub', {
    title: 'A Personal Learning System', subtitle: 'Projects turn scattered explanations into durable skill.', center: 'Learning|project',
    nodes: [
      { label: 'Goal', note: 'A useful outcome' }, { label: 'Plan', note: 'Small milestones' },
      { label: 'Practice', note: 'Work from memory' }, { label: 'Feedback', note: 'Specific errors' },
      { label: 'Review', note: 'Spaced return' }, { label: 'Portfolio', note: 'Evidence of skill' },
    ], footer: 'Keep a record of mistakes, fixes, and explanations you can reuse later.',
  }],

  ['chapter-10-task-triage.png', 'flow', {
    title: 'Turn Daily Chaos Into Clear Tasks', subtitle: 'Separate capture from deciding what deserves action.',
    steps: [
      { label: 'Capture', note: 'Collect messages,|notes, and ideas', tag: 'INBOX' },
      { label: 'Clarify', note: 'Define the actual|desired outcome', tag: 'MEANING' },
      { label: 'Prioritize', note: 'Compare impact,|urgency, and effort', tag: 'CHOICE' },
      { label: 'Schedule', note: 'Assign time, owner,|or next action', tag: 'COMMIT' },
      { label: 'Review', note: 'Close, revise, defer,|or remove', tag: 'CONTROL' },
    ], footer: 'A longer list is not a better system; every item needs a decision.',
  }],
  ['chapter-10-planning-horizons.png', 'stack', {
    title: 'Plan at Three Time Horizons', subtitle: 'Each horizon answers a different question and should inform the next.',
    levels: [
      { label: 'Project', note: 'What outcome, milestones, risks, and dependencies matter?' },
      { label: 'Week', note: 'Which commitments move the project now?' },
      { label: 'Day', note: 'What are the few concrete next actions?' },
      { label: 'Focus block', note: 'What will you do without switching context?' },
      { label: 'Review', note: 'What changed, slipped, or no longer matters?' },
    ], footer: 'Daily plans stay realistic when they are anchored to weekly and project choices.',
  }],
  ['chapter-10-personal-team.png', 'comparison', {
    title: 'Personal and Team Workflows Need Different Controls', subtitle: 'Coordination adds ownership, handoffs, and shared evidence.',
    left: { title: 'Personal workflow', subtitle: 'Optimize for your own attention', items: ['Flexible capture', 'Private priorities', 'Lightweight reminders', 'Fast personal review'] },
    right: { title: 'Team workflow', subtitle: 'Optimize for shared understanding', items: ['Named owner and deadline', 'Visible status and blockers', 'Handoff criteria', 'Decision and evidence record'] },
    footer: 'Do not scale a private habit into a team process without adding shared ownership.',
  }],
  ['chapter-10-sop-flow.png', 'flow', {
    title: 'A Useful Standard Operating Procedure', subtitle: 'An SOP should make correct action easier and exceptions visible.',
    steps: [
      { label: 'Trigger', note: 'When does the|procedure begin?', tag: 'START' },
      { label: 'Inputs', note: 'What access, data,|or materials are needed?', tag: 'READY' },
      { label: 'Steps', note: 'What is the smallest|safe sequence?', tag: 'DO' },
      { label: 'Exception', note: 'When should work stop|or escalate?', tag: 'PROTECT' },
      { label: 'Evidence', note: 'What proves the task|was completed?', tag: 'RECORD' },
    ], footer: 'Test an SOP with the person who performs the work, then revise confusing steps.',
  }],
  ['chapter-10-scheduled-lifecycle.png', 'hub', {
    title: 'The Scheduled-Task Lifecycle', subtitle: 'Unattended work needs stronger setup and monitoring than a one-time prompt.', center: 'Scheduled|work',
    nodes: [
      { label: 'Test prompt', note: 'Run manually' }, { label: 'Narrow access', note: 'Least authority' },
      { label: 'Set trigger', note: 'Time or event' }, { label: 'Observe', note: 'Early runs' },
      { label: 'Handle failure', note: 'Stop or notify' }, { label: 'Review value', note: 'Keep or retire' },
    ], footer: 'Every recurring task needs an owner, stop condition, and review cadence.',
  }],

  ['chapter-11-diverge-converge.png', 'comparison', {
    title: 'Creative Work Alternates Between Expansion and Selection', subtitle: 'Separate idea generation from judgment so each mode can work well.',
    left: { title: 'Diverge', subtitle: 'Increase the possibility space', items: ['Generate distinct directions', 'Change constraints deliberately', 'Seek surprising combinations', 'Delay premature ranking'] },
    right: { title: 'Converge', subtitle: 'Choose and strengthen a direction', items: ['Compare against the brief', 'Combine compatible strengths', 'Test with the audience', 'Commit and refine'] },
    footer: 'Repeat the two modes when feedback reveals that the chosen direction is weak.',
  }],
  ['chapter-11-creative-partnership.png', 'hub', {
    title: 'The Human–AI Creative Partnership', subtitle: 'Speed comes from the system; taste and responsibility remain human.', center: 'Creative|brief',
    nodes: [
      { label: 'Intent', note: 'Human' }, { label: 'Taste', note: 'Human' },
      { label: 'Options', note: 'AI-assisted' }, { label: 'Production', note: 'AI-assisted' },
      { label: 'Feedback', note: 'People' }, { label: 'Selection', note: 'Human' },
    ], footer: 'The brief is a living agreement about audience, emotion, constraints, and success.',
  }],
  ['chapter-11-idea-directions.png', 'flow', {
    title: 'Generate Directions, Not Minor Variations', subtitle: 'Creative options should differ in a way that helps you choose.',
    steps: [
      { label: 'Brief', note: 'Audience, emotion,|constraints, medium', tag: 'ANCHOR' },
      { label: 'Direction A', note: 'Familiar, clear,|low production risk', tag: 'SAFE' },
      { label: 'Direction B', note: 'Distinctive concept|with a strong hook', tag: 'BOLD' },
      { label: 'Direction C', note: 'Unexpected framing|or combination', tag: 'EXPERIMENT' },
      { label: 'Compare', note: 'Rationale, risk,|cost, and fit', tag: 'DECIDE' },
    ], footer: 'Ask what makes each direction meaningfully different before generating more variants.',
  }],
  ['chapter-11-media-pipeline.png', 'flow', {
    title: 'From Creative Brief to Media Asset', subtitle: 'Images, videos, presentations, and games share a production logic.',
    steps: [
      { label: 'Brief', note: 'Audience, message,|format, and rights', tag: 'INTENT' },
      { label: 'Concept', note: 'Narrative, visual|system, and references', tag: 'DIRECTION' },
      { label: 'Prototype', note: 'Storyboard, mockup,|or playable slice', tag: 'TEST' },
      { label: 'Produce', note: 'Create assets and|assemble the work', tag: 'BUILD' },
      { label: 'Review', note: 'Truth, consent, pacing,|quality, and export', tag: 'APPROVE' },
    ], footer: 'Confirm likeness, voice, brand, and source permissions before final production.',
  }],
  ['chapter-11-human-feedback.png', 'stack', {
    title: 'Turn Creative Feedback Into Decisions', subtitle: 'Useful critique connects a reaction to the audience and the brief.',
    levels: [
      { label: 'Reaction', note: 'What did the reviewer notice or feel?' },
      { label: 'Reason', note: 'Which element caused that response?' },
      { label: 'Brief', note: 'Does it support the intended audience and goal?' },
      { label: 'Change', note: 'What specific revision should be tested?' },
      { label: 'Decision', note: 'Keep, combine, revise, or reject?' },
    ], footer: 'Collect patterns across reviewers; do not average every preference into blandness.',
  }],

  ['chapter-12-small-business-pilot.png', 'flow', {
    title: 'A 30-Day Small-Business AI Pilot', subtitle: 'Begin with one repeated workflow and measure practical value.',
    steps: [
      { label: 'Baseline', note: 'Document time, errors,|and current steps', tag: 'BEFORE' },
      { label: 'Boundaries', note: 'Set data, approval,|and cost limits', tag: 'SAFE' },
      { label: 'Pilot', note: 'Improve one frequent,|low-risk workflow', tag: 'TRY' },
      { label: 'Measure', note: 'Track quality, time,|and exceptions', tag: 'EVIDENCE' },
      { label: 'Decide', note: 'Expand, revise,|or stop', tag: 'OWNER' },
    ], footer: 'A boring workflow with measurable value is a stronger start than a dramatic demo.',
  }],
  ['chapter-12-role-context.png', 'hub', {
    title: 'Different Roles Need Different Context', subtitle: 'The same AI assistant should not receive the same brief from every role.', center: 'Business|outcome',
    nodes: [
      { label: 'Founder', note: 'Strategy and risk' }, { label: 'Manager', note: 'Owners and process' },
      { label: 'Marketer', note: 'Audience and voice' }, { label: 'Developer', note: 'Repo and tests' },
      { label: 'Finance', note: 'Numbers and controls' }, { label: 'Support', note: 'Policy and cases' },
    ], footer: 'Provide the constraints that the role is accountable for, not merely a job title.',
  }],
  ['chapter-12-feedback-synthesis.png', 'flow', {
    title: 'Turn Customer Feedback Into Action', subtitle: 'Summaries become useful only when they connect to evidence and ownership.',
    steps: [
      { label: 'Collect', note: 'Reviews, tickets, calls,|surveys, and notes', tag: 'VOICE' },
      { label: 'Structure', note: 'Clean, tag, and preserve|source links', tag: 'DATA' },
      { label: 'Find patterns', note: 'Themes, segments,|frequency, severity', tag: 'SIGNAL' },
      { label: 'Prioritize', note: 'Connect to revenue,|retention, and trust', tag: 'DECISION' },
      { label: 'Close loop', note: 'Assign action and|measure the result', tag: 'OWNER' },
    ], footer: 'The loudest feedback is not automatically the most representative or important.',
  }],
  ['chapter-12-team-workflow.png', 'flow', {
    title: 'Make Team Work Visible', subtitle: 'A shared workflow reduces ambiguity at every handoff.',
    steps: [
      { label: 'Request', note: 'Outcome, requester,|and priority', tag: 'INTAKE' },
      { label: 'Owner', note: 'One accountable|person or team', tag: 'RESPONSIBLE' },
      { label: 'Work', note: 'Status, dependencies,|and blockers', tag: 'VISIBLE' },
      { label: 'Review', note: 'Evidence and approval|criteria', tag: 'QUALITY' },
      { label: 'Learn', note: 'Decision record and|process improvement', tag: 'REUSE' },
    ], footer: 'If ownership or completion criteria are unclear, automation will scale confusion.',
  }],
  ['chapter-12-internal-tool-gates.png', 'stack', {
    title: 'Before You Build an Internal Tool', subtitle: 'A small tool still creates data, access, and maintenance obligations.',
    levels: [
      { label: 'Need', note: 'Does it remove repeated work or a costly error?' },
      { label: 'Data', note: 'Which source is authoritative, sensitive, or stale?' },
      { label: 'Access', note: 'Who can view, change, export, or approve?' },
      { label: 'Failure', note: 'What happens when input or integration breaks?' },
      { label: 'Ownership', note: 'Who maintains, supports, and retires it?' },
    ], footer: 'The right internal tool is usually narrow, reliable, and easy to recover.',
  }],

  ['chapter-13-permission-layers.png', 'stack', {
    title: 'Permission Is Layered', subtitle: 'Access at one layer does not grant authority at every later layer.',
    levels: [
      { label: 'Conversation', note: 'Messages, attachments, and available tools' },
      { label: 'Project', note: 'Shared files, instructions, and connected context' },
      { label: 'Service', note: 'Separate account authentication and scopes' },
      { label: 'Execution', note: 'Sandbox, network, command, and file boundaries' },
      { label: 'Consequence', note: 'Send, publish, merge, deploy, or delete approval' },
    ], footer: 'Check the narrowest active boundary before every consequential action.',
  }],
  ['chapter-13-context-boundary.png', 'comparison', {
    title: 'Useful Context Can Also Be Sensitive', subtitle: 'Choose the minimum information that supports the task.',
    left: { title: 'Needed context', subtitle: 'Information that changes the answer', items: ['Relevant files or excerpts', 'Current instructions', 'Audience and constraints', 'Approved source material'] },
    right: { title: 'Unnecessary exposure', subtitle: 'Information the task can avoid', items: ['Credentials and private keys', 'Unrelated personal files', 'Full customer records', 'Stale or untrusted instructions'] },
    footer: 'Redact, summarize, or isolate sensitive material before sharing it with any tool.',
  }],
  ['chapter-13-plugin-boundary.png', 'flow', {
    title: 'A Connected Tool Adds a Trust Boundary', subtitle: 'Every integration introduces another identity, permission, and data path.',
    steps: [
      { label: 'User intent', note: 'What outcome is|actually authorized?', tag: 'GOAL' },
      { label: 'ChatGPT', note: 'What context and tool|is selected?', tag: 'ORCHESTRATE' },
      { label: 'Connection', note: 'What scopes and account|are authenticated?', tag: 'ACCESS' },
      { label: 'External service', note: 'What can be read,|written, or sent?', tag: 'ACTION' },
      { label: 'Review', note: 'What evidence and|approval remain?', tag: 'CONTROL' },
    ], footer: 'Installing a capability is not blanket approval to use every action it exposes.',
  }],
  ['chapter-13-approval-ladder.png', 'stack', {
    title: 'Increase Confirmation as Consequences Rise', subtitle: 'Authority should grow more slowly than capability.',
    levels: [
      { label: 'Analyze', note: 'Read-only · private · reversible' },
      { label: 'Draft', note: 'Proposed output · no external effect' },
      { label: 'Modify', note: 'Workspace changes · reviewable diff' },
      { label: 'Publish or send', note: 'External audience · reputation and privacy' },
      { label: 'Deploy, merge, or delete', note: 'Operational or difficult-to-reverse effect' },
    ], footer: 'Permission for a lower rung never implies permission for the next one.',
  }],
  ['chapter-13-evidence-review.png', 'hub', {
    title: 'Evidence Before Acceptance', subtitle: 'Match the proof to the kind of work and the cost of being wrong.', center: 'Human|acceptance',
    nodes: [
      { label: 'Sources', note: 'Factual claims' }, { label: 'Diffs', note: 'File changes' },
      { label: 'Tests', note: 'Behavior' }, { label: 'Renders', note: 'Visual output' },
      { label: 'Logs', note: 'Runtime events' }, { label: 'Rollback', note: 'Recovery' },
    ], footer: 'A green checkmark is one signal; it does not replace judgment about scope and impact.',
  }],

  ['chapter-14-work-environment.png', 'flow', {
    title: 'From One Chat to a Work Environment', subtitle: 'AI work is expanding from answers into coordinated, persistent activity.',
    steps: [
      { label: 'Conversation', note: 'Ask, explain,|and explore', tag: 'MOMENT' },
      { label: 'Project', note: 'Keep files, goals,|and instructions', tag: 'CONTEXT' },
      { label: 'Tools', note: 'Act in approved|systems', tag: 'CAPABILITY' },
      { label: 'Outputs', note: 'Create durable|documents and products', tag: 'ARTIFACT' },
      { label: 'Review', note: 'Track evidence,|ownership, and change', tag: 'GOVERNANCE' },
    ], footer: 'The interface becomes less important than the continuity of context, action, and review.',
  }],
  ['chapter-14-specialized-workspaces.png', 'hub', {
    title: 'One Environment, Specialized Workspaces', subtitle: 'Different work benefits from different tools, context, and review surfaces.', center: 'Shared|environment',
    nodes: [
      { label: 'Conversation', note: 'Ideas and answers' }, { label: 'Code', note: 'Repositories' },
      { label: 'Design', note: 'Interfaces' }, { label: 'Research', note: 'Sources' },
      { label: 'Media', note: 'Images and video' }, { label: 'Operations', note: 'Recurring work' },
    ], footer: 'Specialization should make boundaries clearer, not hide them.',
  }],
  ['chapter-14-persistent-context.png', 'stack', {
    title: 'Persistent Context Needs Governance', subtitle: 'Remembering more is useful only when the system shows what is current and trusted.',
    levels: [
      { label: 'Purpose', note: 'The durable outcome and audience' },
      { label: 'Sources', note: 'Origin, date, authority, and version' },
      { label: 'Instructions', note: 'Scope, precedence, and accountable owner' },
      { label: 'Permissions', note: 'Who and what may access or act' },
      { label: 'Maintenance', note: 'Refresh, archive, export, or delete' },
    ], footer: 'Persistent context without provenance becomes persistent confusion.',
  }],
  ['chapter-14-installable-capability.png', 'flow', {
    title: 'Installable Capability Changes the System', subtitle: 'Adding a tool changes both what the application can do and what it must govern.',
    steps: [
      { label: 'Discover', note: 'Find a capability|for a defined need', tag: 'FIT' },
      { label: 'Inspect', note: 'Review provider,|permissions, and data', tag: 'TRUST' },
      { label: 'Connect', note: 'Authenticate the|correct account', tag: 'IDENTITY' },
      { label: 'Use', note: 'Authorize a narrow|task and action', tag: 'SCOPE' },
      { label: 'Review', note: 'Audit results and|remove unused access', tag: 'CONTROL' },
    ], footer: 'A marketplace lowers setup friction; it does not eliminate dependency or permission risk.',
  }],
  ['chapter-14-appropriate-autonomy.png', 'comparison', {
    title: 'The Practical Future Is Appropriate Autonomy', subtitle: 'Use more autonomy only when the environment and review can support it.',
    left: { title: 'Quick assistance', subtitle: 'Small scope and low consequence', items: ['Short-lived context', 'Easy human inspection', 'Reversible output', 'Immediate clarification'] },
    right: { title: 'Durable autonomy', subtitle: 'Longer-running and consequential work', items: ['Persistent state and logs', 'Narrow permissions', 'Monitoring and stop conditions', 'Named human ownership'] },
    footer: 'Capability may be broad, but authority should remain proportional to risk and evidence.',
  }],
];

const renderConcept = {
  flow: conceptFlow,
  comparison: conceptComparison,
  hub: conceptHub,
  stack: conceptStack,
};

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
  ...chapterDiagramSpecs.map(([filename, type, spec]) => [filename, renderConcept[type](spec)]),
];

await fs.mkdir(OUT_DIR, { recursive: true });

for (const [filename, svg] of assets) {
  const outputPath = path.join(OUT_DIR, filename);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);
  console.log(`${filename} ${WIDTH}x${HEIGHT}`);
}
