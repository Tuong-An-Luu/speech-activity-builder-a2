import { cookies } from "next/headers";
import ThemeController from "../../components/ThemeController";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("theme")?.value;

  const initialTheme =
    savedTheme === "dark" ? "dark" : "light";

  return (
    <section>
      <h1>Settings</h1>

      <p>
        Choose the appearance of the activity builder.
        Your preference is saved in a browser cookie.
      </p>

      <ThemeController initialTheme={initialTheme} />
    </section>
  );
}