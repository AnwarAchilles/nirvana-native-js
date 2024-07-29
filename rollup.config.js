import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser'; // Gunakan `terser` langsung

export default [
  { // CommonJS
    input: "src/nirvana.js",
    output: [
      {
        file: "dist/nirvana.js",
        format: "cjs",
        sourcemap: true
      },
      {
        file: "dist/nirvana.min.js",
        format: "cjs",
        plugins: [terser()],
        sourcemap: true
      }
    ],
    treeshake: false,
    plugins: [
      postcss({
        extract: false,
        minimize: true
      })
    ]
  },
  { // ES Module
    input: "src/nirvana.mjs",
    output: [
      {
        file: "dist/nirvana.mjs",
        format: "es",
        sourcemap: true
      },
      {
        file: "dist/nirvana.min.mjs",
        format: "es",
        plugins: [terser()],
        sourcemap: true
      }
    ],
    treeshake: false,
    plugins: [
      postcss({
        extract: false,
        minimize: true
      })
    ]
  }
];
