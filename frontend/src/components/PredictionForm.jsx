import React, { useState } from 'react';
import { predictWineQuality } from '../api/wineApi';

const FEATURES = [
  { name: 'fixed acidity', label: 'Fixed Acidity', min: 3, max: 16, step: 0.1, placeholder: '7.4' },
  { name: 'volatile acidity', label: 'Volatile Acidity', min: 0.08, max: 1.6, step: 0.01, placeholder: '0.70' },
  { name: 'citric acid', label: 'Citric Acid', min: 0, max: 1, step: 0.01, placeholder: '0.00' },
  { name: 'residual sugar', label: 'Residual Sugar', min: 0.6, max: 66, step: 0.1, placeholder: '1.9' },
  { name: 'chlorides', label: 'Chlorides', min: 0.009, max: 0.6, step: 0.001, placeholder: '0.076' },
  { name: 'free sulfur dioxide', label: 'Free Sulfur Dioxide', min: 1, max: 289, step: 1, placeholder: '11' },
  { name: 'total sulfur dioxide', label: 'Total Sulfur Dioxide', min: 6, max: 440, step: 1, placeholder: '34' },
  { name: 'density', label: 'Density', min: 0.98, max: 1.04, step: 0.0001, placeholder: '0.9978' },
  { name: 'pH', label: 'pH', min: 2.7, max: 4.0, step: 0.01, placeholder: '3.51' },
  { name: 'sulphates', label: 'Sulphates', min: 0.2, max: 2.0, step: 0.01, placeholder: '0.56' },
  { name: 'alcohol', label: 'Alcohol', min: 8, max: 15, step: 0.1, placeholder: '9.4' }
];

export default function PredictionForm() {
  const [formData, setFormData] = useState(
    FEATURES.reduce((acc, feat) => ({ ...acc, [feat.name]: '' }), {})
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert string inputs to numbers
      const numericData = {};
      for (const key in formData) {
        numericData[key] = parseFloat(formData[key]);
        if (isNaN(numericData[key])) {
          throw new Error(`Invalid numeric value for ${key}`);
        }
      }
      
      const res = await predictWineQuality(numericData);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to predict wine quality. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 rounded-3xl bg-white/5 dark:bg-black/30 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] text-white">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
          Wine Quality Predictor
        </h2>
        <p className="text-gray-300 mt-3 text-lg font-light">
          Enter the physicochemical properties of the wine to predict its quality score.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
          {FEATURES.map((feat) => (
            <div key={feat.name} className="flex flex-col space-y-2 relative group">
              <label htmlFor={feat.name} className="text-sm font-semibold text-gray-300 ml-1 group-hover:text-violet-300 transition-colors">
                {feat.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id={feat.name}
                  name={feat.name}
                  value={formData[feat.name]}
                  onChange={handleChange}
                  min={feat.min}
                  max={feat.max}
                  step={feat.step}
                  placeholder={feat.placeholder}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20 transition-all duration-300 shadow-inner"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center space-x-3 mx-auto"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing Properties...</span>
              </>
            ) : (
              <span>Predict Quality</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-8 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-200 backdrop-blur-md flex items-start animate-in fade-in slide-in-from-bottom-4">
          <svg className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          <div>
            <h4 className="font-semibold text-red-300">Prediction Failed</h4>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="mt-10 p-8 bg-black/40 border border-violet-500/30 rounded-3xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-violet-500/20 blur-[60px] pointer-events-none"></div>
          
          <h3 className="text-2xl font-bold mb-8 text-center text-white/90 relative z-10">Analysis Results</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12 relative z-10">
            <div className="flex flex-col items-center">
              <span className="text-violet-200/70 uppercase tracking-wider text-xs font-bold mb-3">Predicted Quality</span>
              <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-[0_0_40px_rgba(139,92,246,0.6)] border-4 border-white/10">
                <span className="text-6xl font-black text-white drop-shadow-md">{result.prediction ?? '-'}</span>
              </div>
            </div>
            
            {result.confidence !== undefined && (
              <div className="flex flex-col items-center">
                <span className="text-violet-200/70 uppercase tracking-wider text-xs font-bold mb-3">Confidence</span>
                <div className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">
                  {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>

          {result.probabilities && (
            <div className="space-y-4 max-w-2xl mx-auto relative z-10 bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider text-center">Class Probabilities</h4>
              {Object.entries(result.probabilities).sort((a, b) => Number(a[0]) - Number(b[0])).map(([quality, prob]) => {
                const percentage = (prob * 100).toFixed(1);
                // Highlight the predicted class
                const isPredicted = String(result.prediction) === String(quality);
                
                return (
                  <div key={quality} className={`flex items-center text-sm ${isPredicted ? 'text-white' : 'text-gray-400'}`}>
                    <span className="w-20 font-medium">Score {quality}</span>
                    <div className="flex-1 ml-4 mr-4 h-3 bg-black/60 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${isPredicted ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : 'bg-white/20'}`}
                        style={{ width: `${percentage}%` }}
                      >
                        {isPredicted && (
                          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <span className={`w-16 text-right font-medium ${isPredicted ? 'text-fuchsia-300' : 'text-gray-500'}`}>{percentage}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
