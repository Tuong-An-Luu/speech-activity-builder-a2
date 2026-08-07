"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function readCookie(name: string): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie
    ? decodeURIComponent(cookie.split("=")[1])
    : null;
}

export default function ThemeController() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = readCookie("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

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