import { useState, useEffect, useRef } from "react";
import { PageShell } from "../PageShell";
import { WebR } from "@r-wasm/webr";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";


// Set up the PDF.js worker source to load from the correct path handled by the bundler
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;


// Define the WebR instance outside the component
// to ensure it's initialized only once and is accessible globally within the module.
const webR = new WebR({
  baseUrl: process.env.PUBLIC_URL + "/webr/",
});


// Create a single shelter instance outside the component
// to persist the R session and improve performance.
let shelter;

const Introduction = () => {
  const [rCode, setRCode] = useState("x <- c(3, 2, 5, 8, 1)\nmean(x)");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        await webR.init();
        shelter = await new webR.Shelter();
        setOutput("WebR is ready. Try some R code!");
      } catch (e) {
        console.error("Error initializing WebR:", e);
        setError("Failed to initialize R. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    init();

    // Cleanup function to purge the shelter when the component unmounts
    return () => {
        if (shelter) {
            shelter.purge();
        }
    };
  }, []);

  const handleRunR = async (codeToRun = rCode) => {
  if (!codeToRun.trim()) {
    setOutput("Please enter some R code to run.");
    return;
  }
  if (!shelter) {
    setError("R is not initialized. Please wait or refresh the page.");
    return;
  }
  setIsRunning(true);
  setError(null);
  setOutput("Running...");

  // Detect common plotting calls (expand as you wish)
  const hasPlottingFunction = /\b(plot|barplot|hist|boxplot|pie|qqnorm|image|ggplot)\b/.test(codeToRun);

  // Safely serialize the R code as a single R string literal
  const rCodeLiteral = JSON.stringify(codeToRun);

  // Clear canvas before running
  const context = canvasRef.current.getContext("2d");
  context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  try {
    // Build a single R program that:
    //  - optionally opens a PDF device
    //  - parses user code into expressions
    //  - evaluates each expression with withVisible() and autoprints only when visible
    //  - catches & prints errors per expression without aborting the whole run
    //  - closes the device if it was opened
    const rProgram = `
      .webr_has_plot <- ${hasPlottingFunction ? "TRUE" : "FALSE"}
      if (.webr_has_plot) pdf("plot.pdf", width=7, height=5)

      .webr_src <- ${rCodeLiteral}
      .webr_exprs <- try(parse(text = .webr_src, keep.source = FALSE), silent = TRUE)
      if (inherits(.webr_exprs, "try-error")) {
        stop(attr(.webr_exprs, "condition")$message)
      }

      for (.webr_i in seq_along(.webr_exprs)) {
        try({
          .webr_vis <- withVisible(eval(.webr_exprs[[.webr_i]], envir = .GlobalEnv))
          if (.webr_vis$visible) {
            print(.webr_vis$value)
          }
        }, silent = FALSE)
      }

      if (.webr_has_plot) try(dev.off(), silent = TRUE)
    `;

    // Run and capture text output
    const result = await shelter.captureR(rProgram);

    const textOutput = result.output
      .filter((line) => line.type === "stdout" || line.type === "stderr")
      .map((line) => line.data)
      .join("\n");

    if (textOutput.trim() === "") {
      setOutput("[no console output]");
    } else {
      // strip leading [1] etc. for friendlier display
      setOutput(textOutput.replace(/\[\d+\]\s*/g, "").trim());
    }

    // If plotting was detected, render first page of the produced PDF
    if (hasPlottingFunction) {
      try {
        const plotData = await webR.FS.readFile("/home/web_user/plot.pdf");
        const typedArray = new Uint8Array(plotData);

        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
        }).promise;
      } catch (e) {
        console.error("Error rendering PDF plot:", e);
        setError("An error occurred while rendering the plot. No plot was generated.");
      }
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  } catch (e) {
    console.error("Error executing R code:", e);
    setError(`Error: ${e.message}`);
    setOutput("");
  } finally {
    setIsRunning(false);
  }
};


  const getButtonText = () => {
    if (isLoading) return "Initializing R...";
    if (isRunning) return "Running...";
    return "Run R";
  };

  const codeExamples = [
    {
      title: "1. Create Data",
      description: "Learn how to create simple vectors and data frames.",
      code: "ages <- c(22, 25, 30, 28, 26)\nweights <- c(70, 85, 90, 82, 75)\n\nstudent_data <- data.frame(ages, weights)\n\nprint(ages)\nprint(student_data)",
    },
    {
  title: "2. Descriptive Statistics",
  description: "Learn how to calculate summary statistics like mean, median, and standard deviation.",
  code: "ages <- c(22, 25, 30, 28, 26)\nweights <- c(70, 85, 90, 82, 75)\n\n# Mean, Median, Standard Deviation\nmean(ages)\nmedian(ages)\nsd(weights)"
},

{
  title: "3. Histogram",
  description: "Visualize the distribution of a numeric variable using a histogram.",
  code: "ages <- c(22, 25, 30, 28, 26, 22, 24, 29, 31, 27)\n\nhist(ages, \n     main = 'Histogram of Ages', \n     xlab = 'Age', \n     col = 'skyblue', \n     border = 'black')"
},

{
  title: "4. Bar Plot",
  description: "Show counts of categorical data with a bar plot.",
  code: "favorite_colors <- c('Red', 'Blue', 'Blue', 'Green', 'Red', 'Blue', 'Green')\n\ncolor_counts <- table(favorite_colors)\n\nbarplot(color_counts, \n        main = 'Favorite Colors', \n        col = c('red', 'blue', 'green'), \n        xlab = 'Color', \n        ylab = 'Count')"
},

{
  title: "5. Boxplot",
  description: "Use boxplots to check the spread and detect outliers in data.",
  code: "weights <- c(70, 85, 90, 82, 75, 95, 100, 65, 80, 78)\n\nboxplot(weights, \n        main = 'Boxplot of Weights', \n        ylab = 'Weight (kg)', \n        col = 'orange')"
},

{
  title: "6. Pie Chart",
  description: "Visualize proportions of categories with a pie chart.",
  code: "favorite_sports <- c('Soccer', 'Basketball', 'Soccer', 'Tennis', 'Basketball', 'Soccer')\n\nsport_counts <- table(favorite_sports)\n\npie(sport_counts, \n    main = 'Favorite Sports', \n    col = c('lightblue', 'lightgreen', 'pink'))"
},
    {
      title: "2. One-Sample T-Test",
      description: "Test if the mean of a single group is different from a known value.",
      code: "data <- c(15, 18, 21, 22, 19, 20)\nt.test(data, mu = 20)",
    },
    {
      title: "3. Non-Parametric T-Test (Wilcoxon)",
      description: "Compare two independent groups without assuming a normal distribution.",
      code: "group_a <- c(10, 12, 15, 11, 13)\ngroup_b <- c(18, 20, 19, 22, 21)\nwilcox.test(group_a, group_b)",
    },
    {
      title: "4. Correlation Test",
      description: "Measure the relationship between two continuous variables.",
      code: "hours_studied <- c(10, 5, 8, 12, 7)\nexam_scores <- c(85, 60, 75, 95, 70)\ncor.test(hours_studied, exam_scores)",
    },
    {
      title: "5. Chi-Square Test",
      description: "Examine the relationship between two categorical variables.",
      code: "library(MASS)\n\nstudy_habits <- matrix(c(40, 60, 70, 30), ncol=2, byrow=TRUE)\ncolnames(study_habits) <- c('Good', 'Poor')\nrownames(study_habits) <- c('Passed', 'Failed')\n\nchisq.test(study_habits)",
    },
    {
      title: "6. ANOVA",
      description: "Compare the means of three or more groups.",
      code: "group_a <- c(25, 28, 30, 22)\ngroup_b <- c(35, 38, 40, 32)\ngroup_c <- c(15, 18, 20, 12)\n\ndata <- c(group_a, group_b, group_c)\ngroup <- as.factor(c(rep('A', 4), rep('B', 4), rep('C', 4)))\n\nmodel <- aov(data ~ group)\nsummary(model)",
    },
    {
      title: "7. Linear Regression",
      description: "Model the relationship between a dependent and one or more independent variables.",
      code: "speed <- c(4, 7, 8, 10, 12)\ndist <- c(2, 4, 16, 26, 30)\n\nmodel <- lm(dist ~ speed)\nsummary(model)",
    },
    {
      title: "8. Scatter Plot with Regression Line",
      description: "Visualize the linear relationship between two variables.",
      code: "speed <- c(4, 7, 8, 10, 12)\ndist <- c(2, 4, 16, 26, 30)\n\nplot(speed, dist, main='Speed vs. Stopping Distance')\n\nmodel <- lm(dist ~ speed)\nabline(model, col='red')",
    },
  ];

  const handleExampleClick = (code) => {
    setRCode(code);
    handleRunR(code);
  };
  
  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">

        {/* Main Title and Description */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-500 bg-clip-text text-transparent">
            Introduction to R
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed text-muted-text-color animate-fade-in-delay">
            Learn the foundations of statistics through interactive R examples.
          </p>
        </div>

        <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Playground */}
          <div className="md:col-span-2 relative z-10 p-6 sm:p-8 rounded-xl bg-card-bg-color border border-border-color shadow-xl animate-fade-in-delay-2 h-full">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-color text-left">
              Try it yourself 🚀
            </h2>

            {/* R Code Input */}
            <div className="mb-4">
              <textarea
                value={rCode}
                onChange={(e) => setRCode(e.target.value)}
                rows={10}
                className="
                  w-full p-4 rounded-lg font-mono text-sm
                  bg-[var(--input-bg-color)]
                  text-[var(--text-color)]
                  placeholder:text-[var(--muted-text-color)]
                  border border-[var(--border-color)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]
                  transition-colors
                  disabled:opacity-60
                "
                disabled={isLoading || isRunning}
                placeholder="Enter your R code here"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={() => handleRunR()}
              className="
                w-full py-3 rounded-lg font-bold text-lg
                text-[var(--on-primary-color)]
                bg-[var(--primary-color)]
                hover:bg-[var(--primary-hover-color)]
                focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]
                transition-colors
                disabled:opacity-50 disabled:hover:bg-[var(--primary-color)]
                disabled:cursor-not-allowed
              "
              disabled={isLoading || isRunning}
            >
              {getButtonText()}
            </button>

            {/* Output & Plot */}
            <div className="mt-6 text-left">
              {/* Console Output */}
              <div className="mb-4">
                <h3 className="font-semibold text-color mb-2">Console Output</h3>
                <pre
                  className="
                    p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-x-auto
                    bg-[var(--console-bg-color)]
                    text-[var(--text-color)]
                    border border-[var(--border-color)]
                    min-h-[5rem]
                  "
                >
                  {output}
                </pre>

                {error && (
                  <pre
                    className="
                      mt-2 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto
                      bg-[var(--error-bg-color)] text-[var(--error-fg-color)]
                      border border-[var(--error-border-color)]
                    "
                  >
                    {error}
                  </pre>
                )}
              </div>

              {/* Plot */}
              <div>
                <h3 className="font-semibold text-card-text-color mb-2">Plot</h3>
                <div
                  className="
                    relative p-2 rounded-lg border flex justify-center items-center
                    bg-[var(--plot-bg-color)]
                    border-[var(--border-color)]
                  "
                >
                  <canvas ref={canvasRef} width="640" height="480" className="rounded-md" />
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="relative z-10 p-6 sm:p-8 rounded-xl bg-card-bg-color border border-border-color shadow-xl animate-fade-in-delay-3 h-full">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-card-text-color text-left">
              Explore Examples
            </h2>
            <div className="space-y-4">
              {codeExamples.map((example, index) => (
                <div
                  key={index}
                  onClick={() => handleExampleClick(example.code)}
                  className="
                    p-4 rounded-lg transition-colors cursor-pointer border group
                    bg-[var(--surface-2-bg-color)]
                    hover:bg-[var(--surface-3-bg-color)]
                    border-[var(--border-color)]
                  "
                >
                  <h3 className="text-lg font-semibold text-card-text-color group-hover:text-[var(--primary-color)] transition-colors">
                    {example.title}
                  </h3>
                  <p className="text-sm text-muted-text-color mt-1">{example.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Introduction;