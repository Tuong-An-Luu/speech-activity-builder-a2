import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <div className="hero">
        <p className="eyebrow">Speech Pathology teaching tool</p>

        <h1>Create phoneme-based classroom activities</h1>

        <p>
          Configure, preview and download standalone Wordle and Word Search
          activities for use in a normal web browser.
        </p>
      </div>

      <div className="home-card-grid">
        <article className="home-card">
          <h2>Phoneme Wordle</h2>

          <p>
            Create a guessing activity using one phoneme word, hints, feedback
            and an English equivalent.
          </p>

          <Link className="button home-link" href="/wordle">
            Create a Wordle
          </Link>
        </article>

        <article className="home-card">
          <h2>Phoneme Word Search</h2>

          <p>
            Create a classroom activity using phoneme-based words.
          </p>

          <Link className="button home-link" href="/word-search">
            Create a Word Search
          </Link>
        </article>
      </div>
    </section>
  );
}
