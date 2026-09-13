export default function AboutPage() {
  return (
    <section className="content-page">
      <h1>About the project</h1>

      <p>
        The Phoneme Activity Builder helps teachers create browser-based
        learning activities for Speech Pathology students.
      </p>

      <h2>Assessment 2 scope</h2>

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

      <h2>References</h2>

      <ol>
        <li>
          React. (n.d.). React documentation.
          https://react.dev/
        </li>

        <li>
          Vercel. (n.d.). Next.js documentation.
          https://nextjs.org/docs
        </li>

        <li>
          World Wide Web Consortium. (2018).
          Web Content Accessibility Guidelines (WCAG) 2.1.
          https://www.w3.org/TR/WCAG21/
        </li>

        <li>
          Nielsen, J. (1994).
          Usability engineering.
          Morgan Kaufmann.
        </li>

        <li>
          International Phonetic Association. (1999).
          Handbook of the International Phonetic Association:
          A guide to the use of the International Phonetic Alphabet.
          Cambridge University Press.
        </li>
      </ol>
    </section>
  );
}