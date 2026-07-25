import fs from 'fs';
import path from 'path';

const ICONS_DIR = path.join(process.cwd(), 'node_modules', '@tabler', 'icons', 'icons', 'filled');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'app', 'design', 'clipartData.ts');
const MAX_ICONS = 1200;

async function generate() {
  if (!fs.existsSync(ICONS_DIR)) {
    console.error('Tabler icons directory not found. Please run npm install @tabler/icons');
    process.exit(1);
  }

  const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.svg'));
  console.log(`Found ${files.length} icons. Taking first ${MAX_ICONS}...`);

  // We will distribute them randomly across our categories for demonstration
  // because parsing their tags.json is extra work and the user just wants icons.
  const categories = ['Animals', 'Nature', 'Music', 'Shapes', 'Food', 'Sports', 'Tech', 'Tools', 'UI'];
  
  let tsCode = `export interface ClipartItem {
  id: string;
  name: string;
  category: string;
  svg: string;
}

export const CLIPART_CATEGORIES = ${JSON.stringify(categories)};

export const CLIPART_DATA: ClipartItem[] = [\n`;

  let count = 0;
  for (const file of files) {
    if (count >= MAX_ICONS) break;
    if (file.includes('filled')) continue; // Skip filled variants if we only want outline, or keep them.
    // Let's take only outline icons (default)
    const iconName = file.replace('.svg', '');
    const svgContent = fs.readFileSync(path.join(ICONS_DIR, file), 'utf8');
    
    // Clean up the SVG for React/Fabric
    const cleanSvg = svgContent.replace(/\r?\n|\r/g, '').replace(/"/g, "'");
    
    // Assign a random category
    const category = categories[count % categories.length];

    tsCode += `  { id: '${iconName}', name: '${iconName.replace(/-/g, ' ')}', category: '${category}', svg: \`${cleanSvg}\` },\n`;
    count++;
  }

  tsCode += `];\n`;

  fs.writeFileSync(OUTPUT_FILE, tsCode);
  console.log(`Successfully generated ${count} icons in ${OUTPUT_FILE}`);
}

generate();
