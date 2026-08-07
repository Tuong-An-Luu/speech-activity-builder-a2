import type { WordSearchSettings } from "../types/games";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function generateWordSearchHtml(
  settings: WordSearchSettings,
): string {
  const title = escapeHtml(settings.title);
  const words = settings.words.map(escapeHtml);

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
      width: min(760px, 100%);
      margin: 0 auto;
      padding: 24px;
      background: white;
      border: 1px solid #c8d0d8;
      border-radius: 12px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin: 24px 0;
    }

    .cell {
      min-height: 56px;
      border: 2px solid #64717f;
      border-radius: 6px;
      background: white;
      color: #17202a;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
    }

    .cell.selected {
      background: #dce7ff;
      border-color: #3158a6;
    }

    .word-list button {
      margin: 6px;
      padding: 10px 14px;
      border: 1px solid #64717f;
      border-radius: 6px;
      background: white;
      cursor: pointer;
    }

    .word-list button.found {
      text-decoration: line-through;
      background: #dff4df;
    }

    #feedback {
      margin-top: 18px;
      font-weight: bold;
    }
  </style>
</head>

<body>
  <main>
    <h1>${title}</h1>

    <p>
      Difficulty:
      <strong>${escapeHtml(settings.difficulty)}</strong>
    </p>

    <p>Select phoneme cells, then mark words as found.</p>

    <div class="grid" id="grid"></div>

    <h2>Words to find</h2>

    <div class="word-list" id="word-list"></div>

    <p id="feedback" aria-live="polite">
      No words found yet.
    </p>
  </main>

  <script>
    const words = ${JSON.stringify(settings.words)};
    const cells = [
      "/θ/", "/ɪ/", "/n/", "/ʃ/", "/ɪ/",
      "/p/", "/tʃ/", "/eə/", "/f/", "/ɪ/",
      "/ʃ/", "/ŋ/", "/θ/", "/ɪ/", "/n/",
      "/s/", "/ɪ/", "/ŋ/", "/f/", "/ɪ/",
      "/ʃ/", "/tʃ/", "/eə/", "/p/", "/ŋ/"
    ];

    const grid = document.getElementById("grid");
    const wordList = document.getElementById("word-list");
    const feedback = document.getElementById("feedback");

    let foundCount = 0;

    cells.forEach(function (cellText) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.textContent = cellText;

      button.addEventListener("click", function () {
        button.classList.toggle("selected");
      });

      grid.appendChild(button);
    });

    words.forEach(function (word) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = word;

      button.addEventListener("click", function () {
        if (button.classList.contains("found")) {
          return;
        }

        button.classList.add("found");
        button.disabled = true;
        foundCount += 1;

        feedback.textContent =
          "Words found: " + foundCount + " of " + words.length;

        if (foundCount === words.length) {
          feedback.textContent = "All phoneme words found. Well done!";
        }
      });

      wordList.appendChild(button);
    });
  </script>
</body>
</html>`;
}