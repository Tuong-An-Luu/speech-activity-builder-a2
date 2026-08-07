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
            ),
          )}
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