import WordSearchBuilder from "../../components/WordSearchBuilder";

export default function WordSearchPage() {
  return (
    <section>
      <h1>Create a Phoneme Word Search</h1>

      <p>
        Preview a phoneme-based Word Search using five fixed words and
        download it as a standalone HTML file.
      </p>

      <WordSearchBuilder />
    </section>
  );
}