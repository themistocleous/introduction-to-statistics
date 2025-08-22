import { useState, useEffect, useRef } from "react";
import { PageShell } from "../PageShell";
import { WebR } from "@r-wasm/webr";

const webR = new WebR({
  baseUrl: process.env.PUBLIC_URL + "/webr/",
});

// Create a single shelter instance outside the component
// to persist the R session and improve performance.
let shelter;

const Introduction = () => {
  const [rCode, setRCode] = useState("x <- 1:10\nmean(x)");
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

  const handleRunR = async () => {
    if (!rCode.trim()) {
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

    try {
      // Use webr::canvas for plotting and capture the output
      const result = await shelter.captureR(`
        webr::canvas(width=640, height=480)
        ${rCode}
        dev.off()
      `);
        
      const textOutput = result.output
        .filter((line) => line.type === "stdout" || line.type === "stderr")
        .map((line) => line.data)
        .join("\n");
      
      // Check for an empty string before processing to avoid errors
      if (textOutput.trim() === '') {
        setOutput('[no console output]');
      } else {
        // Streamline output to remove the [1] which is standard for R console
        // but can be confusing for new users.
        setOutput(textOutput.replace(/\[\d+\]\s*/g, '').trim());
      }
      
      const canvas = canvasRef.current;
      if (result.images && result.images.length > 0) {
        const img = result.images[0];
        // Resize canvas to match the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        // Draw the plot
        context.drawImage(img, 0, 0);
      } else {
        // Clear the canvas if no plot is generated
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
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
      title: "Basic Calculations",
      description: "Perform simple arithmetic and variable assignment.",
      code: "x <- c(3, 2, 5, 8, 1)\nmean(x)\nsum(x)",
    },
    {
      title: "Data Summary",
      description: "Summarize a built-in dataset.",
      code: "data(iris)\nsummary(iris)",
    },
    {
      title: "Creating a Bar Chart",
      description: "Visualize data with a simple bar chart.",
      code: "barplot(table(mtcars$cyl), main='Car Cylinders', xlab='Number of Cylinders', ylab='Count', col='skyblue')",
    },
    {
      title: "Creating a Scatter Plot",
      description: "Explore the relationship between two variables.",
      code: "plot(mtcars$wt, mtcars$mpg, main='Weight vs. MPG', xlab='Weight (1000 lbs)', ylab='Miles Per Gallon', pch=19, col='purple')",
    },
    {
      title: "Generating a Histogram",
      description: "Understand the distribution of a variable.",
      code: "hist(iris$Sepal.Length, main='Sepal Length Distribution', xlab='Sepal Length', col='lightgreen', border='darkgreen')",
    },
    {
      title: "Performing a T-test",
      description: "Conduct a statistical test to compare two groups.",
      code: "group_a <- c(25, 28, 30, 22, 27)\ngroup_b <- c(35, 38, 40, 32, 37)\nt.test(group_a, group_b)",
    },
  ];

  const handleExampleClick = (code) => {
    setRCode(code);
    handleRunR();
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
        
        <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Interactive R Playground Section */}
          <div className="relative z-10 p-6 sm:p-8 rounded-xl bg-card-bg-color border border-border-color shadow-xl animate-fade-in-delay-2 h-full">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-card-text-color text-left">
              Try it yourself 🚀
            </h2>
            
            {/* R Code Input */}
            <div className="mb-4">
              <textarea
                value={rCode}
                onChange={(e) => setRCode(e.target.value)}
                rows="10"
                className="w-full p-4 rounded-lg font-mono text-sm bg-gray-100 dark:bg-gray-700 text-text-color dark:text-gray-100 placeholder-gray-400 border border-border-color focus:border-primary-color outline-none transition-colors"
                disabled={isLoading || isRunning}
                placeholder="Enter your R code here"
              />
            </div>
            
            {/* Run Button */}
            <button
              onClick={handleRunR}
              className="w-full py-3 rounded-lg font-bold text-lg text-white bg-primary-color bg-primary-hover transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading || isRunning}
            >
              {getButtonText()}
            </button>
            
            {/* Output & Plot Display */}
            <div className="mt-6 text-left">
              
              {/* Console Output Section */}
              <div className="mb-4">
                <h3 className="font-semibold text-card-text-color mb-2">
                  Console Output
                </h3>
                <pre className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm font-mono whitespace-pre-wrap overflow-x-auto border border-border-color text-text-color min-h-[5rem]">
                  {output}
                </pre>
                {error && (
                  <pre className="mt-2 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-sm whitespace-pre-wrap overflow-x-auto">
                    {error}
                  </pre>
                )}
              </div>

              {/* Plot Section */}
              <div>
                <h3 className="font-semibold text-card-text-color mb-2">
                  Plot
                </h3>
                <div className="relative p-2 bg-gray-100 dark:bg-gray-900 rounded-lg border border-border-color flex justify-center items-center">
                  <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    className="rounded-md"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples Section */}
          <div className="relative z-10 p-6 sm:p-8 rounded-xl bg-card-bg-color border border-border-color shadow-xl animate-fade-in-delay-3 h-full">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-card-text-color text-left">
              Explore Examples
            </h2>
            <div className="space-y-4">
              {codeExamples.map((example, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer border border-border-color group"
                  onClick={() => handleExampleClick(example.code)}
                >
                  <h3 className="text-lg font-semibold text-card-text-color group-hover:text-primary-color transition-colors">{example.title}</h3>
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