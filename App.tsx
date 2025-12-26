
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Practice from './components/Practice';
import LearningCenter from './components/LearningCenter';
import ShortNotes from './components/ShortNotes';
import { Category, UserStats, VocabularyWord, Question } from './types';
import { generateVocabulary } from './geminiService';

const INITIAL_STATS: UserStats = {
  completedQuizzes: 0,
  averageScore: 0,
  categoryScores: {
    [Category.READING]: 0,
    [Category.VOCABULARY]: 0,
    [Category.GRAMMAR]: 0,
    [Category.MATH]: 0,
    [Category.MOCK]: 0,
    [Category.SPELLING]: 0,
  },
  questionsAnswered: 0,
  totalCorrect: 0,
  xp: 0,
  wordMastery: {},
  activeSessionWords: [],
  incorrectQuestions: [],
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [isVocabLoading, setIsVocabLoading] = useState(false);

  // Review states
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewAnswer, setReviewAnswer] = useState<number | null>(null);
  const [showReviewResult, setShowReviewResult] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mcvsd-stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats(prev => ({ ...INITIAL_STATS, ...parsed }));
      } catch(e) {
        setStats(INITIAL_STATS);
      }
    }

    const loadAllVocab = async () => {
      setIsVocabLoading(true);
      try {
        const words = await generateVocabulary();
        setAllWords(words);
      } catch (err) {
        console.error("Error loading vocab:", err);
      } finally {
        setIsVocabLoading(false);
      }
    };
    loadAllVocab();
  }, []);

  const saveToLocal = (newStats: UserStats) => {
    localStorage.setItem('mcvsd-stats', JSON.stringify(newStats));
  };

  const awardXP = useCallback((amount: number) => {
    setStats(prev => {
      const next = { ...prev, xp: (prev.xp || 0) + amount };
      saveToLocal(next);
      return next;
    });
  }, []);

  const recordAnswer = useCallback((isCorrect: boolean) => {
    setStats(prev => {
      const next = {
        ...prev,
        questionsAnswered: (prev.questionsAnswered || 0) + 1,
        totalCorrect: (prev.totalCorrect || 0) + (isCorrect ? 1 : 0)
      };
      saveToLocal(next);
      return next;
    });
  }, []);

  const updateWordMastery = useCallback((word: string, increment: number) => {
    setStats(prev => {
      const currentMastery = prev.wordMastery?.[word] || 0;
      const next = {
        ...prev,
        wordMastery: {
          ...(prev.wordMastery || {}),
          [word]: Math.min(100, Math.max(0, currentMastery + increment))
        }
      };
      saveToLocal(next);
      return next;
    });
  }, []);

  const logMistake = useCallback((q: Question) => {
    setStats(prev => {
      const existingIds = new Set(prev.incorrectQuestions.map(iq => iq.id));
      if (existingIds.has(q.id)) return prev;
      const next = {
        ...prev,
        incorrectQuestions: [q, ...prev.incorrectQuestions].slice(0, 100)
      };
      saveToLocal(next);
      return next;
    });
  }, []);

  const handleFinishPractice = (score: number, total: number, mistakes: Question[], category: Category) => {
    setStats(prev => {
      const sessionAccuracy = (score / total) * 100;
      const currentCatScore = prev.categoryScores[category] || 0;
      
      const newCategoryScores = {
        ...prev.categoryScores,
        [category]: currentCatScore === 0 ? Math.round(sessionAccuracy) : Math.round((currentCatScore + sessionAccuracy) / 2)
      };

      const attemptedScores = Object.values(newCategoryScores).filter(s => s > 0);
      const newAverage = attemptedScores.length > 0 ? Math.round(attemptedScores.reduce((a, b) => a + b, 0) / attemptedScores.length) : 0;

      const next = {
        ...prev,
        categoryScores: newCategoryScores,
        averageScore: newAverage,
        completedQuizzes: (prev.completedQuizzes || 0) + 1,
        questionsAnswered: (prev.questionsAnswered || 0) + total,
        totalCorrect: (prev.totalCorrect || 0) + score,
        xp: (prev.xp || 0) + Math.round(sessionAccuracy * 3) + 50
      };
      saveToLocal(next);
      return next;
    });
    setActiveView('dashboard');
  };

  const handleReviewAttempt = (q: Question) => {
    if (reviewAnswer === q.correctAnswer) {
      awardXP(75);
      setStats(prev => {
        const next = {
          ...prev,
          incorrectQuestions: prev.incorrectQuestions.filter(item => item.id !== q.id)
        };
        saveToLocal(next);
        return next;
      });
      setReviewingId(null);
      setReviewAnswer(null);
      setShowReviewResult(false);
    } else {
      setShowReviewResult(true);
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} mistakeCount={stats.incorrectQuestions.length}>
      {activeView === 'dashboard' && (
        <Dashboard stats={stats} onStartPractice={(cat) => setActiveView(cat.toLowerCase().replace(' & ', '').replace(' ', ''))} />
      )}
      
      {activeView === 'learning' && (
        <LearningCenter 
          onAwardXP={awardXP} 
          onUpdateMastery={updateWordMastery}
          onLogMistake={logMistake}
          onRecordAnswer={recordAnswer}
          wordMastery={stats.wordMastery || {}}
          activeSessionWords={stats.activeSessionWords || []}
          setActiveSessionWords={(words) => setStats(prev => ({ ...prev, activeSessionWords: words }))}
          words={allWords}
          isLoading={isVocabLoading}
        />
      )}

      {activeView === 'mistakes' && (
        <div className="max-w-4xl mx-auto animate-in fade-in pb-20">
           <header className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Evaluation Log</h2>
              <p className="text-slate-500 font-medium">Re-evaluate errors. Correct answers remove entries from the registry.</p>
           </header>
           {stats.incorrectQuestions.length > 0 ? (
             <div className="space-y-8">
                {stats.incorrectQuestions.map((q) => (
                  <div key={q.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-md">
                     <div className="text-[10px] font-black uppercase text-rose-500 mb-2 tracking-widest">{q.category}</div>
                     <h4 className="text-xl font-black text-slate-900 mb-6">{q.questionText}</h4>
                     {reviewingId === q.id ? (
                        <div className="space-y-4 animate-in slide-in-from-bottom-4">
                           {q.options.map((opt, i) => (
                             <button key={i} onClick={() => setReviewAnswer(i)} className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all ${reviewAnswer === i ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50 hover:border-indigo-200'}`}>{opt}</button>
                           ))}
                           {showReviewResult && reviewAnswer !== q.correctAnswer && <p className="text-rose-600 font-black text-xs uppercase">Incorrect. Analysis retained.</p>}
                           <div className="flex gap-4 pt-4">
                              <button onClick={() => handleReviewAttempt(q)} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">Confirm Correction</button>
                              <button onClick={() => { setReviewingId(null); setReviewAnswer(null); setShowReviewResult(false); }} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs">Exit</button>
                           </div>
                        </div>
                     ) : (
                        <>
                           <div className="bg-slate-900 text-white p-6 rounded-2xl mb-6">
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Original Diagnosis</p>
                              <p className="text-sm italic font-medium leading-relaxed">{q.explanation}</p>
                           </div>
                           <button onClick={() => setReviewingId(q.id)} className="w-full py-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black uppercase text-xs hover:bg-indigo-600 hover:text-white transition-all">Re-Evaluate</button>
                        </>
                     )}
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-40 bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
               <div className="text-6xl mb-6 opacity-30">🎓</div>
               <p className="text-slate-400 font-bold text-xl uppercase tracking-tighter">Registry Clear.</p>
             </div>
           )}
        </div>
      )}

      {activeView === 'notes' && <ShortNotes />}
      
      {['reading', 'vocab', 'grammar', 'math', 'mock', 'spelling'].includes(activeView) && (
        <Practice 
          category={activeView === 'mock' ? Category.MOCK : activeView === 'reading' ? Category.READING : activeView === 'vocab' ? Category.VOCABULARY : activeView === 'grammar' ? Category.GRAMMAR : activeView === 'math' ? Category.MATH : Category.SPELLING} 
          onFinish={(s, t, m) => handleFinishPractice(s, t, m, activeView === 'mock' ? Category.MOCK : activeView === 'reading' ? Category.READING : activeView === 'vocab' ? Category.VOCABULARY : activeView === 'grammar' ? Category.GRAMMAR : activeView === 'math' ? Category.MATH : Category.SPELLING)}
          onLogMistake={logMistake}
          onExit={() => setActiveView('dashboard')}
        />
      )}
    </div>
  );
};

export default App;
