import React, { useState, useEffect, useRef } from 'react';
import ThemeSwitcher from './themeSwitcher';
import HomePage from './homepage';
import { PageShell } from './PageShell';

// --- Main App Component ---
// This component manages the navigation and renders the currently active page.
const App = () => {
    const [currentPage, setCurrentPage] = useState('home');

    const navigateTo = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage navigateTo={navigateTo} />;
            case 'research-questions':
                return <ResearchQuestionsPage />;
            case 'foundations':
                return <FoundationsPage />;
            case 'probability':
                return <ProbabilityPage />;
            case 'comparisons':
                return <ComparisonsPage />;
            case 'relationships':
                return <RelationshipsPage />;
            case 'reporting':
                return <ReportingPage />;
            case 'exam-prep':
                return <ExamPrepPage />;
            default:
                return <HomePage navigateTo={navigateTo} />;
        }
    };

    return (
         <div className="bg-background text-foreground min-h-screen">
            <Navbar navigateTo={navigateTo} currentPage={currentPage} />
            <main className="container mx-auto px-6 py-12">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

// --- Navigation Component ---
const Navbar = ({ navigateTo, currentPage }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const links = [
        { key: 'research-questions', label: 'Research Questions' },
        { key: 'foundations', label: 'Foundations' },
        { key: 'probability', label: 'Probability' },
        { key: 'comparisons', label: 'Comparisons' },
        { key: 'relationships', label: 'Relationships' },
        { key: 'reporting', label: 'Reporting' },
        { key: 'exam-prep', label: 'Exam Prep' },
    ];

    const NavLink = ({ pageKey, label }) => (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigateTo(pageKey); setMobileMenuOpen(false); }}
            className={`block md:inline-block px-3 py-2 rounded-md text-sm font-medium ${currentPage === pageKey ? 'bg-primary/20 text-primary' : 'text-muted hover:bg-card hover:text-primary'}`}
        >
            {label}
        </a>
    );

    return (
        <header className="bg-card shadow-md sticky top-0 z-50 border-b border-border">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-foreground"> {/* Changed from text-gray-900 */}
                    <ThemeSwitcher />
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Intro to Stats</a>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        {links.map(link => <NavLink key={link.key} pageKey={link.key} label={link.label} />)}
                    </div>
                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden flex items-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 space-y-1">
                        {links.map(link => <NavLink key={link.key} pageKey={link.key} label={link.label} />)}
                    </div>
                )}
            </nav>
        </header>
    );
};

// --- Footer Component ---
const Footer = () => (
    <footer className="bg-gray-800 text-white dark:bg-gray-950 dark:text-gray-50 mt-16"> {/* Added dark: variants for better contrast */}
        <div className="container mx-auto px-6 py-8 text-center">
            <p>© 2025 <a href='https://www.uv.uio.no/isp/'>Institute of Special Needs Education</a>, <a href='https://www.uv.uio.no/english/'>Faculty of Educational Sciences</a>, <a href='https://www.uio.no/english/'>University of Oslo</a>.</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Developed by Charalambos Themistocleous</p> {/* Adjusted for visibility */}
        </div>
    </footer>
);

// --- Page Components ---

// const HomePage = ({ navigateTo }) => (
//     <section className="text-center">
//         <h1 className="text-5xl font-bold text-primary-color">Welcome to Introduction to Statistics</h1>
//         <p className="text-xl text-gray-700 mb-6">Learn the foundations of statistics with a focus on educational research.</p>
//         <img src={ns_png} alt="Statistics Illustration" className="mx-auto mb-6 w-1/5 md:w-1/4 rounded-lg shadow-lg" />
//         <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8"><a href='https://www.uv.uio.no/isp/'>Institute of Special Needs Education</a>, <a href='https://www.uv.uio.no/english/'>Faculty of Educational Sciences</a>, <a href='https://www.uio.no/english/'>University of Oslo</a></p>
//         <button onClick={() => navigateTo('research-questions')} className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
//             Get Started
//         </button>
//     </section>
// );

