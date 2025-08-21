import { useEffect } from "react";
import { PageShell } from "../PageShell";
import { WebR } from "@r-wasm/webr";

const Introduction = () => {
  useEffect(() => {
    const init = async () => {
      const webR = new WebR();
      await webR.init();

      const runBtn = document.getElementById("runR");
      const output = document.getElementById("rOutput");
      const canvas = document.getElementById("rPlot");

      runBtn.onclick = async () => {
        const code = document.getElementById("rCode").value;
        const shelter = await new webR.Shelter();
        const capture = await shelter.captureR(`
          webr::canvas(width=640, height=480)
          ${code}
          dev.off()
        `);

        // show text output
        const lines = capture.output
          .filter((x) => x.type === "stdout")
          .map((x) => x.data);
        output.textContent = lines.join("\n") || "[no console output]";

        // show first plot (if any)
        if (capture.images.length) {
          const img = capture.images[0];
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext("2d").drawImage(img, 0, 0);
        }
        shelter.purge();
      };

      output.textContent = "webR is ready. Type some R code and click Run!";
    };

    init();
  }, []);

  return (
    <PageShell>
      <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-500 bg-clip-text text-transparent mb-4 animate-fade-in">
        Introduction to Statistics
      </h1>

      <p>
        Welcome!
      </p>

      {/* --- R playground --- */}
      <h2 className="mt-8 font-semibold text-gray-800 dark:text-gray-80">
        Try it yourself
      </h2>
      <textarea
        id="rCode"
        rows="6"
        defaultValue="mean(rnorm(1000))"
        className="w-full p-2 border rounded"
      />
      <button
        id="runR"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Run R
      </button>
      <pre id="rOutput" className="mt-2 p-2 bg-gray-100 rounded"></pre>
      <canvas
        id="rPlot"
        width="640"
        height="480"
        className="mt-2 border"
      ></canvas>
    </PageShell>
  );
};

export default Introduction;
