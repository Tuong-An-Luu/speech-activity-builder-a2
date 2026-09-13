import WordSearchBuilder from "../../components/WordSearchBuilder";

export default function WordSearchPage() {
  return (
    <section>
      <h1>Create a Phoneme Word Search</h1>

      <p>
        Load a saved phoneme word list, preview the activity and download it as a standalone HTML file.
      </p>

      <WordSearchBuilder />
    </section>
  );
}