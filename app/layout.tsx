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

  const theme =
    savedTheme === "dark" ? "dark" : "light";

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <header>
          <h1>Phoneme Activity Builder</h1>
          <Navigation />
        </header>

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}