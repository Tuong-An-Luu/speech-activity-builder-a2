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
        This assessment extends the original frontend application with a
        backend, database persistence, CRUD operations, validation and
        Docker support. Word lists, words, phonemes and activity
        configurations can be stored and managed using Prisma and SQLite.
      </p>

      <p>
        Saved database content can be loaded into the Wordle and Word Search
        builders and used to generate standalone HTML activities.
      </p>

      <h2>Phoneme Wordle</h2>

      <p>
        The Wordle tool can load a saved word, ordered phonemes, hint and
        English equivalent from the database and use them to generate a
        standalone guessing activity.
      </p>

      <h2>Phoneme Word Search</h2>

      <p>
        The Word Search tool can load a saved word list and construct an
        activity using phonemes stored in the database, including
        multi-character phonemes.
      </p>

      <h2>Student details</h2>

      <p>
        <strong>Name:</strong> Tuong An Luu
      </p>

      <p>
        <strong>Student number:</strong> 22640317
      </p>

      <h2>References</h2>

      <ol>
        <li>
          React. (n.d.). <em>React documentation</em>.{" "}
          <a
            href="https://react.dev/"
            target="_blank"
            rel="noreferrer"
          >
            https://react.dev/
          </a>
        </li>

        <li>
          Vercel. (n.d.). <em>Next.js documentation</em>.{" "}
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
          >
            https://nextjs.org/docs
          </a>
        </li>

        <li>
          Prisma Data, Inc. (n.d.). <em>Prisma documentation</em>.{" "}
          <a
            href="https://www.prisma.io/docs"
            target="_blank"
            rel="noreferrer"
          >
            https://www.prisma.io/docs
          </a>
        </li>

        <li>
          Docker, Inc. (n.d.). <em>Docker documentation</em>.{" "}
          <a
            href="https://docs.docker.com/"
            target="_blank"
            rel="noreferrer"
          >
            https://docs.docker.com/
          </a>
        </li>

        <li>
          Zod. (n.d.). <em>Zod documentation</em>.{" "}
          <a
            href="https://zod.dev/"
            target="_blank"
            rel="noreferrer"
          >
            https://zod.dev/
          </a>
        </li>

        <li>
          World Wide Web Consortium. (2018).{" "}
          <em>Web Content Accessibility Guidelines (WCAG) 2.1</em>.{" "}
          <a
            href="https://www.w3.org/TR/WCAG21/"
            target="_blank"
            rel="noreferrer"
          >
            https://www.w3.org/TR/WCAG21/
          </a>
        </li>

        <li>
          Nielsen, J. (1994). <em>Usability engineering</em>.
          Morgan Kaufmann.
        </li>

        <li>
          International Phonetic Association. (1999).{" "}
          <em>
            Handbook of the International Phonetic Association: A guide
            to the use of the International Phonetic Alphabet
          </em>
          . Cambridge University Press.
        </li>
      </ol>
    </section>
  );
}