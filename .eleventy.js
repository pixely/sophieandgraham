module.exports = function(eleventyConfig) {
  // Watch CSS files for changes
  eleventyConfig.setBrowserSyncConfig({
		files: './_site/css/**/*.css'
	});

  
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  const Image = require("@11ty/eleventy-img");

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