export type Phoneme = {
  symbol: string;
  letters: string;
  example: string;
};

export const phonemes: Phoneme[] = [
  {
    symbol: "/θ/",
    letters: "TH",
    example: "thin",
  },
  {
    symbol: "/ʃ/",
    letters: "SH",
    example: "ship",
  },
  {
    symbol: "/tʃ/",
    letters: "CH",
    example: "chair",
  },
  {
    symbol: "/ŋ/",
    letters: "NG",
    example: "sing",
  },
  {
    symbol: "/f/",
    letters: "F",
    example: "fish",
  },
];