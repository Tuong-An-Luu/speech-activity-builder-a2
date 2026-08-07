import ThemeController from "../../components/ThemeController";

export default function SettingsPage() {
  return (
    <section>
      <h1>Settings</h1>

      <p>
        Choose the appearance of the activity builder.
        Your preference is saved in a browser cookie.
      </p>

      <ThemeController />
    </section>
  );
}