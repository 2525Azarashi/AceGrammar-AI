
import React, { useState, useCallback } from 'react';
import { 
  GrammarCategory, 
  Difficulty, 
  GrammarQuestion, 
  AppState 
} from './types';
import { generateAndAnalyzeQuestion } from './geminiService';
import { LoadingScreen } from './components/LoadingScreen';
import { QuestionCard } from './components/QuestionCard';
import { Sidebar } from './components/Sidebar';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [category, setCategory] = useState<GrammarCategory>('関係詞');
  const [difficulty, setDifficulty] = useState<Difficulty>('標準');
  const [currentQuestion, setCurrentQuestion] = useState<GrammarQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setError(null);
      setAppState(AppState.GENERATING_DRAFT);
      
      // Artificial delay for generating draft
      await new Promise(r => setTimeout(r, 1500));
      
      setAppState(AppState.ANALYZING_AND_IMPROVING);
      const question = await generateAndAnalyzeQuestion(category, difficulty);
      
      setCurrentQuestion(question);
      setAppState(AppState.READY);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '予期せぬエラーが発生しました。');
      setAppState(AppState.ERROR);
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setCurrentQuestion(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar for Mobile & Desktop */}
      <Sidebar 
        currentCategory={category} 
        onCategoryChange={setCategory}
        currentDifficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onGenerate={handleGenerate}
        isLoading={appState === AppState.GENERATING_DRAFT || appState === AppState.ANALYZING_AND_IMPROVING}
        appState={appState}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 bg-indigo-600 text-white rounded-lg">
              <i className="fas fa-graduation-cap"></i>
            </span>
            AceGrammar AI
            <span className="text-sm font-normal text-slate-500 bg-slate-200 px-2 py-1 rounded">Beta v1.0</span>
          </h1>
          <p className="text-slate-600 mt-2">大学受験レベルの英文法「良問」をAIが厳選・分析して生成します。</p>
        </header>

        <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
          {appState === AppState.IDLE && (
            <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                <i className="fas fa-magic"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">問題作成を始めましょう</h2>
              <p className="text-slate-500 mb-8">
                サイドメニューから項目と難易度を選び、ボタンを押してください。AIがあなたのレベルに最適な問題を生成します。
              </p>
              <button 
                onClick={handleGenerate}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-200"
              >
                問題を生成する
              </button>
            </div>
          )}

          {(appState === AppState.GENERATING_DRAFT || appState === AppState.ANALYZING_AND_IMPROVING) && (
            <LoadingScreen state={appState} />
          )}

          {appState === AppState.READY && currentQuestion && (
            <QuestionCard question={currentQuestion} onReset={reset} />
          )}

          {appState === AppState.ERROR && (
            <div className="text-center p-8 bg-red-50 border border-red-100 rounded-2xl max-w-md">
              <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
              <h2 className="text-xl font-bold text-red-800 mb-2">エラーが発生しました</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={handleGenerate}
                className="py-2 px-6 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
              >
                再試行する
              </button>
            </div>
          )}
        </div>

        <footer className="mt-12 py-6 border-t border-slate-200 text-center text-slate-400 text-sm">
          &copy; 2024 AceGrammar AI - Specialized for Japanese University Entrance Exams
        </footer>
      </main>
    </div>
  );
};

export default App;
