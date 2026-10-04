import WordSearchBuilder from "../../components/WordSearchBuilder";
import PageTimeTracker from "../../components/PageTimeTracker";

export default function WordSearchPage() {
  return (
    <section>
      <PageTimeTracker
        pagePath="/word-search"
        activityType="WORD_SEARCH"
      />

      <h1>Create a Phoneme Word Search</h1>

      <p>
        Configure a phoneme-based word search, preview the
        activity and download it as a standalone HTML file.
      </p>

      <WordSearchBuilder />
    </section>
  );
}