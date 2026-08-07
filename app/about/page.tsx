export default function AboutPage() {
  return (
    <section className="content-page">
      <h1>About the project</h1>

      <p>
        The Phoneme Activity Builder helps teachers prepare browser-based
        activities for Speech Pathology students. Teachers can configure an
        activity, preview it and download it as a standalone HTML file.
      </p>

      <h2>Assessment 1 scope</h2>

      <p>
        Assessment 1 focuses on frontend design, usability, accessibility,
        responsive layout and HTML generation. It does not use a database or
        dynamically managed word list.
      </p>

      <h2>Phoneme Wordle</h2>

      <p>
        The Wordle tool uses one phoneme-based word. It provides a hint,
        limited attempts and feedback that displays the English equivalent.
      </p>

      <h2>Phoneme Word Search</h2>

      <p>
        The Word Search tool uses approximately five fixed phoneme words and
        creates a downloadable classroom activity.
      </p>

      <h2>Student details</h2>

      <p>
        <strong>Name:</strong> Your Name
      </p>

      <p>
        <strong>Student number:</strong> Your Student Number
      </p>

      <h2>How to use the website</h2>

      <video className="instruction-video" controls preload="metadata">
        <source src="/how-to-use.mp4" type="video/mp4" />
        Your browser does not support embedded video.
      </video>
    </section>
  );
}