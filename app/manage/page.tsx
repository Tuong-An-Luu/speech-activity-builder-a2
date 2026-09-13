"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Phoneme = {
  id: number;
  symbol: string;
  position: number;
  wordId: number;
};

type WordList = {
  id: number;
  name: string;
  description: string | null;
};

type Word = {
  id: number;
  text: string;
  hint: string | null;
  wordListId: number;
  phonemes: Phoneme[];
  wordList: {
    id: number;
    name: string;
  };
};

export default function ManagePage() {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [words, setWords] = useState<Word[]>([]);

  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");

  const [selectedWordListId, setSelectedWordListId] = useState("");
  const [wordText, setWordText] = useState("");
  const [wordHint, setWordHint] = useState("");
  const [phonemesText, setPhonemesText] = useState("");

  const [editingWordId, setEditingWordId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editHint, setEditHint] = useState("");
  const [editPhonemes, setEditPhonemes] = useState("");

  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const [wordListsResponse, wordsResponse] = await Promise.all([
        fetch("/api/word-lists"),
        fetch("/api/words"),
      ]);

      if (!wordListsResponse.ok || !wordsResponse.ok) {
        throw new Error("Unable to load saved data");
      }

      const wordListsData = await wordListsResponse.json();
      const wordsData = await wordsResponse.json();

      setWordLists(wordListsData);
      setWords(wordsData);

      if (!selectedWordListId && wordListsData.length > 0) {
        setSelectedWordListId(String(wordListsData[0].id));
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load saved data.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function getErrorMessage(response: Response) {
    try {
      const data = await response.json();
      return data.error || "Something went wrong.";
    } catch {
      return "Something went wrong.";
    }
  }

  async function createWordList(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/word-lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: listName,
        description: listDescription,
      }),
    });

    if (!response.ok) {
      setMessage(await getErrorMessage(response));
      return;
    }

    const newList = await response.json();

    setListName("");
    setListDescription("");
    setSelectedWordListId(String(newList.id));
    setMessage("Word list created successfully.");

    await loadData();
  }

  async function createWord(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    const phonemes = phonemesText
      .split(",")
      .map((phoneme) => phoneme.trim())
      .filter(Boolean);

    const response = await fetch("/api/words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: wordText,
        hint: wordHint,
        wordListId: Number(selectedWordListId),
        phonemes,
      }),
    });

    if (!response.ok) {
      setMessage(await getErrorMessage(response));
      return;
    }

    setWordText("");
    setWordHint("");
    setPhonemesText("");
    setMessage("Word created successfully.");

    await loadData();
  }

  function startEditing(word: Word) {
    setEditingWordId(word.id);
    setEditText(word.text);
    setEditHint(word.hint || "");
    setEditPhonemes(
      word.phonemes.map((phoneme) => phoneme.symbol).join(", ")
    );
  }

  function cancelEditing() {
    setEditingWordId(null);
    setEditText("");
    setEditHint("");
    setEditPhonemes("");
  }

  async function saveWord(wordId: number) {
    setMessage("");

    const phonemes = editPhonemes
      .split(",")
      .map((phoneme) => phoneme.trim())
      .filter(Boolean);

    const response = await fetch(`/api/words/${wordId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: editText,
        hint: editHint,
        phonemes,
      }),
    });

    if (!response.ok) {
      setMessage(await getErrorMessage(response));
      return;
    }

    cancelEditing();
    setMessage("Word updated successfully.");

    await loadData();
  }

  async function deleteWord(wordId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this word?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const response = await fetch(`/api/words/${wordId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage(await getErrorMessage(response));
      return;
    }

    setMessage("Word deleted successfully.");

    await loadData();
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Manage Saved Content</h1>

      <p>
        <a href="/manage/activities">Manage Activity Settings →</a>
      </p>

      <p>
        Create phoneme-based word lists and manage saved words for Wordle and
        Word Search activities.
      </p>

      {message && (
        <p
          style={{
            padding: "10px",
            border: "1px solid #999",
            marginTop: "20px",
          }}
        >
          {message}
        </p>
      )}

      <hr style={{ margin: "30px 0" }} />

      <section>
        <h2>Create Word List</h2>

        <form onSubmit={createWordList}>
          <div style={{ marginBottom: "12px" }}>
            <label>
              List name
              <br />
              <input
                value={listName}
                onChange={(event) => setListName(event.target.value)}
                placeholder="Example: Initial S Practice"
                required
              />
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Description
              <br />
              <input
                value={listDescription}
                onChange={(event) => setListDescription(event.target.value)}
                placeholder="Optional description"
              />
            </label>
          </div>

          <button type="submit">Create Word List</button>
        </form>
      </section>

      <hr style={{ margin: "30px 0" }} />

      <section>
        <h2>Add Word</h2>

        <form onSubmit={createWord}>
          <div style={{ marginBottom: "12px" }}>
            <label>
              Word list
              <br />
              <select
                value={selectedWordListId}
                onChange={(event) =>
                  setSelectedWordListId(event.target.value)
                }
                required
              >
                <option value="">Select a word list</option>

                {wordLists.map((wordList) => (
                  <option key={wordList.id} value={wordList.id}>
                    {wordList.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Word
              <br />
              <input
                value={wordText}
                onChange={(event) => setWordText(event.target.value)}
                placeholder="Example: sun"
                required
              />
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Hint
              <br />
              <input
                type="text"
                value={wordHint}
                onChange={(event) => setWordHint(event.target.value)}
                placeholder="Example: Something seen in the sky"
                style={{ width: "420px", maxWidth: "100%" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Phonemes
              <br />
              <input
                value={phonemesText}
                onChange={(event) => setPhonemesText(event.target.value)}
                placeholder="Example: s, ʌ, n"
                required
              />
            </label>

            <p style={{ fontSize: "14px" }}>
              Separate each phoneme with a comma. Multi-character phonemes such
              as əʊ are supported.
            </p>
          </div>

          <button type="submit">Add Word</button>
        </form>
      </section>

      <hr style={{ margin: "30px 0" }} />

      <section>
        <h2>Saved Words</h2>

        {words.length === 0 && <p>No saved words yet.</p>}

        {words.map((word) => (
          <div
            key={word.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            {editingWordId === word.id ? (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Word
                    <br />
                    <input
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                    />
                  </label>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Hint
                    <br />
                    <input
                      value={editHint}
                      onChange={(event) => setEditHint(event.target.value)}
                    />
                  </label>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Phonemes
                    <br />
                    <input
                      value={editPhonemes}
                      onChange={(event) =>
                        setEditPhonemes(event.target.value)
                      }
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => saveWord(word.id)}
                >
                  Save Changes
                </button>

                {" "}

                <button
                  type="button"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3>{word.text}</h3>

                <p>
                  <strong>Word list:</strong> {word.wordList.name}
                </p>

                <p>
                  <strong>Hint:</strong> {word.hint || "No hint"}
                </p>

                <p>
                  <strong>Phonemes:</strong>{" "}
                  {word.phonemes
                    .map((phoneme) => phoneme.symbol)
                    .join(" / ")}
                </p>

                <button
                  type="button"
                  onClick={() => startEditing(word)}
                >
                  Edit
                </button>

                {" "}

                <button
                  type="button"
                  onClick={() => deleteWord(word.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}