const ResearchQuestionsPage = () => (
    <PageShell title="1. Formulation of Research Questions">
        <p>The starting point of any statistical inquiry is a well-defined research question. A good research question is specific, measurable, and identifies the key variables you are interested in. It guides your data collection and analysis plan.</p>
        <p>For example, instead of asking "Does teaching method affect learning?", a better question would be: "Do students taught with Method A have significantly higher test scores than students taught with Method B?". This specifies the variables (teaching method, test scores) and the comparison of interest.</p>
        <GeminiResearchQuestionGenerator />
        <CodeBlock language="r" code={`
# Load a hypothetical dataset
student_data <- data.frame(
  student_id = 1:100,
  teaching_method = factor(rep(c("Method A", "Method B"), each = 50)),
  test_score = c(rnorm(50, 85, 5), rnorm(50, 88, 5))
)
# View the first few rows of the data
head(student_data)
# Get a summary of the variables
summary(student_data)
        `} />
    </PageShell>
);

const FoundationsPage = () => (
    <PageShell title="2. Review of Measurement Scales, Averages, and Graphs">
        <h3 className="text-xl text-foreground font-semibold mt-6 mb-4">Measurement Scales</h3>
        <ul class="text-foreground">
            <li><strong class="text-foreground">Nominal:</strong> Categorical data without an intrinsic order (e.g., gender, teaching method).</li>
            <li><strong class="text-foreground">Ordinal:</strong> Categorical data with a meaningful order but unequal intervals (e.g., satisfaction ratings from 'low' to 'high').</li>
            <li><strong class="text-foreground">Interval:</strong> Numerical data with equal intervals but no true zero (e.g., temperature in Celsius).</li>
            <li><strong class="text-foreground">Ratio:</strong> Numerical data with equal intervals and a true zero (e.g., height, weight, test scores).</li>
        </ul>
        <h3 className="text-xl font-semibold mt-6 mb-4 text-foreground">Averages and Standard Deviations</h3>
        <p class="text-foreground">The <strong class="text-foreground">mean</strong> (average) is the sum of all values divided by the number of values. The <strong class="text-foreground">median</strong> is the middle value. The <strong class="text-foreground">mode</strong> is the most frequent value. The <strong class="text-foreground">standard deviation</strong> measures the amount of variation or dispersion of a set of values.</p>
        
        <CodeBlock language="r" code={`
# Calculate mean and standard deviation for test scores
# Assuming student_data from the previous section is loaded
mean_score <- mean(student_data$test_score)
sd_score <- sd(student_data$test_score)

print(paste("Mean Test Score:", round(mean_score, 2)))
print(paste("Standard Deviation:", round(sd_score, 2)))

# Create a boxplot to visualize the distribution
boxplot(test_score ~ teaching_method, data = student_data,
        main = "Test Scores by Teaching Method",
        xlab = "Teaching Method",
        ylab = "Test Score",
        col = c("lightblue", "lightgreen"))
        `} />
    </PageShell>
);

const ProbabilityPage = () => (
    <PageShell title="3. Probability and the Normal Distribution">
        <p><strong class="text-foreground">Probability</strong> is the measure of the likelihood that an event will occur. The <strong class="text-foreground">normal distribution</strong> is a fundamental concept in statistics. It's a bell-shaped curve where most of the data clusters around the mean.</p>
        <p>Use the sliders below to see how changing the <strong class="text-foreground">mean</strong> (the center of the distribution) and the <strong class="text-foreground">standard deviation</strong> (the spread of the distribution) affects the shape of the normal curve.</p>
        <InteractiveNormalDistribution />
    </PageShell>
);

const ComparisonsPage = () => (
     <PageShell title="5. Comparison of Groups or Time Points">
        <p>A common task is to compare groups. For two groups, we often use a <strong class="text-foreground">t-test</strong> to determine if the difference between their means is statistically significant. For more than two groups, we use <strong class="text-foreground">ANOVA (Analysis of Variance)</strong>.</p>
        <h3 className="text-xl font-semibold mt-6 mb-4 text-foreground">Example in R (T-test)</h3>
        <CodeBlock language="r" code={`
# Perform an independent samples t-test
ttest_result <- t.test(test_score ~ teaching_method, data = student_data)

# Print the results
print(ttest_result)
        `} />
        <p>The p-value in the result tells us the probability of observing the data (or more extreme data) if there were no real difference between the groups. A small p-value (typically &lt; 0.05) suggests a significant difference.</p>
    </PageShell>
);

