
import { GoogleGenAI, Type } from "@google/genai";
import { GrammarCategory, Difficulty, GrammarQuestion } from "./types";

export async function generateAndAnalyzeQuestion(
  category: GrammarCategory,
  difficulty: Difficulty
): Promise<GrammarQuestion> {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("API Key must be set when running in a browser. APIキーが正しく選択されていません。");
  }

  // Create a new instance right before use to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-pro-preview';

  const systemInstruction = `
あなたは大学受験英語の最高峰のスペシャリスト（河合塾・駿台レベルの予備校講師）です。
ユーザーから指定された「文法項目」と「難易度」に基づき、大学入試の4択英文法問題を作成し、さらにそれを自ら9つの観点で批判的に分析・改善して最終回答を出力してください。

【9つの分析・改善基準】
1. 学力レベルの適切性（偏差値帯に合致しているか）
2. 論理的一貫性（文脈が破綻していないか）
3. 解答の一意性（正解が一つだけであり、誤答が明確に誤りか）
4. 解法の妥当性（標準的な受験解法で解けるか）
5. 受験問題としての価値（本質的な理解を問う「良問」か）
6. 自然さ（英語として不自然な語彙選択がないか）
7. 出題形式の適切さ（選択肢のバランスは良いか）
8. 解答時間の妥当性（重すぎず、軽すぎないか）
9. AI特有のエラー検出（途中で設定が変わる、存在しない単語など）

【最終出力形式】
必ず指定されたJSONスキーマに従って返してください。
「分析」の結果、もし初期案に不備があれば自動的に修正・洗練した後の「最終的な問題」を出力に含めてください。
`;

  const prompt = `以下の条件で大学入試レベルの英文法問題を作成し、分析レポートを添えて出力してください。
項目: ${category}
難易度: ${difficulty} (基礎: 偏差値45-50, 標準: 50-60, 難関: 60-70, 最難関: 70+)
`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questionText: { type: Type.STRING, description: "問題文（空欄は ____ で表現）" },
            choices: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4,
              description: "4つの選択肢" 
            },
            correctIndex: { type: Type.INTEGER, description: "正解のインデックス(0-3)" },
            translation: { type: Type.STRING, description: "問題文の和訳" },
            explanation: { type: Type.STRING, description: "詳しい解説" },
            analysis: {
              type: Type.OBJECT,
              properties: {
                academicLevel: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                logicalConsistency: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                uniquenessOfAnswer: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                validityOfSolution: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                educationalValue: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                naturalness: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                formatAppropriateness: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                timeAppropriateness: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                aiErrorDetection: { 
                  type: Type.OBJECT, 
                  properties: { score: { type: Type.INTEGER }, comment: { type: Type.STRING } },
                  required: ["score", "comment"]
                },
                overallRating: { type: Type.STRING, enum: ["良問", "標準問", "要改善"] }
              },
              required: [
                "academicLevel", "logicalConsistency", "uniquenessOfAnswer", 
                "validityOfSolution", "educationalValue", "naturalness", 
                "formatAppropriateness", "timeAppropriateness", "aiErrorDetection", "overallRating"
              ]
            }
          },
          required: ["id", "category", "difficulty", "questionText", "choices", "correctIndex", "translation", "explanation", "analysis"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as GrammarQuestion;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // ガイドラインに従い、特定のプロジェクトエラーをApp.tsxで拾えるようにエラーを投げる
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("Requested entity was not found. 有料プロジェクトのAPIキーを再度選択してください。");
    }
    throw error;
  }
}
