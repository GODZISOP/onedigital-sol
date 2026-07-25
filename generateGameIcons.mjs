import fs from 'fs';
import path from 'path';

const ICONS_FILE = path.join(process.cwd(), 'node_modules', '@iconify-json', 'game-icons', 'icons.json');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'app', 'design', 'clipartData.ts');
const MAX_ICONS = 2000; // There are over 4000, let's take 2000 for safety so the file doesn't get too massive

async function generate() {
  if (!fs.existsSync(ICONS_FILE)) {
    console.error('Game icons file not found. Please run npm install @iconify-json/game-icons');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(ICONS_FILE, 'utf8');
  const iconData = JSON.parse(fileContent);
  const icons = iconData.icons;
  const iconKeys = Object.keys(icons);
  
  console.log(`Found ${iconKeys.length} game icons. Taking first ${MAX_ICONS}...`);

  const categories = ['Animals', 'Fantasy', 'Weapons', 'Items', 'Nature', 'Magic', 'People', 'Misc'];
  
  let tsCode = `export interface ClipartItem {
  id: string;
  name: string;
  category: string;
  svg: string;
}

export const CLIPART_CATEGORIES = ${JSON.stringify(categories)};

export const CLIPART_DATA: ClipartItem[] = [\n`;

  let count = 0;
  for (const key of iconKeys) {
    if (count >= MAX_ICONS) break;
    const icon = icons[key];
    
    // Construct the SVG string. Game-icons are solid patches!
    // The width/height defaults to 512 in this set, we'll wrap it in standard viewBox
    const width = iconData.width || 512;
    const height = iconData.height || 512;
    
    // Iconify body strings usually don't have fill="currentColor", they just have paths. 
    // We add fill="currentColor" on the SVG tag so Fabric handles it well.
    let svgContent = `<svg viewBox="0 0 ${width} ${height}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${icon.body}</svg>`;
    
    // Clean up the SVG for React/Fabric
    const cleanSvg = svgContent.replace(/\r?\n|\r/g, '').replace(/"/g, "'");
    
    // Assign a random category
    const category = categories[count % categories.length];

    tsCode += `  { id: '${key}', name: '${key.replace(/-/g, ' ')}', category: '${category}', svg: \`${cleanSvg}\` },\n`;
    count++;
  }

  tsCode += `];\n`;

  fs.writeFileSync(OUTPUT_FILE, tsCode);
  console.log(`Successfully generated ${count} game icons in ${OUTPUT_FILE}`);
}

generate();
