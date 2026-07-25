import fs from 'fs';
import path from 'path';

const category = process.argv[2];
if (!category) {
  console.error("Please provide a category name. Example: node import-local-icons.mjs Birthday");
  process.exit(1);
}

const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
const IMPORT_DIR = path.join(process.cwd(), 'public', 'custom-svgs');
const JSON_FILE = path.join(process.cwd(), 'src', 'app', 'design', 'scraped-icons.json');

if (!fs.existsSync(IMPORT_DIR)) {
  fs.mkdirSync(IMPORT_DIR, { recursive: true });
}

const files = fs.readdirSync(IMPORT_DIR).filter(f => f.endsWith('.svg'));

if (files.length === 0) {
  console.log(`No .svg files found in ${IMPORT_DIR}. Please add some files there first.`);
  process.exit(0);
}

let existingIcons = [];
if (fs.existsSync(JSON_FILE)) {
   const content = fs.readFileSync(JSON_FILE, 'utf8');
   existingIcons = JSON.parse(content || '[]');
}

let addedCount = 0;

for (const file of files) {
  const filePath = path.join(IMPORT_DIR, file);
  let svgContent = fs.readFileSync(filePath, 'utf8');
  
  // Extract just the SVG part and clean it
  const match = svgContent.match(/<svg[\s\S]*?<\/svg>/i);
  if (match) {
    let cleanSvg = match[0].replace(/\r?\n|\r/g, '').replace(/"/g, "'");
    if (!cleanSvg.includes('currentColor')) {
        cleanSvg = cleanSvg.replace(/<svg /, `<svg fill="currentColor" `);
    }

    const id = `local-${capitalizedCategory}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    existingIcons.push({
      id: id,
      name: file.replace('.svg', '').replace(/-/g, ' '),
      category: capitalizedCategory,
      svg: cleanSvg
    });
    
    // Delete the file after importing to avoid importing it again next time
    fs.unlinkSync(filePath);
    addedCount++;
  }
}

fs.writeFileSync(JSON_FILE, JSON.stringify(existingIcons, null, 2));
console.log(`\nSuccess! Imported ${addedCount} icons into the '${capitalizedCategory}' category.`);
console.log(`Restart your Next.js server if changes don't appear immediately.`);
