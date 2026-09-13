"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type WordList = {
  id: number;
  name: string;
};

type Activity = {
  id: number;
  name: string;
  activityType: "WORDLE" | "WORD_SEARCH";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  hintsEnabled: boolean;
  gridSize: number | null;
  timerSeconds: number | null;
  outputName: string | null;
  settingsJson: string | null;
  wordListId: number;
  wordList: {
    id: number;
    name: string;
  };
};

export default function ManageActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [wordLists, setWordLists] = useState<WordList[]>([]);

  const [name, setName] = useState("");
  const [activityType, setActivityType] =
    useState<"WORDLE" | "WORD_SEARCH">("WORDLE");
  const [difficulty, setDifficulty] =
    useState<"EASY" | "MEDIUM" | "HARD">("EASY");

  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [gridSize, setGridSize] = useState("");
  const [timerSeconds, setTimerSeconds] = useState("");
  const [outputName, setOutputName] = useState("");
  const [wordListId, setWordListId] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDifficulty, setEditDifficulty] =
    useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [editHintsEnabled, setEditHintsEnabled] = useState(true);
  const [editGridSize, setEditGridSize] = useState("");
  const [editTimerSeconds, setEditTimerSeconds] = useState("");
  const [editOutputName, setEditOutputName] = useState("");

  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const [activitiesResponse, wordListsResponse] = await Promise.all([
        fetch("/api/activities"),
        fetch("/api/word-lists"),
      ]);

      if (!activitiesResponse.ok || !wordListsResponse.ok) {
        throw new Error("Unable to load saved data");
      }

      const activitiesData = await activitiesResponse.json();
      const wordListsData = await wordListsResponse.json();

      setActivities(activitiesData);
      setWordLists(wordListsData);

      if (!wordListId && wordListsData.length > 0) {
        setWordListId(String(wordListsData[0].id));
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load saved activities.");
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

  async function createActivity(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    const body: Record<string, unknown> = {
      name,
      activityType,
      difficulty,
      hintsEnabled,
      wordListId: Number(wordListId),
    };

    if (gridSize) {
      body.gridSize = Number(gridSize);
    }

    if (timerSeconds) {
      body.timerSeconds = Number(timerSeconds);
    }

    if (outputName.trim()) {
      body.outputName = outputName.trim();
    }

    const response = await fetch("/api/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setMessage(await getErrorMessage(response));
      return;
    }

    setName("");
    setGridSize("");
    setTimerSeconds("");
    setOutputName("");

    setMessage("Activity created successfully.");

    await loadData();
  }

  function startEditing(activity: Activity) {
    setEditingId(activity.id);
    setEditName(activity.name);
    setEditDifficulty(activity.difficulty);
    setEditHintsEnabled(activity.hintsEnabled);
    setEditGridSize(
      activity.gridSize !== null ? String(activity.gridSize) : ""
    );
    setEditTimerSeconds(
      activity.timerSeconds !== null ? String(activity.timerSeconds) : ""
    );
    setEditOutputName(activity.outputName || "");
  }

  function cancelEditing() {
    setEditingId(null);
  }

  async function saveActivity(activityId: number) {
    setMessage("");

    const body: Record<string, unknown> = {
      name: editName,
      difficulty: editDifficulty,
      hintsEnabled: editHintsEnabled,
    };

    if (editGridSize) {
      body.gridSize = Number(editGridSize);
    }

    if (editTimerSeconds) {
      body.timerSeconds = Number(editTimerSeconds);
    }

    if (editOutputName.trim()) {
      body.outputName = editOutputName.trim();
    }

    const response = await fetch(`/api/activities/${activityId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setMessage(await getErrorMessage(response));
      return;
    }

    setEditingId(null);
    setMessage("Activity updated successfully.");

    await loadData();
  }

  async function deleteActivity(activityId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/activities/${activityId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage(await getErrorMessage(response));
      return;
    }

    setMessage("Activity deleted successfully.");

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
      <h1>Manage Activities</h1>

      <p>
        Save and manage Wordle and Word Search activity configurations.
      </p>

      <p>
        <a href="/manage">← Manage Words</a>
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
        <h2>Create Activity</h2>

        <form onSubmit={createActivity}>
          <div style={{ marginBottom: "12px" }}>
            <label>
              Activity name
              <br />
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Initial S Wordle"
                required
              />
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Word list
              <br />
              <select
                value={wordListId}
                onChange={(event) => setWordListId(event.target.value)}
                required
              >
                <option value="">Select a word list</option>

                {wordLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Activity type
              <br />
              <select
                value={activityType}
                onChange={(event) =>
                  setActivityType(
                    event.target.value as "WORDLE" | "WORD_SEARCH"
                  )
                }
              >
                <option value="WORDLE">Wordle</option>
                <option value="WORD_SEARCH">Word Search</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Difficulty
              <br />
              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value as "EASY" | "MEDIUM" | "HARD"
                  )
                }
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              <input
                type="checkbox"
                checked={hintsEnabled}
                onChange={(event) =>
                  setHintsEnabled(event.target.checked)
                }
              />{" "}
              Enable hints
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Grid size
              <br />
              <input
                type="number"
                min="1"
                value={gridSize}
                onChange={(event) => setGridSize(event.target.value)}
                placeholder="Example: 12"
              />
            </label>

            <p style={{ fontSize: "14px" }}>
              Mainly used for Word Search.
            </p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Timer in seconds
              <br />
              <input
                type="number"
                min="1"
                value={timerSeconds}
                onChange={(event) =>
                  setTimerSeconds(event.target.value)
                }
                placeholder="Example: 300"
              />
            </label>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>
              Output filename
              <br />
              <input
                value={outputName}
                onChange={(event) => setOutputName(event.target.value)}
                placeholder="Example: initial-s-wordle.html"
              />
            </label>
          </div>

          <button type="submit">Create Activity</button>
        </form>
      </section>

      <hr style={{ margin: "30px 0" }} />

      <section>
        <h2>Saved Activities</h2>

        {activities.length === 0 && (
          <p>No saved activities yet.</p>
        )}

        {activities.map((activity) => (
          <div
            key={activity.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            {editingId === activity.id ? (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Activity name
                    <br />
                    <input
                      value={editName}
                      onChange={(event) =>
                        setEditName(event.target.value)
                      }
                    />
                  </label>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Difficulty
                    <br />
                    <select
                      value={editDifficulty}
                      onChange={(event) =>
                        setEditDifficulty(
                          event.target.value as
                            | "EASY"
                            | "MEDIUM"
                            | "HARD"
                        )
                      }
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </label>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={editHintsEnabled}
                      onChange={(event) =>
                        setEditHintsEnabled(event.target.checked)
                      }
                    />{" "}
                    Enable hints
                  </label>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Grid size
                    <br />
                    <input
                      type="number"
                      min="1"
                      value={editGridSize}
                      onChange={(event) =>
                        setEditGridSize(event.target.value)
                      }
                    />
                  </label>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Timer in seconds
                    <br />
                    <input
                      type="number"
                      min="1"
                      value={editTimerSeconds}
                      onChange={(event) =>
                        setEditTimerSeconds(event.target.value)
                      }
                    />
                  </label>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    Output filename
                    <br />
                    <input
                      value={editOutputName}
                      onChange={(event) =>
                        setEditOutputName(event.target.value)
                      }
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => saveActivity(activity.id)}
                >
                  Save Changes
                </button>

                {" "}

                <button type="button" onClick={cancelEditing}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3>{activity.name}</h3>

                <p>
                  <strong>Type:</strong>{" "}
                  {activity.activityType === "WORDLE"
                    ? "Wordle"
                    : "Word Search"}
                </p>

                <p>
                  <strong>Word list:</strong>{" "}
                  {activity.wordList.name}
                </p>

                <p>
                  <strong>Difficulty:</strong>{" "}
                  {activity.difficulty}
                </p>

                <p>
                  <strong>Hints:</strong>{" "}
                  {activity.hintsEnabled ? "Enabled" : "Disabled"}
                </p>

                {activity.gridSize && (
                  <p>
                    <strong>Grid size:</strong> {activity.gridSize}
                  </p>
                )}

                {activity.timerSeconds && (
                  <p>
                    <strong>Timer:</strong>{" "}
                    {activity.timerSeconds} seconds
                  </p>
                )}

                {activity.outputName && (
                  <p>
                    <strong>Output:</strong>{" "}
                    {activity.outputName}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => startEditing(activity)}
                >
                  Edit
                </button>

                {" "}

                <button
                  type="button"
                  onClick={() => deleteActivity(activity.id)}
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