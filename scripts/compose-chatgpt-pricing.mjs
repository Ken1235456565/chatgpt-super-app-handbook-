import path from 'node:path';
import sharp from 'sharp';

const [overviewPath, proPath, entryPath, outputArg] = process.argv.slice(2);

if (!overviewPath || !proPath || !entryPath) {
  console.error('Usage: node scripts/compose-chatgpt-pricing.mjs <plus-business-pro5.png> <pro20.png> <free-go.png> [output.png]');
  process.exit(1);
}

const outputPath = path.resolve(outputArg || 'public/images/kix.h2d6f9a3c7e1.png');
const WIDTH = 2400;
const HEIGHT = 1500;

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function svgText(x, y, value, { size = 30, weight = 400, fill = '#182235', anchor = 'start' } = {}) {
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`;
}

function cardBackground(width, height, { border = '#D7DEE8', fill = '#FFFFFF', radius = 26, strokeWidth = 3 } = {}) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${width - strokeWidth}" height="${height - strokeWidth}" rx="${radius}" fill="${fill}" stroke="${border}" stroke-width="${strokeWidth}"/>
  </svg>`);
}

async function cropCard(sourcePath, extract, { width = 410, height = 520 } = {}) {
  return sharp(sourcePath)
    .extract(extract)
    .resize({ width, height, fit: 'contain', background: '#FFFFFF' })
    .png()
    .toBuffer();
}

const individualCards = await Promise.all([
  cropCard(entryPath, { left: 35, top: 228, width: 667, height: 760 }),
  cropCard(entryPath, { left: 751, top: 228, width: 667, height: 760 }),
  cropCard(overviewPath, { left: 35, top: 15, width: 800, height: 780 }),
  cropCard(overviewPath, { left: 1690, top: 15, width: 820, height: 780 }),
  cropCard(proPath, { left: 31, top: 54, width: 770, height: 800 }),
]);

const businessCard = await cropCard(
  overviewPath,
  { left: 875, top: 15, width: 780, height: 900 },
  { width: 760, height: 610 },
);

const header = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#F4F7FB"/>
  ${svgText(80, 76, 'ChatGPT Plan Prices at a Glance', { size: 50, weight: 700 })}
  ${svgText(80, 120, 'United States list prices · captured August 25, 2026 · subscriptions, not API usage', { size: 27, fill: '#59677A' })}
  <line x1="0" y1="150" x2="${WIDTH}" y2="150" stroke="#D5DDE8" stroke-width="4"/>
  ${svgText(80, 820, 'Business workspace', { size: 38, weight: 700 })}
  ${svgText(80, 860, 'Per-user pricing with centralized billing and administration', { size: 25, fill: '#59677A' })}
</svg>`);

const composites = [{ input: header, left: 0, top: 0 }];
const startX = 75;
const cardGap = 25;
const cardWidth = 430;
const cardHeight = 570;

individualCards.forEach((card, index) => {
  const left = startX + index * (cardWidth + cardGap);
  const highlighted = index === 1;
  composites.push({
    input: cardBackground(cardWidth, cardHeight, {
      border: highlighted ? '#246BEB' : '#D7DEE8',
      fill: '#FFFFFF',
      strokeWidth: highlighted ? 5 : 3,
    }),
    left,
    top: 180,
  });
  composites.push({ input: card, left: left + 10, top: 202 });
});

composites.push({
  input: cardBackground(820, 610, { border: '#9DC4FF', fill: '#FFFFFF', strokeWidth: 4 }),
  left: 80,
  top: 880,
});
composites.push({ input: businessCard, left: 110, top: 880 });

const businessNotes = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1370" height="610">
  <rect x="2" y="2" width="1366" height="606" rx="28" fill="#FFFFFF" stroke="#D5DDE8" stroke-width="4"/>
  ${svgText(55, 72, 'Business billing', { size: 36, weight: 700 })}
  ${svgText(55, 125, 'Standard seat', { size: 29, weight: 700, fill: '#0F8177' })}
  ${svgText(430, 125, '$20 / user / month', { size: 31, weight: 700 })}
  ${svgText(430, 162, 'billed annually · $25 billed monthly', { size: 23, fill: '#59677A' })}
  ${svgText(55, 225, 'Premium seat', { size: 29, weight: 700, fill: '#6C2DE1' })}
  ${svgText(430, 225, '$100 / user / month', { size: 31, weight: 700 })}
  ${svgText(430, 262, 'billed annually · $125 billed monthly', { size: 23, fill: '#59677A' })}
  <line x1="55" y1="305" x2="1310" y2="305" stroke="#D5DDE8" stroke-width="2"/>
  ${svgText(55, 365, 'Who it fits', { size: 28, weight: 700 })}
  ${svgText(55, 410, 'Standard: teams that need a secure shared workspace and admin controls.', { size: 25 })}
  ${svgText(55, 452, 'Premium: the heaviest users who need 5× usage and no five-hour limit.', { size: 25 })}
  ${svgText(55, 515, 'Enterprise', { size: 29, weight: 700, fill: '#B95608' })}
  ${svgText(430, 515, 'Custom pricing · contact sales', { size: 29, weight: 700 })}
  ${svgText(55, 565, 'Prices exclude applicable tax and may vary by region. Verify before purchase.', { size: 23, fill: '#59677A' })}
</svg>`);

composites.push({ input: businessNotes, left: 950, top: 880 });

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: '#F4F7FB',
  },
})
  .composite(composites)
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPath);

console.log(`${outputPath} ${WIDTH}x${HEIGHT}`);
