import React, { useState } from 'react';
import PredictionForm from './components/PredictionForm';
import ComparisonDashboard from './components/ComparisonDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('predict');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans selection:bg-fuchsia-500/30 overflow-x-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <header className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-white/5 border border-white/10 rounded-full text-violet-300 backdrop-blur-md">
              Machine Learning Showcase
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
            Wine Quality Predictor
          </h1>
          <p className="text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
            Artificial Neural Network + Hyperparameter Tuning
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <button
              onClick={() => setActiveTab('predict')}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'predict'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                <span>Predict Quality</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'compare'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                <span>Compare Models</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="transition-all duration-500 ease-in-out">
          {activeTab === 'predict' ? (
            <div className="animate-in zoom-in-95 fade-in duration-500">
              <PredictionForm />
            </div>
          ) : (
            <div className="animate-in zoom-in-95 fade-in duration-500">
              <ComparisonDashboard />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm border-t border-white/5 pt-8">
          <p>© {new Date().getFullYear()} Wine Quality Predictor. Built by neeraj214.</p>
        </footer>
        
      </div>
    </div>
  );
}

export default App;
