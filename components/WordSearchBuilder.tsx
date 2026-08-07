"use client";

import { useState } from "react";
import type { Difficulty, WordSearchSettings } from "../types/games";
import { downloadHtmlFile } from "../utils/downloadFile";
import { generateWordSearchHtml } from "../utils/generateWordSearchHtml";

const fixedWords = [
  "/θɪn/",
  "/ʃɪp/",
  "/tʃeə/",
  "/sɪŋ/",
  "/fɪʃ/",
];

const previewCells = [
  "/θ/", "/ɪ/", "/n/", "/ʃ/", "/ɪ/",
  "/p/", "/tʃ/", "/eə/", "/f/", "/ɪ/",
  "/ʃ/", "/ŋ/", "/θ/", "/ɪ/", "/n/",
  "/s/", "/ɪ/", "/ŋ/", "/f/", "/ɪ/",
  "/ʃ/", "/tʃ/", "/eə/", "/p/", "/ŋ/",
];

export default function WordSearchBuilder() {
  const [title, setTitle] = useState("Phoneme Word Search");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

  function handleGenerate() {
    const settings: WordSearchSettings = {
      title,
      words: fixedWords,
      difficulty,
    };

    const html = generateWordSearchHtml(settings);

    downloadHtmlFile(
      html,
      "phoneme-word-search.html",
    );
  }

  return (
    <div className="builder-layout">
      <section
        className="builder-panel"
        aria-labelledby="word-search-settings"
      >
        <h2 id="word-search-settings">
          Word Search settings
        </h2>

        <label htmlFor="word-search-title">
          Activity title
        </label>

        <input
          id="word-search-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="word-search-difficulty">
          Difficulty
        </label>

        <select
          id="word-search-difficulty"
          value={difficulty}
          onChange={(event) =>
            setDifficulty(event.target.value as Difficulty)
          }
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <h3>Fixed phoneme words</h3>

        <ul>
          {fixedWords.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>

        <button
          type="button"
          className="button"
          onClick={handleGenerate}
        >
          Generate Word Search HTML
        </button>
      </section>

      <section
        className="preview-panel"
        aria-labelledby="word-search-preview"
      >
        <h2 id="word-search-preview">
          Live preview
        </h2>

        <h3>{title}</h3>

        <p>
          <strong>Difficulty:</strong> {difficulty}
        </p>

        <div
          className="word-search-grid"
          aria-label="Phoneme Word Search preview"
        >
          {previewCells.map((cell, index) => (
            <button
              className="word-search-cell"
              type="button"
              key={`${cell}-${index}`}
              title={`Phoneme ${cell}`}
            >
              {cell}
            </button>
          ))}
        </div>

        <h3>Words to find</h3>

        <ul>
          {fixedWords.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}