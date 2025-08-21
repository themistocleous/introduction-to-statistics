"use client"; // keep if you’re in Next.js

import { useEffect, useRef, useState } from "react";
import { PageShell } from "../PageShell";
import { WebR } from "@r-wasm/webr";

const Introduction = () => {
  const webRRef = useRef(null);
  const initializedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("Loading webR…");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      try {
        // IMPORTANT: point to your own /webr/ folder
        const webR = new WebR({ baseUrl: "/webr/" });
        await webR.init();
        if (!cancelled) {
          webRRef.current = webR;
          setReady(true);
          setMsg("webR is ready. Type code and click Run.");
        }
      } catch (e) {
        if (!cancelled) setMsg(`Failed to load webR: ${e?.message || e}`);
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onRun = async () => {
    const outEl = document.getElementById("rOutput");
    const imgEl = document.getElementById("rPlotImg");
    const code = document.getElementById("rCode").value;

    if (!webRRef.current) {
      outEl.textContent = "webR is still loading…";
      return;
    }

    try {
      const webR = webRRef.current;

      // Capture console output and an image without using <canvas>
      const capture = await webR.captureR(
        `
        webr::canvas(width=640, height=480)
        ${code}
        dev.off()
        `,
        { withAutoprint: true }
      );

      // stdout + messages
      const lines = capture.output
        .filter(x => x.type === "stdout" || x.type === "message")
        .map(x => x.data.trim())
        .filter(Boolean);
      outEl.textContent = lines.length ? lines.join("\n") : "[no console output]";

      // Show the first plot as an <img>, avoiding canvas security issues
      if (capture.images.length) {
        const bmp = capture.images[0];               // ImageBitmap
        // Convert ImageBitmap -> Blob -> Object URL for <img>
        const off = new OffscreenCanvas(bmp.width, bmp.height);
        const ctx = off.getContext("2d");
        ctx.drawImage(bmp, 0, 0);
        const blob = await off.convertToBlob();      // no pixel reads; safe
        const url = URL.createObjectURL(blob);
        imgEl.src = url;
      } else {
        imgEl.removeAttribute("src");
      }
    } catch (e) {
      outEl.textContent = `R error: ${e?.message || e}`;
      console.error(e);
    }
  };

  return (
    <PageShell>
      {/* your heading + text … */}

      <h2 className="mt-8 font-semibold">Try it yourself</h2>
      <textarea
        id="rCode"
        rows="6"
        defaultValue={`mean(rnorm(1000))\nplot(rnorm(100))`}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={onRun}
        disabled={!ready}
        className={`mt-2 px-4 py-2 rounded ${ready ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}
        type="button"
      >
        {ready ? "Run R" : "Loading…"}
      </button>
      <pre id="rOutput" className="mt-2 p-2 bg-gray-100 rounded whitespace-pre-wrap">{msg}</pre>

      {/* Use <img> instead of <canvas> to dodge cross-origin canvas rules */}
      <img id="rPlotImg" alt="R plot" className="mt-2 border max-w-full h-auto" />
    </PageShell>
  );
};

export default Introduction;
