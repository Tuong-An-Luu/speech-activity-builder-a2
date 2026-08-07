"use client";

import { useState } from "react";
import type {
  Difficulty,
  WordSearchSettings,
} from "../types/games";
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
  "/θ/", "/ɪ/", "/n/", "/f/", "/ŋ/",
  "/ʃ/", "/ɪ/", "/p/", "/θ/", "/n/",
  "/tʃ/", "/eə/", "/f/", "/ɪ/", "/ŋ/",
  "/s/", "/ɪ/", "/ŋ/", "/ʃ/", "/p/",
  "/f/", "/ɪ/", "/ʃ/", "/tʃ/", "/eə/",
];

export default function WordSearchBuilder() {
  const [title, setTitle] =
    useState("Phoneme Word Search");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

  const [selectedIndexes, setSelectedIndexes] =
    useState<number[]>([]);

  const [foundWords, setFoundWords] =
    useState<string[]>([]);

  const [feedback, setFeedback] =
    useState("Select phoneme cells to preview the activity.");

  function handleCellClick(index: number) {
    setSelectedIndexes((current) => {
      if (current.includes(index)) {
        return current.filter(
          (selectedIndex) =>
            selectedIndex !== index,
        );
      }

      return [...current, index];
    });
  }

  function checkSelection() {
    if (selectedIndexes.length === 0) {
      setFeedback(
        "Select some phoneme cells first.",
      );
      return;
    }

    const selectedWord = selectedIndexes
      .map((index) => previewCells[index])
      .join("")
      .replaceAll("/", "");

    const matchedWord = fixedWords.find(
      (word) =>
        word.replaceAll("/", "") === selectedWord,
    );

    if (!matchedWord) {
      setFeedback(
        "That selection is not one of the target words. Try again.",
      );

      setSelectedIndexes([]);
      return;
    }

    if (foundWords.includes(matchedWord)) {
      setFeedback(
        `${matchedWord} has already been found.`,
      );

      setSelectedIndexes([]);
      return;
    }

    const updatedFoundWords = [
      ...foundWords,
      matchedWord,
    ];

    setFoundWords(updatedFoundWords);
    setSelectedIndexes([]);

    if (
      updatedFoundWords.length ===
      fixedWords.length
    ) {
      setFeedback(
        "All phoneme words found. Well done!",
      );
    } else {
      setFeedback(
        `Correct! You found ${matchedWord}. ` +
        `${updatedFoundWords.length} of ${fixedWords.length} words found.`,
      );
    }
  }

  function clearSelection() {
    setSelectedIndexes([]);
    setFeedback("Selection cleared.");
  }

  function handleGenerate() {
    const settings: WordSearchSettings = {
      title,
      words: fixedWords,
      difficulty,
    };

    const html =
      generateWordSearchHtml(settings);

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
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />

        <label htmlFor="word-search-difficulty">
          Difficulty
        </label>

        <select
          id="word-search-difficulty"
          value={difficulty}
          onChange={(event) =>
            setDifficulty(
              event.target.value as Difficulty,
            )
          }
        >
          <option value="easy">
            Easy
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="hard">
            Hard
          </option>
        </select>

        <h3>Fixed phoneme words</h3>

        <ul>
          {fixedWords.map((word) => (
            <li key={word}>
              {word}
            </li>
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
          <p>
            TEST VERSION 2
          </p>
        </h2>

        <h3>{title}</h3>

        <p>
          <strong>Difficulty:</strong>{" "}
          {difficulty}
        </p>

        <p>
          Select the cells that form a word,
          then check your selection.
        </p>

        <div
          className="word-search-grid"
          aria-label="Phoneme Word Search preview"
        >
          {previewCells.map(
            (cell, index) => {
              const selected =
                selectedIndexes.includes(index);

              return (
                <button
                  className={
                    selected
                      ? "word-search-cell selected"
                      : "word-search-cell"
                  }
                  type="button"
                  key={`${cell}-${index}`}
                  aria-pressed={selected}
                  onClick={() =>
                    handleCellClick(index)
                  }
                >
                  {cell}
                </button>
              );
            },
          )}
        </div>

        <p className="selection-preview">
          <strong>
            Current selection:
          </strong>{" "}
          {selectedIndexes.length === 0
            ? "None"
            : selectedIndexes
                .map(
                  (index) =>
                    previewCells[index],
                )
                .join(" ")}
        </p>

        <div className="word-search-controls">
          <button
            type="button"
            className="button"
            onClick={checkSelection}
          >
            Check selection
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={clearSelection}
          >
            Clear selection
          </button>
        </div>

        <h3>Words to find</h3>

        <ul className="preview-word-list">
          {fixedWords.map((word) => (
            <li
              key={word}
              className={
                foundWords.includes(word)
                  ? "found"
                  : ""
              }
            >
              {foundWords.includes(word)
                ? `✓ ${word}`
                : word}
            </li>
          ))}
        </ul>

        <p
          className="word-search-feedback"
          aria-live="polite"
        >
          {feedback}
        </p>
      </section>
    </div>
  );
}