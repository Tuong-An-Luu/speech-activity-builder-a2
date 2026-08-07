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

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >

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
      padding: 30px;
      border: 1px solid #c8d0d8;
      border-radius: 12px;
      background: #ffffff;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin: 24px 0;
    }

    .cell {
      min-height: 58px;
      padding: 8px;
      border: 2px solid #64717f;
      border-radius: 7px;
      background: #ffffff;
      color: #17202a;
      font: inherit;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
    }

    .cell:hover,
    .cell:focus-visible {
      background: #edf2ff;
      border-color: #3158a6;
    }

    .cell.selected {
      background: #dce7ff;
      border-color: #3158a6;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 20px 0;
    }

    .controls button {
      min-height: 44px;
      padding: 10px 16px;
      border: 0;
      border-radius: 8px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    #check-button {
      background: #3158a6;
      color: #ffffff;
    }

    #clear-button {
      border: 1px solid #64717f;
      background: #ffffff;
      color: #17202a;
    }

    .word-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 16px 0;
      padding: 0;
      list-style: none;
    }

    .word {
      padding: 10px 14px;
      border: 1px solid #64717f;
      border-radius: 7px;
      background: #ffffff;
    }

    .word.found {
      background: #dff4df;
      text-decoration: line-through;
    }

    #selection {
      font-weight: 700;
    }

    #feedback {
      min-height: 28px;
      margin-top: 18px;
      font-weight: 700;
    }

    @media (max-width: 520px) {
      body {
        padding: 12px;
      }

      main {
        padding: 20px;
      }

      .grid {
        gap: 5px;
      }

      .cell {
        min-height: 48px;
        padding: 5px;
        font-size: 0.9rem;
      }
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

    <p>
      Select the phoneme cells that form a word, then choose
      <strong>Check selection</strong>.
    </p>

    <div
      class="grid"
      id="grid"
      aria-label="Phoneme word search grid"
    ></div>

    <p>
      Current selection:
      <span id="selection">None</span>
    </p>

    <div class="controls">
      <button id="check-button" type="button">
        Check selection
      </button>

      <button id="clear-button" type="button">
        Clear selection
      </button>
    </div>

    <h2>Words to find</h2>

    <ul
      class="word-list"
      id="word-list"
      aria-label="Words to find"
    ></ul>

    <p id="feedback" aria-live="polite">
      Find all five phoneme words.
    </p>
  </main>

  <script>
    const targetWords = ${JSON.stringify(settings.words)};

    /*
      Each target word has deliberately been placed
      horizontally in one row of the grid.
    */
    const gridRows = [
      ["/θ/", "/ɪ/", "/n/", "/f/", "/ŋ/"],
      ["/ʃ/", "/ɪ/", "/p/", "/θ/", "/n/"],
      ["/tʃ/", "/eə/", "/f/", "/ɪ/", "/ŋ/"],
      ["/s/", "/ɪ/", "/ŋ/", "/ʃ/", "/p/"],
      ["/f/", "/ɪ/", "/ʃ/", "/tʃ/", "/eə/"]
    ];

    const gridCells = gridRows.flat();


    const grid = document.getElementById("grid");
    const wordList = document.getElementById("word-list");
    const selectionDisplay =
      document.getElementById("selection");
    const feedback =
      document.getElementById("feedback");
    const checkButton =
      document.getElementById("check-button");
    const clearButton =
      document.getElementById("clear-button");

    let selectedIndexes = [];
    const foundWords = new Set();

    function updateSelectionDisplay() {
      if (selectedIndexes.length === 0) {
        selectionDisplay.textContent = "None";
        return;
      }

      selectionDisplay.textContent =
        selectedIndexes
          .map(function (index) {
            return gridCells[index];
          })
          .join(" ");
    }

    function clearSelection() {
      selectedIndexes = [];

      document
        .querySelectorAll(".cell.selected")
        .forEach(function (cell) {
          cell.classList.remove("selected");
          cell.setAttribute("aria-pressed", "false");
        });

      updateSelectionDisplay();
    }

    function updateWordList() {
      wordList.innerHTML = "";

      targetWords.forEach(function (word) {
        const item = document.createElement("li");

        item.className =
          foundWords.has(word)
            ? "word found"
            : "word";

        item.textContent =
          foundWords.has(word)
            ? "✓ " + word
            : word;

        wordList.appendChild(item);
      });
    }

    gridCells.forEach(function (phoneme, index) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "cell";
      button.textContent = phoneme;

      button.setAttribute(
        "aria-label",
        "Select phoneme " + phoneme
      );

      button.setAttribute(
        "aria-pressed",
        "false"
      );

      button.addEventListener("click", function () {
        const alreadySelected =
          selectedIndexes.includes(index);

        if (alreadySelected) {
          selectedIndexes =
            selectedIndexes.filter(function (value) {
              return value !== index;
            });

          button.classList.remove("selected");
          button.setAttribute(
            "aria-pressed",
            "false"
          );
        } else {
          selectedIndexes.push(index);

          button.classList.add("selected");
          button.setAttribute(
            "aria-pressed",
            "true"
          );
        }

        updateSelectionDisplay();
      });

      grid.appendChild(button);
    });

    checkButton.addEventListener(
      "click",
      function () {
        if (selectedIndexes.length === 0) {
          feedback.textContent =
            "Select some phoneme cells first.";
          return;
        }

        const selectedWord =
          selectedIndexes
            .map(function (index) {
              return gridCells[index];
            })
            .join("")
            .replaceAll("/", "");

        const matchedWord =
          targetWords.find(function (word) {
            return (
              word.replaceAll("/", "") ===
              selectedWord
            );
          });

        if (!matchedWord) {
          feedback.textContent =
            "That selection is not one of the target words. Try again.";

          clearSelection();
          return;
        }

        if (foundWords.has(matchedWord)) {
          feedback.textContent =
            matchedWord +
            " has already been found.";

          clearSelection();
          return;
        }

        foundWords.add(matchedWord);

        updateWordList();

        if (
          foundWords.size ===
          targetWords.length
        ) {
          feedback.textContent =
            "All phoneme words found. Well done!";
        } else {
          feedback.textContent =
            "Correct! You found " +
            matchedWord +
            ". " +
            foundWords.size +
            " of " +
            targetWords.length +
            " words found.";
        }

        clearSelection();
      },
    );

    clearButton.addEventListener(
      "click",
      function () {
        clearSelection();

        feedback.textContent =
          "Selection cleared.";
      },
    );

    updateWordList();
    updateSelectionDisplay();
  </script>
</body>
</html>`;
}