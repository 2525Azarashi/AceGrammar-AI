
import React from 'react';
import { GrammarCategory, Difficulty, AppState } from '../types';

interface SidebarProps {
  currentCategory: GrammarCategory;
  onCategoryChange: (c: GrammarCategory) => void;
  currentDifficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onGenerate: () => void;
  isLoading: boolean;
  appState: AppState;
}

const CATEGORIES: GrammarCategory[] = [
  '時制', '助動詞', '受動態', '不定詞', '動名詞', 
  '分詞', '関係詞', '仮定法', '比較', '接続詞', '前置詞'
];

const DIFFICULTIES: Difficulty[] = ['基礎', '標準', '難関', '最難関'];

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onCategoryChange,
  currentDifficulty,
  onDifficultyChange,
  onGenerate,
  isLoading,
  appState
}) => {
  return (
    <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-auto md:h-screen sticky top-0 z-10">
      <div className="p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">文法項目</h3>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              disabled={isLoading}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentCategory === cat 
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <i className={`fas fa-check-circle mr-2 opacity-0 transition-opacity ${currentCategory === cat ? 'opacity-100' : ''}`}></i>
              {cat}
            </button>
          ))}
        </div>

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-8 mb-4">難易度レベル</h3>
        <div className="flex flex-wrap md:flex-col gap-2">
          {DIFFICULTIES.map(diff => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              disabled={isLoading}
              className={`flex-1 md:flex-none text-center md:text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentDifficulty === diff 
                ? 'bg-amber-50 text-amber-700 border border-amber-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <i className={`fas fa-star mr-2 ${currentDifficulty === diff ? 'text-amber-500' : 'text-slate-300'}`}></i>
              {diff}
            </button>
          ))}
        </div>

        <div className="mt-10 md:mt-20">
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isLoading 
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                生成中...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                新規問題を作成
              </>
            )}
          </button>
          {appState === AppState.READY && (
            <p className="text-center text-xs text-slate-400 mt-4">
              設定を変更して再度作成できます
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
