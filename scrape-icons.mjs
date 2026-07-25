import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const keyword = process.argv[2];
if (!keyword) {
  console.error("Please provide a keyword to search. Example: node scrape-icons.mjs birthday");
  process.exit(1);
}

const capitalizedCategory = keyword.charAt(0).toUpperCase() + keyword.slice(1);
const JSON_FILE = path.join(process.cwd(), 'src', 'app', 'design', 'scraped-icons.json');

async function scrapeFreeSVG() {
  console.log(`Searching FreeSVG.org for: ${keyword}...`);
  try {
    const response = await axios.get(`https://freesvg.org/search/?q=${keyword}`);
    const $ = cheerio.load(response.data);
    
    // Find all links to SVG detail pages
    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('https://freesvg.org/') && !href.includes('search') && !href.includes('page') && !href.includes('login') && !href.includes('register') && !href.includes('tag')) {
        links.push(href);
      }
    });

    const uniqueLinks = Array.from(new Set(links)).slice(0, 30); // Take top 30 for safety

    if (uniqueLinks.length === 0) {
      console.log(`No SVGs found for '${keyword}'. Try another word.`);
      return;
    }

    console.log(`Found ${uniqueLinks.length} potential SVGs. Fetching them...`);
    
    const newIcons = [];
    
    // Load existing data
    let existingIcons = [];
    if (fs.existsSync(JSON_FILE)) {
       const content = fs.readFileSync(JSON_FILE, 'utf8');
       existingIcons = JSON.parse(content || '[]');
    }

    for (const link of uniqueLinks) {
       try {
         const pageRes = await axios.get(link);
         const page$ = cheerio.load(pageRes.data);
         
         // In freesvg, the SVG is often directly embeded, or we look for the download link of .svg
         // Actually, they show a preview SVG in the page, or provide a button with .svg
         const downloadUrl = page$('a').filter((i, a) => $(a).attr('href') && $(a).attr('href').endsWith('.svg')).first().attr('href');
         
         if (downloadUrl) {
           const svgRes = await axios.get(downloadUrl);
           const svgContent = svgRes.data;
           
           if (typeof svgContent === 'string' && svgContent.includes('<svg')) {
             // Extract just the <svg ...> ... </svg> part to be safe
             const match = svgContent.match(/<svg[\s\S]*?<\/svg>/i);
             if (match) {
               let cleanSvg = match[0].replace(/\r?\n|\r/g, '').replace(/"/g, "'");
               
               // Ensure it has currentColor if it doesn't already, for coloring to work
               if (!cleanSvg.includes('currentColor')) {
                   // A basic attempt to make it colorable
                   cleanSvg = cleanSvg.replace(/<svg /, `<svg fill="currentColor" `);
               }

               const id = `scraped-${keyword}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
               newIcons.push({
                 id: id,
                 name: `${capitalizedCategory} Clipart`,
                 category: capitalizedCategory,
                 svg: cleanSvg
               });
               console.log(`Successfully extracted SVG from ${link}`);
             }
           }
         }
       } catch (e) {
         console.error(`Failed to fetch SVG from ${link}: ${e.message}`);
       }
    }
    
    if (newIcons.length > 0) {
      existingIcons.push(...newIcons);
      fs.writeFileSync(JSON_FILE, JSON.stringify(existingIcons, null, 2));
      console.log(`\nSuccess! Added ${newIcons.length} new icons to the '${capitalizedCategory}' category.`);
      console.log(`Restart your Next.js server if changes don't appear immediately.`);
    } else {
      console.log("Could not extract any valid SVG paths. They might be protected or missing.");
    }

  } catch (err) {
    console.error("Error connecting to FreeSVG:", err.message);
  }
}

scrapeFreeSVG();
