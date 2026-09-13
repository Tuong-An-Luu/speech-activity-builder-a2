"use client";

import { useEffect, useState } from "react";
import PhonemeHint from "./PhonemeHint";
import type { WordleSettings } from "../types/games";
import { downloadHtmlFile } from "../utils/downloadFile";
import { generateWordleHtml } from "../utils/generateWordleHtml";

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

const defaultSettings: WordleSettings = {
  title: "Phoneme Wordle",
  phonemeWord: "/θɪn/",
  englishWord: "thin",
  hint: "TH as in thin",
  attempts: 6,
  difficulty: "easy",
};

export default function WordleBuilder() {
  const [settings, setSettings] =
    useState<WordleSettings>(defaultSettings);

  const [savedWordLists, setSavedWordLists] =
    useState<SavedWordList[]>([]);

  const [selectedWordListId, setSelectedWordListId] =
    useState("");

  const [savedWords, setSavedWords] =
    useState<SavedWord[]>([]);

  const [selectedWordId, setSelectedWordId] =
    useState("");

  const [databaseMessage, setDatabaseMessage] =
    useState("");

  useEffect(() => {
    async function loadWordLists() {
      try {
        const response = await fetch("/api/word-lists");

        if (!response.ok) {
          throw new Error("Unable to load word lists");
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

  async function handleWordListChange(
    wordListId: string,
  ) {
    setSelectedWordListId(wordListId);
    setSelectedWordId("");
    setSavedWords([]);
    setDatabaseMessage("");

    if (!wordListId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/word-lists/${wordListId}`,
      );

      if (!response.ok) {
        throw new Error("Unable to load word list");
      }

      const data: SavedWordList =
        await response.json();

      setSavedWords(data.words || []);

      if (!data.words || data.words.length === 0) {
        setDatabaseMessage(
          "This word list does not contain any saved words.",
        );
      }
    } catch (error) {
      console.error(error);
      setDatabaseMessage(
        "Unable to load saved words.",
      );
    }
  }

  function handleLoadSavedWord() {
    const selectedWord = savedWords.find(
      (word) =>
        word.id === Number(selectedWordId),
    );

    if (!selectedWord) {
      setDatabaseMessage(
        "Please select a saved word.",
      );
      return;
    }

    const phonemeWord =
      "/" +
      [...selectedWord.phonemes]
        .sort(
          (a, b) => a.position - b.position,
        )
        .map((phoneme) => phoneme.symbol)
        .join("") +
      "/";

    setSettings((current) => ({
      ...current,
      phonemeWord,
      englishWord: selectedWord.text,
      hint: selectedWord.hint || "",
    }));

    setDatabaseMessage(
      `"${selectedWord.text}" loaded from the database.`,
    );
  }

  function updateSetting<
    K extends keyof WordleSettings,
  >(
    key: K,
    value: WordleSettings[K],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleGenerate() {
    if (
      !settings.title.trim() ||
      !settings.phonemeWord.trim() ||
      !settings.englishWord.trim()
    ) {
      window.alert(
        "Please enter an activity title, phoneme word and English equivalent.",
      );
      return;
    }

    const html = generateWordleHtml(settings);

    downloadHtmlFile(
      html,
      "phoneme-wordle.html",
    );
  }

  return (
    <div className="builder-layout">
      <section
        className="builder-panel"
        aria-labelledby="wordle-settings-heading"
      >
        <h2 id="wordle-settings-heading">
          Wordle settings
        </h2>

        <fieldset
          style={{
            marginBottom: "24px",
            padding: "16px",
          }}
        >
          <legend>
            Load saved database word
          </legend>

          <label htmlFor="saved-word-list">
            Saved word list
          </label>

          <select
            id="saved-word-list"
            value={selectedWordListId}
            onChange={(event) =>
              handleWordListChange(
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

          <label htmlFor="saved-word">
            Saved word
          </label>

          <select
            id="saved-word"
            value={selectedWordId}
            onChange={(event) =>
              setSelectedWordId(
                event.target.value,
              )
            }
            disabled={!selectedWordListId}
          >
            <option value="">
              Select a word
            </option>

            {savedWords.map((word) => (
              <option
                key={word.id}
                value={word.id}
              >
                {word.text}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="button"
            onClick={handleLoadSavedWord}
            disabled={!selectedWordId}
            style={{ marginTop: "12px" }}
          >
            Load Saved Word
          </button>

          {databaseMessage && (
            <p>{databaseMessage}</p>
          )}
        </fieldset>

        <label htmlFor="wordle-title">
          Activity title
        </label>

        <input
          id="wordle-title"
          type="text"
          value={settings.title}
          onChange={(event) =>
            updateSetting(
              "title",
              event.target.value,
            )
          }
        />

        <label htmlFor="phoneme-word">
          Phoneme word
        </label>

        <input
          id="phoneme-word"
          type="text"
          value={settings.phonemeWord}
          onChange={(event) =>
            updateSetting(
              "phonemeWord",
              event.target.value,
            )
          }
        />

        <label htmlFor="english-word">
          English equivalent
        </label>

        <input
          id="english-word"
          type="text"
          value={settings.englishWord}
          onChange={(event) =>
            updateSetting(
              "englishWord",
              event.target.value,
            )
          }
        />

        <label htmlFor="wordle-hint">
          Phoneme hint
        </label>

        <input
          id="wordle-hint"
          type="text"
          value={settings.hint}
          onChange={(event) =>
            updateSetting(
              "hint",
              event.target.value,
            )
          }
        />

        <label htmlFor="wordle-attempts">
          Number of attempts
        </label>

        <input
          id="wordle-attempts"
          type="number"
          min="1"
          max="10"
          value={settings.attempts}
          onChange={(event) =>
            updateSetting(
              "attempts",
              Number(event.target.value),
            )
          }
        />

        <label htmlFor="wordle-difficulty">
          Difficulty
        </label>

        <select
          id="wordle-difficulty"
          value={settings.difficulty}
          onChange={(event) =>
            updateSetting(
              "difficulty",
              event.target
                .value as WordleSettings["difficulty"],
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

        <button
          type="button"
          className="button"
          onClick={handleGenerate}
        >
          Generate Wordle HTML
        </button>
      </section>

      <section
        className="preview-panel"
        aria-labelledby="wordle-preview-heading"
      >
        <h2 id="wordle-preview-heading">
          Live preview
        </h2>

        <div
          className="wordle-tile-row"
          aria-label="Wordle tile preview"
        >
          {Array.from(
            settings.phonemeWord.replaceAll(
              "/",
              "",
            ),
          ).map(
            (character, index) => (
              <span
                className="wordle-tile"
                key={`${character}-${index}`}
              >
                {character}
              </span>
            ),
          )}
        </div>

        <h3>{settings.title}</h3>

        <p>
          <strong>Phoneme word:</strong>{" "}
          {settings.phonemeWord}
        </p>

        <p>
          <strong>
            English equivalent:
          </strong>{" "}
          {settings.englishWord}
        </p>

        <p>
          <strong>Hint:</strong>{" "}
          {settings.hint}
        </p>

        <p>
          <strong>Difficulty:</strong>{" "}
          {settings.difficulty}
        </p>

        <p>
          <strong>Attempts:</strong>{" "}
          {settings.attempts}
        </p>

        <h3>Example phoneme label</h3>

        <PhonemeHint
          symbol="/θ/"
          letters="TH"
          example="thin"
        />
      </section>
    </div>
  );
}