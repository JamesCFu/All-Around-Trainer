
export enum Category {
  READING = 'Reading Comprehension',
  VOCABULARY = 'Vocabulary',
  GRAMMAR = 'Grammar & Writing',
  MATH = 'Mathematics',
  MOCK = 'Full Mock Test',
  SPELLING = 'Spelling'
}

export interface VocabularyWord {
  word: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
}

export interface RootWord {
  root: string;
  meaning: string;
  examples: string[];
}

export interface GrammarLesson {
  topic: string;
  explanation: string;
  examples: string[];
  quickCheck: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface Question {
  id: string;
  category: Category;
  passage?: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface UserStats {
  completedQuizzes: number;
  averageScore: number; // Historical/Legacy, we will prioritize true accuracy
  categoryScores: Record<Category, number>;
  questionsAnswered: number;
  totalCorrect: number; // Added for true global accuracy
  xp: number;
  wordMastery: Record<string, number>;
  activeSessionWords: VocabularyWord[];
  incorrectQuestions: Question[];
}
