import * as cheerio from 'cheerio';

fetch('https://freesvg.org/search/?q=birthday')
  .then(r => r.text())
  .then(html => {
    const $ = cheerio.load(html);
    const links = [];
    // FreeSVG usually lists them under .thumbnail or directly in a grid.
    // Let's just find all a hrefs to '/...' that look like image pages
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('https://freesvg.org/') && !href.includes('search') && !href.includes('page')) {
        links.push(href);
      }
    });
    console.log(Array.from(new Set(links)).slice(0, 10));
  })
  .catch(console.error);
