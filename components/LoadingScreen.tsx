
import React from 'react';
import { AppState } from '../types';

interface LoadingScreenProps {
  state: AppState;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ state }) => {
  const steps = [
    { 
      label: 'ドラフト問題の生成', 
      desc: '文脈と文法ポイントの構築中...', 
      active: state === AppState.GENERATING_DRAFT,
      done: state === AppState.ANALYZING_AND_IMPROVING
    },
    { 
      label: '9項目の厳格な品質分析', 
      desc: '論理・難易度・自然さをチェック...', 
      active: state === AppState.ANALYZING_AND_IMPROVING,
      done: false 
    },
    { 
      label: '最終的な洗練と校正', 
      desc: '「良問」としての最終調整...', 
      active: false,
      done: false 
    },
  ];

  return (
    <div className="w-full max-w-lg p-12 flex flex-col items-center">
      <div className="relative mb-12">
        {/* Animated outer ring */}
        <div className="absolute inset-0 scale-150 opacity-20 bg-indigo-200 rounded-full animate-ping"></div>
        <div className="relative w-24 h-24 flex items-center justify-center bg-white border-4 border-indigo-600 rounded-full shadow-xl">
          <i className="fas fa-brain text-4xl text-indigo-600 animate-pulse"></i>
        </div>
      </div>

      <div className="w-full space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className={`flex items-start gap-4 transition-all duration-500 ${step.active || step.done ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`mt-1 flex items-center justify-center w-6 h-6 rounded-full border-2 ${
              step.done ? 'bg-green-500 border-green-500 text-white' : 
              step.active ? 'border-indigo-600 border-t-transparent animate-spin' : 
              'border-slate-300'
            }`}>
              {step.done && <i className="fas fa-check text-[10px]"></i>}
            </div>
            <div>
              <h4 className={`text-sm font-bold ${step.active ? 'text-indigo-600' : step.done ? 'text-green-600' : 'text-slate-400'}`}>
                {step.label}
              </h4>
              <p className="text-xs text-slate-400">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center italic text-slate-400 text-sm">
        "良い問題は、思考の深さを測る鏡です"
      </div>
    </div>
  );
};
