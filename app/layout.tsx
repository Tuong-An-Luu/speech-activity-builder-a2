import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Phoneme Activity Builder",
  description:
    "Create phoneme-based Wordle and Word Search classroom activities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("theme")?.value;
  const theme = savedTheme === "dark" ? "dark" : "light";

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>

        <header className="site-header">
          <div className="header-inner">
            <div>
              <p className="site-title">Phoneme Activity Builder</p>
              <p className="site-subtitle">
                Cloud Web Application Assessment 1
              </p>
            </div>

            <Navigation />
          </div>
        </header>

        <main id="main-content" className="page-container">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}