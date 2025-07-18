// A wrapper for consistent page styling
const PageShell = ({ title, children }) => (
    <section className="bg-card p-8 rounded-xl shadow-lg">
         <h2 className="text-3xl font-bold text-card-foreground mb-6">{title}</h2>
        <div className="prose dark:prose-invert text-foreground max-w-none">
            {children}
        </div>
    </section>
);

export { PageShell };