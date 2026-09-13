"use client";

import { useEffect, useState } from "react";
import type {
  Difficulty,
  WordSearchSettings,
} from "../types/games";
import { downloadHtmlFile } from "../utils/downloadFile";
import { generateWordSearchHtml } from "../utils/generateWordSearchHtml";

type SavedPhoneme = {
  id: number;
  symbol: string;
  position: number;
  wordId: number;
};

type SavedWord = {
  id: number;
  text: string;
  hint: string | null;
  wordListId: number;
  phonemes: SavedPhoneme[];
};

type SavedWordList = {
  id: number;
  name: string;
  description: string | null;
  words?: SavedWord[];
};

const defaultWords = [
  "/θɪn/",
  "/ʃɪp/",
  "/tʃeə/",
  "/sɪŋ/",
  "/fɪʃ/",
];

const defaultPreviewCells = [
  "/θ/",
  "/ɪ/",
  "/n/",
  "/f/",
  "/ŋ/",
  "/ʃ/",
  "/ɪ/",
  "/p/",
  "/θ/",
  "/n/",
  "/tʃ/",
  "/eə/",
  "/f/",
  "/ɪ/",
  "/ŋ/",
  "/s/",
  "/ɪ/",
  "/ŋ/",
  "/ʃ/",
  "/p/",
  "/f/",
  "/ɪ/",
  "/ʃ/",
  "/tʃ/",
  "/eə/",
];

export default function WordSearchBuilder() {
  const [title, setTitle] =
    useState("Phoneme Word Search");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

  const [words, setWords] =
    useState<string[]>(defaultWords);

  const [previewCells, setPreviewCells] =
    useState<string[]>(defaultPreviewCells);

  const [selectedIndexes, setSelectedIndexes] =
    useState<number[]>([]);

  const [foundWords, setFoundWords] =
    useState<string[]>([]);

  const [feedback, setFeedback] = useState(
    "Select phoneme cells to preview the activity.",
  );

  const [savedWordLists, setSavedWordLists] =
    useState<SavedWordList[]>([]);

  const [selectedWordListId, setSelectedWordListId] =
    useState("");

  const [databaseMessage, setDatabaseMessage] =
    useState("");

  useEffect(() => {
    async function loadWordLists() {
      try {
        const response = await fetch(
          "/api/word-lists",
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load word lists",
          );
        }

        const data = await response.json();

        setSavedWordLists(data);
      } catch (error) {
        console.error(error);
        setDatabaseMessage(
          "Unable to load saved word lists.",
        );
      }
    }

    loadWordLists();
  }, []);

  async function handleLoadSavedList() {
    if (!selectedWordListId) {
      setDatabaseMessage(
        "Please select a saved word list.",
      );
      return;
    }

    try {
      const response = await fetch(
        `/api/word-lists/${selectedWordListId}`,
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load saved word list",
        );
      }

      const data: SavedWordList =
        await response.json();

      if (!data.words || data.words.length === 0) {
        setDatabaseMessage(
          "This word list does not contain any saved words.",
        );
        return;
      }

      const loadedWords = data.words.map(
        (word) => {
          const sortedPhonemes = [
            ...word.phonemes,
          ].sort(
            (a, b) =>
              a.position - b.position,
          );

          return (
            "/" +
            sortedPhonemes
              .map(
                (phoneme) =>
                  phoneme.symbol,
              )
              .join("") +
            "/"
          );
        },
      );

      const loadedCells = data.words.flatMap(
        (word) =>
          [...word.phonemes]
            .sort(
              (a, b) =>
                a.position - b.position,
            )
            .map(
              (phoneme) =>
                `/${phoneme.symbol}/`,
            ),
      );

      setWords(loadedWords);
      setPreviewCells(loadedCells);

      setSelectedIndexes([]);
      setFoundWords([]);

      setFeedback(
        "Select phoneme cells to preview the activity.",
      );

      setDatabaseMessage(
        `${data.name} loaded from the database.`,
      );
    } catch (error) {
      console.error(error);

      setDatabaseMessage(
        "Unable to load saved word list.",
      );
    }
  }

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
      .map(
        (index) =>
          previewCells[index],
      )
      .join("")
      .replaceAll("/", "");

    const matchedWord = words.find(
      (word) =>
        word.replaceAll("/", "") ===
        selectedWord,
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
      words.length
    ) {
      setFeedback(
        "All phoneme words found. Well done!",
      );
    } else {
      setFeedback(
        `Correct! You found ${matchedWord}. ` +
          `${updatedFoundWords.length} of ${words.length} words found.`,
      );
    }
  }

  function clearSelection() {
    setSelectedIndexes([]);

    setFeedback(
      "Selection cleared.",
    );
  }

  function handleGenerate() {
    if (!title.trim()) {
      window.alert(
        "Please enter an activity title.",
      );
      return;
    }

    if (words.length === 0) {
      window.alert(
        "Please load or provide at least one word.",
      );
      return;
    }

    const settings: WordSearchSettings = {
      title,
      words,
      phonemeCells: previewCells,
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

        <fieldset
          style={{
            marginBottom: "24px",
            padding: "16px",
          }}
        >
          <legend>
            Load saved database word list
          </legend>

          <label htmlFor="saved-word-list">
            Saved word list
          </label>

          <select
            id="saved-word-list"
            value={selectedWordListId}
            onChange={(event) =>
              setSelectedWordListId(
                event.target.value,
              )
            }
          >
            <option value="">
              Select a word list
            </option>

            {savedWordLists.map(
              (wordList) => (
                <option
                  key={wordList.id}
                  value={wordList.id}
                >
                  {wordList.name}
                </option>
              ),
            )}
          </select>

          <button
            type="button"
            className="button"
            onClick={handleLoadSavedList}
            disabled={!selectedWordListId}
            style={{
              marginTop: "12px",
            }}
          >
            Load Saved List
          </button>

          {databaseMessage && (
            <p>{databaseMessage}</p>
          )}
        </fieldset>

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
              event.target
                .value as Difficulty,
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

        <h3>Phoneme words</h3>

        <ul>
          {words.map(
            (word, index) => (
              <li
                key={`${word}-${index}`}
              >
                {word}
              </li>
            ),
          )}
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
          <strong>
            Difficulty:
          </strong>{" "}
          {difficulty}
        </p>

        <p>
          Select the cells that form a
          word, then check your selection.
        </p>

        <div
          className="word-search-grid"
          aria-label="Phoneme Word Search preview"
        >
          {previewCells.map(
            (cell, index) => {
              const selected =
                selectedIndexes.includes(
                  index,
                );

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
          {words.map(
            (word, index) => (
              <li
                key={`${word}-${index}`}
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
            ),
          )}
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