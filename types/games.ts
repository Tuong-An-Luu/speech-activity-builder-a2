export type Difficulty = "easy" | "medium" | "hard";

export type WordleSettings = {
  title: string;
  phonemeWord: string;
  englishWord: string;
  hint: string;
  attempts: number;
  difficulty: Difficulty;
};

export type WordSearchSettings = {
  title: string;
  words: string[];
  phonemeCells: string[];
  difficulty: Difficulty;
};