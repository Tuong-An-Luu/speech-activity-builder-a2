export default function AboutPage() {
  return (
    <section className="content-page">
      <h1>About the project</h1>

      <p>
        The Phoneme Activity Builder helps teachers create browser-based
        learning activities for Speech Pathology students.
      </p>

      <h2>Assessment 1 scope</h2>

      <p>
        This assessment focuses on frontend design, usability, accessibility,
        responsive layout and standalone HTML generation. It does not use a
        database or dynamically managed word list.
      </p>

      <h2>Phoneme Wordle</h2>

      <p>
        The Wordle tool creates a guessing activity using one phoneme-based
        word, a hint, limited attempts and an English equivalent.
      </p>

      <h2>Phoneme Word Search</h2>

      <p>
        The Word Search tool creates an activity using five fixed
        phoneme-based words.
      </p>

      <h2>Student details</h2>

      <p>
        <strong>Name:</strong> Tuong An Luu
      </p>

      <p>
        <strong>Student number:</strong> 22640317
      </p>

      <h2>How to use the website</h2>

      <video className="instruction-video" controls preload="metadata">
        <source src="/how-to-use.mp4" type="video/mp4" />
        Your browser does not support embedded video.
      </video>
    </section>
  );
}