const RelationshipsPage = () => (
    <PageShell title="6. Relationships Between Numerical Variables: Correlation">
        <p><strong class="text-foreground">Correlation</strong> measures the strength and direction of a linear relationship between two numerical variables. The correlation coefficient (r) ranges from -1 to +1. A value of +1 indicates a perfect positive linear relationship, -1 a perfect negative linear relationship, and 0 no linear relationship.</p>
        <CodeBlock language="r" code={`
# Let's add another variable: hours studied
set.seed(42) # for reproducibility
student_data$hours_studied <- student_data$test_score * 0.1 + rnorm(100, 2, 1)

# Create a scatter plot
plot(student_data$hours_studied, student_data$test_score,
     main="Test Score vs. Hours Studied",
     xlab="Hours Studied",
     ylab="Test Score",
     pch=19, col="blue")

# Calculate the correlation
correlation_result <- cor.test(student_data$hours_studied, student_data$test_score)
print(correlation_result)
        `} />
    </PageShell>
);

const ReportingPage = () => (
    <PageShell title="7. How to Recognize, Interpret, and Report Statistical Analyses">
        <p>Reporting statistical results clearly is a crucial skill. When reporting a t-test, for example, you should include the means and standard deviations for each group, the t-statistic, degrees of freedom, and the p-value.</p>
        <p><strong class="text-foreground">Example Report:</strong> "An independent-samples t-test was conducted to compare test scores for students taught with Method A and Method B. There was a significant difference in scores for Method A (M=85.1, SD=4.9) and Method B (M=88.2, SD=5.1); t(98) = -3.0, p &lt; .01. These results suggest that students taught with Method B scored significantly higher than those taught with Method A."</p>
        <GeminiReportInterpreter />
    </PageShell>
);

const ExamPrepPage = () => (
    <PageShell title="8. Important Points and Exam Preparation">
        <ul>
            <li><strong class="text-foreground">Understand the Concepts:</strong> Don't just memorize R code. Understand the concepts behind the tests. Why a t-test? Why a correlation?</li>
            <li><strong class="text-foreground">Check Assumptions:</strong> Many statistical tests have assumptions (e.g., normal distribution). Know what they are.</li>
            <li><strong class="text-foreground">Correlation is Not Causation:</strong> Just because two variables are correlated does not mean one causes the other.</li>
            <li><strong class="text-foreground">Practice:</strong> The best way to learn is by doing. Work through problems, analyze datasets, and practice interpreting the output.</li>
        </ul>
        <div className="mt-6 p-4 border-l-4 rounded-md bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:border-blue-400 dark:text-blue-200">
            <p className="font-bold">Good luck with your studies and the exam!</p>
        </div>
    </PageShell>
);

// --- Reusable & Helper Components ---



// A component for displaying formatted code blocks
const CodeBlock = ({ language, code }) => (
    <div className="my-6">
        <pre className="bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-50 p-4 rounded-lg overflow-x-auto"> {/* Slight adjustment for darker in dark mode */}
            <code className={`language-${language}`}>
                {code.trim()}
            </code>
        </pre>
    </div>
);

