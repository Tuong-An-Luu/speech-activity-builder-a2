"use client";

import { useState } from "react";
import PhonemeHint from "./PhonemeHint";
import type { WordleSettings } from "../types/games";
import { downloadHtmlFile } from "../utils/downloadFile";
import { generateWordleHtml } from "../utils/generateWordleHtml";

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

  function updateSetting<K extends keyof WordleSettings>(
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

        <label htmlFor="wordle-title">
          Activity title
        </label>

        <input
          id="wordle-title"
          type="text"
          value={settings.title}
          onChange={(event) =>
            updateSetting("title", event.target.value)
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
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
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
            settings.phonemeWord.replaceAll("/", ""),
          ).map((character, index) => (
            <span
              className="wordle-tile"
              key={`${character}-${index}`}
            >
              {character}
            </span>
          ))}
        </div>

        <h3>{settings.title}</h3>

        <p>
          <strong>Phoneme word:</strong>{" "}
          {settings.phonemeWord}
        </p>

        <p>
          <strong>English equivalent:</strong>{" "}
          {settings.englishWord}
        </p>

        <p>
          <strong>Hint:</strong> {settings.hint}
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