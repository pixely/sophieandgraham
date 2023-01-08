// const { EleventyEdgePlugin } = require("@11ty/eleventy");
const tinyHTML = require('@sardine/eleventy-plugin-tinyhtml');
const Image = require("@11ty/eleventy-img");
const { readFileSync } = require('fs');

module.exports = function(eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  
  eleventyConfig.addWatchTarget("./_site/css/");
  eleventyConfig.addWatchTarget("./src/assets/");
  

  // Watch CSS files for changes
  eleventyConfig.setBrowserSyncConfig({
		files: './_site/css/**/*.css',
  });
  
  // Display 404 page in BrowserSnyc
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
        ready: (err, bs) => {
            const content404 = readFileSync('_site/404.html');

            bs.addMiddleware('*', (req, res) => {
                // Provides the 404 content without redirect.
                res.write(content404);
                res.end();
            });
        },
    },
});

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicons": "/" });

  eleventyConfig.addPlugin(tinyHTML);
  
  async function imageShortcode(src, alt, sizes = "100vw", widths = "300,600", className = '') {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }

    let metadata = await Image(src, {
      widths: widths.split(','),
      formats: ["avif", "webp", "jpeg"],
      outputDir: "./_site/images/",
      urlPath: "/images/",
    });

    let lowsrc = metadata.jpeg[0];
    let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

    return `<picture>
      ${Object.values(metadata).map(imageFormat => {
        return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          src="${lowsrc.url}"
          width="${highsrc.width}"
          height="${highsrc.height}"
          alt="${alt}"
          class="${className}"
          loading="lazy"
          decoding="async">
      </picture>`;
  }

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    htmlTemplateEngine: 'liquid',
  }
};