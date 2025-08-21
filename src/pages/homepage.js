import React, { useState, useEffect } from 'react';
import ns_png from '../images/ns.png';
import { PageShell } from '../PageShell';

const HomePage = ({ navigateTo }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Fixed: Added mousePosition variable
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // Update the CSS variable on mouse move
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated background dots
  const BackgroundDots = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-300/30 dark:bg-blue-800/30 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );

  // Floating geometric shapes
  const FloatingShapes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-blue-300/20 dark:border-blue-900/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 dark:bg-purple-800/30 rounded-lg animate-pulse" style={{ animationDuration: '2.5s' }} />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-green-300/25 dark:border-green-900/25 transform rotate-45 animate-spin" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-20 right-1/3 w-24 h-24 border-2 border-pink-300/20 dark:border-pink-900/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
    </div>
  );

  return (
    <PageShell>

      {/* Dynamic radial gradient overlay */}
      <div className="radial-gradient-overlay" />
      
      <BackgroundDots />
      <FloatingShapes />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[length:40px_40px] bg-repeat"
           style={{ backgroundImage: `
             linear-gradient(to right, var(--grid-color), transparent 1px),
             linear-gradient(to bottom, var(--grid-color), transparent 1px)
           `}}>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Animated title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-500 bg-clip-text text-transparent mb-4 animate-fade-in">
              Welcome
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 dark:from-indigo-400 dark:via-blue-400 dark:to-purple-500 bg-clip-text text-transparent animate-fade-in-delay">
              Introduction to Statistics
            </h1>
            
            {/* Decorative line */}
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 mx-auto mt-6 rounded-full animate-expand" />
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay-2 leading-relaxed text-foreground">
            Learn the foundations of statistics with a focus on educational research
          </p>

          {/* Illustration container */}
          <div className="mb-8 relative group animate-fade-in-delay-3">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-300 transform group-hover:scale-105" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-102">
                <div className="flex flex-col items-center">
                <img src={ns_png} alt="Statistics Illustration" className="mx-auto mb-6 w-1/5 md:w-1/4 rounded-lg shadow-lg" />
              </div>
            </div>
          </div>

          {/* Institution links */}
          <div className="mb-12 animate-fade-in-delay-4">
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              <a href='https://www.uv.uio.no/isp/' className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors">
                Institute of Special Needs Education
              </a>
              <span className="mx-2">•</span>
              <a href='https://www.uv.uio.no/english/' className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors">
                Faculty of Educational Sciences
              </a>
              <span className="mx-2">•</span>
              <a href='https://www.uio.no/english/' className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors">
                University of Oslo
              </a>
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-delay-5">
            <button 
              onClick={() => navigateTo('research-questions')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-2">
                <span className="text-lg">Get Started</span>
                <div className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                  →
                </div>
              </div>
            </button>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-delay-5">
            {[
              { icon: '📚', title: 'Interactive Learning', desc: 'Engage with dynamic content' },
              { icon: '🔬', title: 'Research Focus', desc: 'Applied to educational research' },
              { icon: '📈', title: 'Statistical Foundation', desc: 'Build core statistical skills' }
            ].map((feature, index) => (
              <div key={index} className="group p-0.5 rounded-xl bg-gradient-to-br from-blue-200/50 via-purple-200/50 to-pink-200/50 dark:from-blue-800/50 dark:via-purple-800/50 dark:to-pink-800/50 hover:from-blue-300 hover:to-purple-300 dark:hover:from-blue-700 dark:to-purple-700 transition-all duration-300">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 h-full transition-all duration-300 transform group-hover:scale-[1.02]">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        /* Define CSS variables for the radial gradient and grid color */
        :global(:root) {
          --mouse-x: 50%;
          --mouse-y: 50%;
          --grid-color: rgba(59, 130, 246, 0.05); /* Light blue for light mode */
          --light-gradient: radial-gradient(circle at var(--mouse-x) var(--mouse-y), 
                                   rgba(59, 130, 246, 0.1) 0%, 
                                   rgba(147, 51, 234, 0.05) 25%, 
                                   rgba(16, 185, 129, 0.05) 50%, 
                                   transparent 70%);
          --dark-gradient: radial-gradient(circle at var(--mouse-x) var(--mouse-y), 
                                  rgba(59, 130, 246, 0.15) 0%, 
                                  rgba(147, 51, 234, 0.1) 25%, 
                                  rgba(16, 185, 129, 0.1) 50%, 
                                  transparent 70%);
        }

        :global([data-theme="dark"]) {
          --grid-color: rgba(30, 58, 138, 0.1); /* Darker/muted blue for dark mode */
        }

        .radial-gradient-overlay {
          position: absolute;
          inset: 0;
          transition: background 0.3s ease-out;
          background: var(--light-gradient);
        }

        :global([data-theme="dark"]) .radial-gradient-overlay {
          background: var(--dark-gradient);
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expand {
          from { width: 0; }
          to { width: 8rem; }
        }
        
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-fade-in-delay { animation: fade-in 0.8s ease-out 0.2s forwards; }
        .animate-fade-in-delay-2 { animation: fade-in 0.8s ease-out 0.4s forwards; }
        .animate-fade-in-delay-3 { animation: fade-in 0.8s ease-out 0.6s forwards; }
        .animate-fade-in-delay-4 { animation: fade-in 0.8s ease-out 0.8s forwards; }
        .animate-fade-in-delay-5 { animation: fade-in 0.8s ease-out 1s forwards; }
        .animate-expand { animation: expand 0.8s ease-out 0.4s forwards; }
      `}</style>

    </PageShell>
  );
};

export default HomePage;