// Interactive D3 component for Normal Distribution
const InteractiveNormalDistribution = () => {
    const d3Container = useRef(null);
    const [mean, setMean] = useState(0);
    const [sd, setSd] = useState(1);

    useEffect(() => {
        if (d3Container.current && window.d3) {
            const d3 = window.d3;
            const svg = d3.select(d3Container.current);
            svg.selectAll("*").remove();

            const margin = { top: 20, right: 30, bottom: 40, left: 40 };
            const width = d3Container.current.clientWidth - margin.left - margin.right;
            const height = 300 - margin.top - margin.bottom;

            const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
            const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

            // X-axis
            g.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
            g.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height + margin.bottom - 10)
                .text("Value");

            // Y-axis
            g.append("g")
                .call(d3.axisLeft(y));
            g.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 15)
                .attr("x", 0)
                .text("Density");

            // Function to calculate normal distribution PDF
            const normal = (xVal) => (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((xVal - mean) / sd, 2));

            const data = x.ticks(100).map(d => ({ x: d, y: normal(d) }));

            const line = d3.line()
                .x(d => x(d.x))
                .y(d => y(d.y));

            // Use CSS variable for stroke
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

            g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", primaryColor)
                .attr("stroke-width", 2.5)
                .attr("d", line);
        }
    }, [mean, sd]); // Removed d3Container.current from deps to avoid infinite loop; redraw on param change

    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-border dark:bg-gray-800 dark:border-gray-700"> {/* Made theme-aware */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="mean-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mean: {mean}</label>
                    <input id="mean-slider" type="range" min="-5" max="5" step="0.1" value={mean} onChange={(e) => setMean(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
                <div>
                    <label htmlFor="sd-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Standard Deviation: {sd}</label>
                    <input id="sd-slider" type="range" min="0.5" max="3" step="0.1" value={sd} onChange={(e) => setSd(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
            </div>
            <svg ref={d3Container} className="w-full h-[300px] rounded-lg bg-white border border-border dark:bg-gray-900 dark:border-gray-700" />
        </div>
    );
};
// --- Gemini API Feature Components ---
const GeminiResearchQuestionGenerator = () => {
    const [topic, setTopic] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!topic.trim()) {
            setOutput('<p class="text-red-600 dark:text-red-400">Please enter a topic.</p>');
            return;
        }
        if (typeof window.markdownit !== 'function') {
            setOutput('<p class="text-red-600 dark:text-red-400">Error: Markdown library not loaded.</p>');
            return;
        }
        const md = window.markdownit();
        setLoading(true);
        setOutput('');
        const prompt = `As an expert in educational and special needs statistics, generate 3-5 well-formed, testable research questions based on the following topic: "${topic}". The questions should be suitable for an introductory statistics course. For each question, briefly mention the key variables involved.`;
        try {
            const text = await callGemini(prompt);
            setOutput(md.render(text));
        } catch (error) {
            setOutput('<p class="text-red-600 dark:text-red-400">Sorry, there was an error. Please try again.</p>');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-700">
            <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-200 mb-4">✨ Research Question Generator</h3>
            <p className="text-indigo-700 dark:text-indigo-300 mb-4">Enter a topic below, and our AI assistant will help you draft some testable research questions.</p>
            <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-200" placeholder="e.g., 'student anxiety and exam performance'" />
                <button onClick={handleClick} disabled={loading} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:disabled:bg-indigo-600">
                    {loading ? 'Generating...' : 'Generate Questions'}
                </button>
            </div>
            {loading && <div className="loader mx-auto my-4"></div>}
            {output && <div className="mt-4 p-4 bg-white rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: output }} />}
        </div>
    );
};
const GeminiReportInterpreter = () => {
    const [rOutput, setROutput] = useState('');
    const [interpretation, setInterpretation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!rOutput.trim()) {
            setInterpretation('<p class="text-red-600 dark:text-red-400">Please paste your R output.</p>');
            return;
        }
        if (typeof window.markdownit !== 'function') {
            setInterpretation('<p class="text-red-600 dark:text-red-400">Error: Markdown library not loaded.</p>');
            return;
        }
        const md = window.markdownit();
        setLoading(true);
        setInterpretation('');
        const prompt = `I am a student in an introductory statistics course for education. Please explain the following R statistical output in simple terms. Explain what the main values (like p-value, t-statistic, correlation coefficient, means) mean and what the overall conclusion is. Here is the output:\n\n\`\`\`\n${rOutput}\n\`\`\``;
        try {
            const text = await callGemini(prompt);
            setInterpretation(md.render(text));
        } catch (error) {
            setInterpretation('<p class="text-red-600 dark:text-red-400">Sorry, there was an error. Please try again.</p>');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-teal-50 rounded-lg border border-teal-200 dark:bg-teal-950/30 dark:border-teal-700">
            <h3 className="text-xl font-semibold text-teal-800 dark:text-teal-200 mb-4">✨ Statistical Output Interpreter</h3>
            <p className="text-teal-700 dark:text-teal-300 mb-4">Paste your statistical test results below to get a plain-language explanation.</p>
            <textarea value={rOutput} onChange={e => setROutput(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md h-40 focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:focus:ring-teal-400 dark:bg-gray-800 dark:text-gray-200" placeholder="Paste your R output here..."></textarea>
            <button onClick={handleClick} disabled={loading} className="mt-2 bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300 flex items-center justify-center disabled:bg-teal-400 dark:bg-teal-500 dark:hover:bg-teal-400 dark:disabled:bg-teal-600">
                {loading ? 'Interpreting...' : 'Interpret Results'}
            </button>
            {loading && <div className="loader mx-auto my-4"></div>}
            {interpretation && <div className="mt-4 p-4 bg-white rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: interpretation }} />}
        </div>
    );
};
// --- Gemini API Call Function ---
async function callGemini(prompt) {
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = ""; // API key is handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
    } else {
        console.error("Unexpected API response structure:", result);
        throw new Error("Could not extract text from API response.");
    }
}


export default App;