
import React, { useState } from 'react';
import { GrammarQuestion } from '../types';

interface QuestionCardProps {
  question: GrammarQuestion;
  onReset: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onReset }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleChoiceClick = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setShowExplanation(true);
  };

  const isCorrect = selectedIdx === question.correctIndex;

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header with Badges */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-tight">
              {question.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
              question.difficulty === '最難関' ? 'bg-red-100 text-red-700' :
              question.difficulty === '難関' ? 'bg-orange-100 text-orange-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              難易度: {question.difficulty}
            </span>
          </div>
          <span className="text-slate-400 text-[10px] font-mono">ID: {question.id}</span>
        </div>

        {/* Question Text */}
        <div className="p-8 md:p-12">
          <p className="text-xl md:text-2xl font-serif text-slate-800 leading-relaxed mb-8">
            {question.questionText}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.choices.map((choice, idx) => {
              let btnClass = "text-left px-6 py-4 rounded-xl border-2 font-medium transition-all duration-200 ";
              
              if (selectedIdx === null) {
                btnClass += "text-slate-700 border-slate-100 hover:border-indigo-400 hover:bg-indigo-50 active:bg-indigo-100";
              } else {
                if (idx === question.correctIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-700 ring-4 ring-green-100 z-10";
                } else if (idx === selectedIdx) {
                  btnClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                  btnClass += "border-slate-50 text-slate-300 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleChoiceClick(idx)}
                  disabled={selectedIdx !== null}
                  className={btnClass}
                >
                  <span className="inline-block w-8 font-bold opacity-50">({idx + 1})</span>
                  {choice}
                  {selectedIdx !== null && idx === question.correctIndex && (
                    <i className="fas fa-check-circle float-right mt-1"></i>
                  )}
                  {selectedIdx === idx && idx !== question.correctIndex && (
                    <i className="fas fa-times-circle float-right mt-1"></i>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Area */}
        {showExplanation && (
          <div className={`p-8 animate-in slide-in-from-top duration-500 ${isCorrect ? 'bg-green-50' : 'bg-red-50'} border-t border-slate-100`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                <i className={`fas ${isCorrect ? 'fa-check' : 'fa-times'}`}></i>
              </span>
              <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '正解です！' : '残念、不正解です'}
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/80 p-5 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">日本訳</h4>
                <p className="text-slate-800 text-lg leading-relaxed">{question.translation}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">詳しい解説</h4>
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {question.explanation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Report Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-4 text-left">
            <div className={`p-3 rounded-lg ${
              question.analysis.overallRating === '良問' ? 'bg-emerald-50 text-emerald-600' :
              question.analysis.overallRating === '標準問' ? 'bg-blue-50 text-blue-600' :
              'bg-amber-50 text-amber-600'
            }`}>
              <i className="fas fa-microscope text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">AI良問判定・分析レポート</h3>
              <p className="text-xs text-slate-400">作成した問題が受験に相応しいか9つの観点で精査しました</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className={`px-4 py-1.5 rounded-full text-xs font-black ${
               question.analysis.overallRating === '良問' ? 'bg-emerald-500 text-white' :
               question.analysis.overallRating === '標準問' ? 'bg-blue-500 text-white' :
               'bg-amber-500 text-white'
             }`}>
               判定: {question.analysis.overallRating}
             </span>
             <i className={`fas fa-chevron-${showAnalysis ? 'up' : 'down'} text-slate-300`}></i>
          </div>
        </button>

        {showAnalysis && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnalysisScoreItem label="1. 学力レベル" data={question.analysis.academicLevel} icon="fa-chart-line" color="blue" />
              <AnalysisScoreItem label="2. 論理的一貫性" data={question.analysis.logicalConsistency} icon="fa-link" color="green" />
              <AnalysisScoreItem label="3. 解答の一意性" data={question.analysis.uniquenessOfAnswer} icon="fa-bullseye" color="orange" />
              <AnalysisScoreItem label="4. 解法の妥当性" data={question.analysis.validityOfSolution} icon="fa-book-open" color="red" />
              <AnalysisScoreItem label="5. 受験的価値" data={question.analysis.educationalValue} icon="fa-award" color="purple" />
              <AnalysisScoreItem label="6. 英語の自然さ" data={question.analysis.naturalness} icon="fa-comment-alt" color="brown" />
              <AnalysisScoreItem label="7. 出題形式" data={question.analysis.formatAppropriateness} icon="fa-list-ol" color="yellow" />
              <AnalysisScoreItem label="8. 解答時間" data={question.analysis.timeAppropriateness} icon="fa-clock" color="indigo" />
              <AnalysisScoreItem label="9. AIエラー検証" data={question.analysis.aiErrorDetection} icon="fa-shield-virus" color="emerald" />
            </div>

            <div className="mt-10 p-6 bg-white rounded-xl border border-indigo-100 border-l-4 border-l-indigo-600">
              <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i className="fas fa-trophy text-amber-500"></i>
                最終的な「良問」判定の評価
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                 <div className="flex gap-2">
                   <i className="fas fa-check text-green-500"></i>
                   <span><strong>① 正しく解ける:</strong> 整合性・一意性を担保</span>
                 </div>
                 <div className="flex gap-2">
                   <i className="fas fa-check text-green-500"></i>
                   <span><strong>② 理解を測れる:</strong> 教育的価値が高い</span>
                 </div>
                 <div className="flex gap-2">
                   <i className="fas fa-check text-green-500"></i>
                   <span><strong>③ 入試形式合致:</strong> 実用的な難易度設計</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pb-12">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
        >
          <i className="fas fa-redo"></i>
          新しい設定で作り直す
        </button>
      </div>
    </div>
  );
};

interface AnalysisScoreItemProps {
  label: string;
  data: { score: number; comment: string };
  icon: string;
  color: string;
}

const AnalysisScoreItem: React.FC<AnalysisScoreItemProps> = ({ label, data, icon, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    brown: 'text-stone-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600'
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className={`fas ${icon} ${colorMap[color] || 'text-slate-600'}`}></i>
          <span className="text-xs font-bold text-slate-800">{label}</span>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400">{data.score}/100</span>
      </div>
      <div className="w-full h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
        <div 
          className={`h-full bg-current ${colorMap[color] || 'text-slate-600'}`} 
          style={{ width: `${data.score}%` }}
        ></div>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed flex-1">{data.comment}</p>
    </div>
  );
};
