import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <h1>Phoneme Activity Builder</h1>

      <p>
        Create, preview and download phoneme-based Wordle and Word Search
        classroom activities for Speech Pathology teaching.
      </p>

      <div>
        <h2>Phoneme Wordle</h2>
        <p>Create an activity using one phoneme-based word.</p>
        <Link href="/wordle">Create Wordle</Link>
      </div>

      <div>
        <h2>Phoneme Word Search</h2>
        <p>Create a word search using five phoneme-based words.</p>
        <Link href="/word-search">Create Word Search</Link>
      </div>
    </section>
  );
}