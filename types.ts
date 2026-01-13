
export type GrammarCategory = 
  | '時制' 
  | '助動詞' 
  | '受動態' 
  | '不定詞' 
  | '動名詞' 
  | '分詞' 
  | '関係詞' 
  | '仮定法' 
  | '比較' 
  | '接続詞' 
  | '前置詞';

export type Difficulty = '基礎' | '標準' | '難関' | '最難関';

export interface AnalysisCriterion {
  score: number; // 0 to 100
  comment: string;
}

export interface QuestionAnalysis {
  academicLevel: AnalysisCriterion;
  logicalConsistency: AnalysisCriterion;
  uniquenessOfAnswer: AnalysisCriterion;
  validityOfSolution: AnalysisCriterion;
  educationalValue: AnalysisCriterion;
  naturalness: AnalysisCriterion;
  formatAppropriateness: AnalysisCriterion;
  timeAppropriateness: AnalysisCriterion;
  aiErrorDetection: AnalysisCriterion;
  overallRating: '良問' | '標準問' | '要改善';
}

export interface GrammarQuestion {
  id: string;
  category: GrammarCategory;
  difficulty: Difficulty;
  questionText: string;
  choices: string[];
  correctIndex: number;
  translation: string;
  explanation: string;
  analysis: QuestionAnalysis;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING_DRAFT = 'GENERATING_DRAFT',
  ANALYZING_AND_IMPROVING = 'ANALYZING_AND_IMPROVING',
  READY = 'READY',
  ERROR = 'ERROR'
}
