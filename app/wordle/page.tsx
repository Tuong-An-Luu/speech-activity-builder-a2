import WordleBuilder from "../../components/WordleBuilder";
import PageTimeTracker from "../../components/PageTimeTracker";

export default function WordlePage() {
  return (
    <section>
      <PageTimeTracker
        pagePath="/wordle"
        activityType="WORDLE"
      />

      <h1>Create a Phoneme Wordle</h1>

      <p>
        Configure one phoneme-based word, preview the
        activity and download it as a standalone HTML file.
      </p>

      <WordleBuilder />
    </section>
  );
}