import React, { useState, useEffect } from 'react';
import { getModelComparison } from '../api/wineApi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function ComparisonDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const responseData = await getModelComparison();
        
        // Ensure data is valid
        if (!responseData || Object.keys(responseData).length === 0) {
          throw new Error('Received empty comparison data');
        }

        const metrics = ['accuracy', 'precision', 'recall', 'f1-score'];
        const formattedChartData = metrics.map(metric => {
          const displayMetricName = metric === 'f1-score' ? 'F1-Score' : metric.charAt(0).toUpperCase() + metric.slice(1);
          const entry = { name: displayMetricName };
          
          Object.keys(responseData).forEach(modelName => {
            const rawVal = responseData[modelName][metric] || responseData[modelName][metric.replace('-', '_')] || 0;
            entry[modelName] = parseFloat(rawVal);
          });
          return entry;
        });
        
        setData({ original: responseData, chart: formattedChartData });
      } catch (err) {
        setError(err.message || 'Failed to fetch model comparison data. Please ensure the backend is running and the models have been evaluated.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComparison();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-10 rounded-3xl bg-white/5 dark:bg-black/30 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col items-center justify-center min-h-[500px]">
        <svg className="animate-spin h-14 w-14 text-violet-500 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-violet-300 font-medium text-lg animate-pulse tracking-wide">Loading model comparison data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-10 rounded-3xl bg-white/5 dark:bg-black/30 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col items-center justify-center min-h-[500px]">
        <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-200 flex flex-col items-center max-w-lg text-center backdrop-blur-md">
          <svg className="w-16 h-16 mb-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          <h3 className="font-bold text-2xl text-red-300 mb-2">Error Loading Data</h3>
          <p className="text-base text-red-200/80">{error}</p>
        </div>
      </div>
    );
  }

  const modelNames = Object.keys(data.original);
  
  // Format model names for display (e.g. grid_search -> Grid Search)
  const formatModelName = (name) => {
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-10 rounded-3xl bg-white/5 dark:bg-black/30 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] text-white">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
          Model Performance Comparison
        </h2>
        <p className="text-gray-300 mt-4 text-lg font-light">
          Evaluating Artificial Neural Network architectures across different hyperparameter tuning strategies.
        </p>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-10 mb-10 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[80px] pointer-events-none"></div>
        
        <h3 className="text-xl font-semibold mb-8 text-violet-200 flex items-center">
          <svg className="w-5 h-5 mr-3 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Metrics Chart
        </h3>
        <div className="h-[450px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.chart}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff80" tick={{ fill: '#ffffff80', fontSize: 14 }} axisLine={{ stroke: '#ffffff30' }} tickLine={false} dy={10} />
              <YAxis domain={[0, 1]} stroke="#ffffff80" tick={{ fill: '#ffffff80', fontSize: 14 }} axisLine={{ stroke: '#ffffff30' }} tickLine={false} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#ffffff0a' }}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(139,92,246,0.3)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(10px)', padding: '12px 16px' }}
                itemStyle={{ color: '#fff', padding: '4px 0', fontSize: '14px', fontWeight: '500' }}
                formatter={(value) => [(value * 100).toFixed(2) + '%', null]}
              />
              <Legend wrapperStyle={{ paddingTop: '30px' }} iconType="circle" />
              {modelNames.includes('baseline') && <Bar dataKey="baseline" name="Baseline" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={40} />}
              {modelNames.includes('grid_search') && <Bar dataKey="grid_search" name="Grid Search" fill="#c084fc" radius={[6, 6, 0, 0]} barSize={40} />}
              {modelNames.includes('random_search') && <Bar dataKey="random_search" name="Random Search" fill="#f472b6" radius={[6, 6, 0, 0]} barSize={40} />}
              {modelNames.filter(m => !['baseline', 'grid_search', 'random_search'].includes(m)).map((model, idx) => (
                <Bar key={model} dataKey={model} name={formatModelName(model)} fill={`hsl(${idx * 40 + 200}, 70%, 60%)`} radius={[6, 6, 0, 0]} barSize={40} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-3xl p-6 md:p-10 shadow-inner overflow-hidden">
        <h3 className="text-xl font-semibold mb-6 text-violet-200 flex items-center">
          <svg className="w-5 h-5 mr-3 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
          Summary Details
        </h3>
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="py-5 px-6 text-violet-200 font-semibold uppercase text-xs tracking-widest border-b border-white/10">Model Variant</th>
                <th className="py-5 px-6 text-gray-300 font-semibold uppercase text-xs tracking-widest border-b border-white/10 text-right">Accuracy</th>
                <th className="py-5 px-6 text-gray-300 font-semibold uppercase text-xs tracking-widest border-b border-white/10 text-right">Precision</th>
                <th className="py-5 px-6 text-gray-300 font-semibold uppercase text-xs tracking-widest border-b border-white/10 text-right">Recall</th>
                <th className="py-5 px-6 text-fuchsia-300 font-semibold uppercase text-xs tracking-widest border-b border-white/10 text-right">F1-Score</th>
              </tr>
            </thead>
            <tbody>
              {modelNames.map((model, idx) => {
                const metrics = data.original[model];
                const accuracy = metrics.accuracy || metrics.Accuracy;
                const precision = metrics.precision || metrics.Precision;
                const recall = metrics.recall || metrics.Recall;
                const f1 = metrics['f1-score'] || metrics.f1_score || metrics['F1-Score'];
                
                return (
                  <tr key={model} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6 font-medium text-violet-300 group-hover:text-violet-200 transition-colors">
                      {formatModelName(model)}
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-right font-mono text-sm">{(parseFloat(accuracy) * 100).toFixed(2)}%</td>
                    <td className="py-4 px-6 text-gray-300 text-right font-mono text-sm">{(parseFloat(precision) * 100).toFixed(2)}%</td>
                    <td className="py-4 px-6 text-gray-300 text-right font-mono text-sm">{(parseFloat(recall) * 100).toFixed(2)}%</td>
                    <td className="py-4 px-6 font-semibold text-fuchsia-300 text-right font-mono text-sm">{(parseFloat(f1) * 100).toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
