import * as cheerio from 'cheerio';

fetch('https://freesvg.org/party-boy-birthday-card-template-vector-illustration')
  .then(r => r.text())
  .then(html => {
    // See if the raw SVG is just inside a specific element
    const $ = cheerio.load(html);
    const svgTag = $('svg').first().parent().html();
    console.log(svgTag ? "SVG found in DOM" : "SVG not found in DOM");
    // See if there's a download link
    const download = $('a').filter((i, a) => $(a).attr('href') && $(a).attr('href').endsWith('.svg')).attr('href');
    console.log("Download link:", download);
  })
  .catch(console.error);
