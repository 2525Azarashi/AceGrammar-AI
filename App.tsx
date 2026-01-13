
import React, { useState, useEffect } from 'react';
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

// Fix: Use the existing AIStudio type to avoid conflicts with global declarations
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Correcting the modifier and type to match the expected global AIStudio definition
    readonly aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [category, setCategory] = useState<GrammarCategory>('関係詞');
  const [difficulty, setDifficulty] = useState<Difficulty>('標準');
  const [currentQuestion, setCurrentQuestion] = useState<GrammarQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const isSelected = await window.aistudio.hasSelectedApiKey();
        setHasKey(isSelected);
      } else {
        // 開発環境などでヘルパーがない場合は、環境変数が既にあると仮定
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        await window.aistudio.openSelectKey();
        // ガイドラインに従い、呼び出し後は成功したとみなして進む
        setHasKey(true);
      } catch (e) {
        console.error("Key selection failed", e);
      }
    }
  };

  const handleGenerate = async () => {
    try {
      // 生成前に再度キーの有無を確認
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const isSelected = await window.aistudio.hasSelectedApiKey();
        if (!isSelected) {
          await handleSelectKey();
          // キー選択ダイアログを閉じた後、process.env.API_KEYがセットされるのを待つ必要はない(ガイドラインより)
        }
      }

      setError(null);
      setAppState(AppState.GENERATING_DRAFT);
      
      // ドラフト生成の演出
      await new Promise(r => setTimeout(r, 1000));
      
      setAppState(AppState.ANALYZING_AND_IMPROVING);
      const question = await generateAndAnalyzeQuestion(category, difficulty);
      
      setCurrentQuestion(question);
      setAppState(AppState.READY);
    } catch (err: any) {
      console.error("Generation error:", err);
      const errorMessage = err.message || "";
      
      if (errorMessage.includes("Requested entity was not found") || errorMessage.includes("API key not found")) {
        setHasKey(false);
        setError("APIキーまたはプロジェクトが見つかりません。有料プロジェクトのAPIキーを再度選択してください。");
      } else if (errorMessage.includes("API Key must be set")) {
        setHasKey(false);
        setError("APIキーが設定されていません。再度選択してください。");
      } else {
        setError(errorMessage || '問題の生成中に予期せぬエラーが発生しました。');
      }
      setAppState(AppState.ERROR);
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setCurrentQuestion(null);
    setError(null);
  };

  // 初期チェック中は何もしない
  if (hasKey === null) return null;

  // キーが未選択の場合
  if (!hasKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg rotate-3">
             <i className="fas fa-key text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">APIキーの選択</h1>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm">
            Gemini 3 Proを使用するため、APIキーの選択が必要です。<br/>
            有料プロジェクト（Billing設定済み）のキーを選択してください。
            <br />
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs mt-4 inline-block font-medium">
              請求設定についてはこちら <i className="fas fa-external-link-alt ml-1"></i>
            </a>
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg shadow-indigo-100 active:scale-95"
          >
            APIキーを選択して開始
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar 
        currentCategory={category} 
        onCategoryChange={setCategory}
        currentDifficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onGenerate={handleGenerate}
        isLoading={appState === AppState.GENERATING_DRAFT || appState === AppState.ANALYZING_AND_IMPROVING}
        appState={appState}
      />

      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 bg-indigo-600 text-white rounded-lg">
              <i className="fas fa-graduation-cap"></i>
            </span>
            AceGrammar AI
            <span className="text-sm font-normal text-slate-500 bg-slate-200 px-2 py-1 rounded">Pro</span>
          </h1>
          <p className="text-slate-600 mt-2">大学受験英語の「良問」をAIが厳選・分析して生成します。</p>
        </header>

        <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
          {appState === AppState.IDLE && (
            <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                <i className="fas fa-magic"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">問題作成を始めましょう</h2>
              <p className="text-slate-500 mb-8">
                項目と難易度を選び、ボタンを押してください。AIが9つの基準で問題を校正し、解説付きで提供します。
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
            <div className="text-center p-10 bg-white border border-red-100 rounded-3xl max-w-md shadow-xl shadow-red-50">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">生成エラー</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">{error}</p>
              <div className="space-y-3">
                <button 
                  onClick={handleGenerate}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  再試行
                </button>
                <button 
                  onClick={handleSelectKey}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition text-sm"
                >
                  APIキーを再選択
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-12 py-6 border-t border-slate-200 text-center text-slate-400 text-xs">
          Powered by Gemini 3 Pro - AceGrammar AI for Entrance Exams
        </footer>
      </main>
    </div>
  );
};

export default App;
