import React, { useState, useEffect } from 'react';

const DEFAULT_CATEGORIES = [
  { id: 'health', name: 'Health & Vitality', desc: 'Physical energy, sleep, nutrition, and movement.' },
  { id: 'mind', name: 'Mental & Emotional Well-being', desc: 'Stress management, mindfulness, and emotional regulation.' },
  { id: 'career', name: 'Career & Purpose', desc: 'Professional growth, meaningful work, and alignment.' },
  { id: 'finances', name: 'Finances & Security', desc: 'Financial stability, budgeting, and resource management.' },
  { id: 'relationships', name: 'Relationships & Community', desc: 'Connection with family, friends, and support networks.' },
  { id: 'growth', name: 'Personal Growth & Learning', desc: 'Skill acquisition, self-reflection, and curiosity.' },
  { id: 'environment', name: 'Environment & Lifestyle', desc: 'Living space, organization, and daily surroundings.' },
  { id: 'recreation', name: 'Rest & Recreation', desc: 'Play, downtime, hobbies, and rejuvenation.' }
];

export default function App() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('evolve_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('evolve_scores');
    return saved ? JSON.parse(saved) : {};
  });

  const [journal, setJournal] = useState(() => {
    const saved = localStorage.getItem('evolve_journal');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState('assessment');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  useEffect(() => {
    localStorage.setItem('evolve_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('evolve_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('evolve_journal', JSON.stringify(journal));
  }, [journal]);

  const handleScoreChange = (catId, field, value) => {
    setScores(prev => ({
      ...prev,
      [catId]: {
        satisfaction: field === 'satisfaction' ? parseInt(value) : (prev[catId]?.satisfaction || 5),
        effort: field === 'effort' ? parseInt(value) : (prev[catId]?.effort || 5)
      }
    }));
  };

  const handleJournalChange = (catId, text) => {
    setJournal(prev => ({ ...prev, [catId]: text }));
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newId = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    setCategories(prev => [...prev, { id: newId, name: newCatName, desc: newCatDesc || 'Custom area of focus.' }]);
    setNewCatName('');
    setNewCatDesc('');
    setIsAdding(false);
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    const newScores = { ...scores };
    delete newScores[id];
    setScores(newScores);
  };

  const generateAIFeedback = async () => {
    setAiLoading(true);
    setAiFeedback('');
    
    // Simulate thoughtful holistic AI coaching synthesis
    setTimeout(() => {
      let analysisText = "### 🌿 Evolve Optimal Holistic Synthesis\n\n";
      const entries = categories.map(c => ({
        name: c.name,
        sat: scores[c.id]?.satisfaction || 5,
        eff: scores[c.id]?.effort || 5,
        note: journal[c.id] || ''
      }));

      const neglected = entries.filter(e => e.sat < 5 || (e.eff < 4 && e.sat < 6));
      const highEffortLowSat = entries.filter(e => e.eff >= 7 && e.sat <= 5);
      const balanced = entries.filter(e => e.sat >= 7 && e.eff >= 6);

      if (highEffortLowSat.length > 0) {
        analysisText += `⚠️ **Potential Friction Point:** You are pouring high energy into **${highEffortLowSat.map(e => e.name).join(', ')}**, but satisfaction remains low. Consider re-evaluating the approach or boundaries here rather than simply pushing harder.\n\n`;
      }
      if (neglected.length > 0) {
        analysisText += `🌱 **Opportunity for Nourishment:** Areas like **${neglected.map(e => e.name).join(', ')}** are asking for gentle attention. What is one micro-habit (5 minutes a day) you could introduce this week?\n\n`;
      }
      if (balanced.length > 0) {
        analysisText += `✨ **Anchor Points:** Your alignment is strongest in **${balanced.map(e => e.name).join(', ')}**. Lean into these strengths as a foundation for growth.\n\n`;
      }

      analysisText += `> *"True balance isn't a static destination; it's a continuous, compassionate practice of noticing where you are and choosing your next step with awareness."*\n`;
      
      setAiFeedback(analysisText);
      setAiLoading(false);
    }, 1200);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm tracking-widest uppercase mb-1">
              <span>Evolve Optimal</span>
              <span>•</span>
              <span>Holistic Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Life Balance & Reflection Tool</h1>
            <p className="text-slate-400 text-sm mt-1">Evaluate fulfillment, map your attention gaps, and design grounded next steps.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={exportPDF} 
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition shadow-sm"
            >
              📥 Export Report
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          <button 
            onClick={() => setActiveTab('assessment')}
            className={`flex-1 py-3 text-sm font-medium rounded-xl transition ${activeTab === 'assessment' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            📊 Wheel & Sliders
          </button>
          <button 
            onClick={() => setActiveTab('reflections')}
            className={`flex-1 py-3 text-sm font-medium rounded-xl transition ${activeTab === 'reflections' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow' : 'text-slate-400 hover:text-white'}`}
          >
            📝 Journal & AI Insights
          </button>
        </div>

        {/* Tab 1: Assessment */}
        {activeTab === 'assessment' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
              <div>
                <h2 className="font-semibold text-white">Life Domains Assessment</h2>
                <p className="text-xs text-slate-400">Rate your **Satisfaction** (fulfillment) and **Effort** (attention given) from 1 to 10.</p>
              </div>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition"
              >
                {isAdding ? 'Cancel' : '+ Add Domain'}
              </button>
            </div>

            {isAdding && (
              <form onSubmit={addCategory} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-semibold text-emerald-400">Create Custom Determinant / Domain</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Domain Name (e.g., Creative Expression)" 
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Short description or focus" 
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition">
                  Save Custom Domain
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const sat = scores[cat.id]?.satisfaction || 5;
                const eff = scores[cat.id]?.effort || 5;
                const diff = sat - eff;
                
                let statusBadge = <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Balanced</span>;
                if (sat >= 7 && eff >= 7) statusBadge = <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Thriving</span>;
                else if (eff >= 7 && sat <= 4) statusBadge = <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">Burnout Risk</span>;
                else if (eff <= 3 && sat <= 4) statusBadge = <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Neglected</span>;

                return (
                  <div key={cat.id} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white text-base">{cat.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{cat.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusBadge}
                        {categories.length > 3 && (
                          <button onClick={() => deleteCategory(cat.id)} className="text-slate-600 hover:text-rose-400 text-xs px-1.5 py-0.5 rounded transition">×</button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Satisfaction (Fulfillment)</span>
                          <span className="font-bold text-emerald-400">{sat} / 10</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" value={sat} 
                          onChange={(e) => handleScoreChange(cat.id, 'satisfaction', e.target.value)}
                          className="w-full accent-emerald-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Dedicated Effort / Attention</span>
                          <span className="font-bold text-cyan-400">{eff} / 10</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" value={eff} 
                          onChange={(e) => handleScoreChange(cat.id, 'effort', e.target.value)}
                          className="w-full accent-cyan-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Reflections & AI */}
        {activeTab === 'reflections' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-semibold text-white text-lg">AI Holistic Synthesis & Next Steps</h2>
                  <p className="text-xs text-slate-400">Generate grounded insights based on your ratings and journal reflections.</p>
                </div>
                <button 
                  onClick={generateAIFeedback}
                  disabled={aiLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
                >
                  {aiLoading ? 'Synthesizing Insights...' : '✨ Generate AI Reflection'}
                </button>
              </div>

              {aiFeedback && (
                <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-5 text-sm text-slate-300 space-y-3 leading-relaxed whitespace-pre-line animate-fade-in">
                  {aiFeedback}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white text-base">Domain Reflection Journals</h3>
              <p className="text-xs text-slate-400">Capture your raw thoughts, barriers, or intentions for key areas.</p>
              
              <div className="grid grid-cols-1 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-white text-sm">{cat.name}</h4>
                      <span className="text-xs text-slate-500">Satisfaction: {scores[cat.id]?.satisfaction || 5}/10</span>
                    </div>
                    <textarea 
                      placeholder={`What is working or feeling stuck in ${cat.name.toLowerCase()}? What is one small step you want to take?`}
                      value={journal[cat.id] || ''}
                      onChange={(e) => handleJournalChange(cat.id, e.target.value)}
                      rows="2"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-y"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 pt-6 border-t border-slate-900">
          Evolve Optimal • Designed for Root-Cause Growth & Sustainable Resilience
        </footer>

      </div>
    </div>
  );
}
