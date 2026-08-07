import type { WordleSettings } from "../types/games";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function generateWordleHtml(
  settings: WordleSettings,
): string {
  const title = escapeHtml(settings.title);
  const englishWord = escapeHtml(settings.englishWord);
  const hint = escapeHtml(settings.hint);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 24px;
      background: #f4f6f8;
      color: #17202a;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.5;
    }

    main {
      width: min(700px, 100%);
      margin: 0 auto;
      padding: 24px;
      background: white;
      border: 1px solid #c8d0d8;
      border-radius: 12px;
    }

    label {
      display: block;
      margin-top: 18px;
      font-weight: bold;
    }

    input,
    button {
      width: 100%;
      min-height: 44px;
      margin-top: 8px;
      padding: 10px 12px;
      font: inherit;
    }

    button {
      border: 0;
      border-radius: 8px;
      background: #3158a6;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }

    #feedback {
      margin-top: 18px;
      padding: 12px;
      border-left: 4px solid #3158a6;
      background: #eef3ff;
      font-weight: bold;
    }

    .phoneme-display {
      padding: 14px;
      border: 2px solid #52616f;
      border-radius: 8px;
      font-size: 1.5rem;
      text-align: center;
    }
  </style>
</head>

<body>
  <main>
    <h1>${title}</h1>

    <p>Guess the phoneme-based word.</p>

    <p class="phoneme-display" title="${englishWord}">
      Phoneme hint: ${hint}
    </p>

    <p>
      <strong>Difficulty:</strong>
      ${escapeHtml(settings.difficulty)}
    </p>

    <label for="guess">Enter the phoneme word</label>

    <input
      id="guess"
      type="text"
      autocomplete="off"
      aria-describedby="attempts feedback"
    >

    <button id="check-button" type="button">
      Check answer
    </button>

    <p id="attempts">
      Attempts remaining: ${settings.attempts}
    </p>

    <p id="feedback" aria-live="polite">
      Enter an answer to begin.
    </p>
  </main>

  <script>
    const answer = ${JSON.stringify(settings.phonemeWord.trim())};
    const englishWord = ${JSON.stringify(settings.englishWord.trim())};

    let remaining = ${settings.attempts};

    const input = document.getElementById("guess");
    const button = document.getElementById("check-button");
    const attempts = document.getElementById("attempts");
    const feedback = document.getElementById("feedback");

    function finishGame(message) {
      feedback.textContent = message;
      input.disabled = true;
      button.disabled = true;
    }

    button.addEventListener("click", function () {
      const guess = input.value.trim();

      if (!guess) {
        feedback.textContent = "Please enter an answer.";
        return;
      }

      if (guess === answer) {
        finishGame(
          "Correct! The English equivalent is " +
          englishWord +
          "."
        );
        return;
      }

      remaining -= 1;

      attempts.textContent =
        "Attempts remaining: " + Math.max(remaining, 0);

      if (remaining <= 0) {
        finishGame(
          "No attempts remaining. The answer was " +
          answer +
          ", meaning " +
          englishWord +
          "."
        );
      } else {
        feedback.textContent = "Not correct. Try again.";
        input.select();
      }
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        button.click();
      }
    });
  </script>
</body>
</html>`;
}