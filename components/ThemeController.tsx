"use client";

import { useState } from "react";

type Theme = "light" | "dark";

type ThemeControllerProps = {
  initialTheme: Theme;
};

export default function ThemeController({
  initialTheme,
}: ThemeControllerProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  function changeTheme(newTheme: Theme) {
    setTheme(newTheme);

    document.documentElement.dataset.theme = newTheme;

    document.cookie =
      `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return (
    <fieldset className="settings-group">
      <legend>Colour theme</legend>

      <label>
        <input
          type="radio"
          name="theme"
          checked={theme === "light"}
          onChange={() => changeTheme("light")}
        />
        Light mode
      </label>

      <label>
        <input
          type="radio"
          name="theme"
          checked={theme === "dark"}
          onChange={() => changeTheme("dark")}
        />
        Dark mode
      </label>
    </fieldset>
  );
}