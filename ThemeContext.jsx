import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState('#00a3ff');
  const [fontSize, setFontSize] = useState(14);

  // Apply CSS variables to the root
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent-blue', accentColor);
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
    document.body.style.fontSize = `${fontSize}px`;
  }, [accentColor, fontSize]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};
