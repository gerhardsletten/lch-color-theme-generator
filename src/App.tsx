import { useState } from "react";
import { generateTheme, fromCss, toCss } from "./generateTheme";

function App() {
  const [color, setColor] = useState("#BD0000");
  const [contrast, setContrast] = useState(100);
  return (
    <div className="max-w-[1000px] px-4 mx-auto py-4 grid grid-cols-1 gap-2">
      <h1 className="text-2xl font-bold">LCH color themegenerator</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="farge">Bakgrunn</label>
          <input
            type="color"
            id="farge"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="contrast">Kontrast</label>
          <input
            type="range"
            id="contrast"
            min="0"
            max="100"
            value={contrast}
            onChange={(event) => setContrast(parseInt(event.target.value))}
          />
        </div>
      </div>
      <p>{color}</p>
      <div className="grid grid-cols-2 gap-2">
        <ThemePreview bgColor={color} contrast={contrast} />
        <ThemePreview bgColor="#ffffff" contrast={contrast} />
        <ThemePreview bgColor="#232323" contrast={contrast} />
        <ThemePreview bgColor="#2fa789" contrast={contrast} />
      </div>
    </div>
  );
}

function ThemePreview({
  bgColor,
  contrast = 0,
  debug,
}: {
  bgColor: string;
  contrast?: number;
  debug?: boolean;
}) {
  const theme = generateTheme({
    base: fromCss(bgColor),
    contrast,
  });
  debug && console.log({ bgColor, contrast, theme });
  return (
    <div
      className="p-8 rounded"
      style={{
        backgroundColor: toCss(theme.bgBase),
        color: toCss(theme.textBase),
      }}
    >
      <h2 className="font-bold text-xl mb-2">Lorem ipsum dolor sit amet</h2>
      <p
        className="font-bold"
        style={{
          color: toCss(theme.textMuted),
        }}
      >
        Tekst som er dimmet ned
      </p>
      <p className="mb-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <p
        className="p-2 py-1 rounded border"
        style={{
          backgroundColor: toCss(theme.bgMuted),
          borderColor: toCss(theme.bgMutedDarker),
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  );
}

export default App;
