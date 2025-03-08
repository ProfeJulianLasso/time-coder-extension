import React, { FC, useEffect, useState } from "react";

const ThemeToggle: FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add("vscode-dark");
    } else {
      document.body.classList.remove("vscode-dark");
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDarkTheme ? "☀️ Tema Claro" : "🌙 Tema Oscuro"}
    </button>
  );
};

export default ThemeToggle;
