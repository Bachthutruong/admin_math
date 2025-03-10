const gulp = require("gulp");
const gap = require("gulp-append-prepend");

gulp.task("licenses", async function () {
  // this is to add Creative Tim licenses in the production mode for the minified js
  gulp
    .src("build/static/js/*chunk.js", { base: "./" })
    .pipe(
      gap.prependText(`/*!

      =========================================================
      * Toán Thầy Tài Chakra - v1.0.0
      =========================================================
      
      * Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
      * Copyright 2021 Creative Tim (https://www.creative-tim.com/)
      * Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)
      
      * Design and Coded by Simmmple & Creative Tim
      
      =========================================================
      
      * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      
      */`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // this is to add Creative Tim licenses in the production mode for the minified html
  gulp
    .src("build/index.html", { base: "./" })
    .pipe(
      gap.prependText(`<!--
      /*!

      =========================================================
      * Toán Thầy Tài Chakra - v1.0.0
      =========================================================
      
      * Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
      * Copyright 2021 Creative Tim (https://www.creative-tim.com/)
      * Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)
      
      * Design and Coded by Simmmple & Creative Tim
      
      =========================================================
      
      * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      
      */
      -->`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // this is to add Creative Tim licenses in the production mode for the minified css
  gulp
    .src("build/static/css/*chunk.css", { base: "./" })
    .pipe(
      gap.prependText(`/*!

      =========================================================
      * Toán Thầy Tài Chakra - v1.0.0
      =========================================================
      
      * Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
      * Copyright 2021 Creative Tim (https://www.creative-tim.com/)
      * Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)
      
      * Design and Coded by Simmmple & Creative Tim
      
      =========================================================
      
      * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      
      */`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));
  return;
});
