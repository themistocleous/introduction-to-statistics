const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devServer: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  webpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/pdfjs-dist/build/pdf.worker.mjs",
            to: "pdf.worker.mjs",
          },
          {
            from: "node_modules/@r-wasm/webr/dist",
            to: "webr",
          },
        ],
      }),
    ],
  },
};
