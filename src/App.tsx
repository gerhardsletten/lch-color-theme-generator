import { useState } from "react";
import { generateTheme, fromCss, toCss, TColor } from "./generateTheme";
import classNames from "classnames";

function App() {
  const [color, setColor] = useState("#BD0000");
  const [accent, setAccent] = useState("#c026d3");
  const [contrast, setContrast] = useState(100);
  return (
    <div className="max-w-[1000px] px-4 mx-auto py-4 grid grid-cols-1 gap-2">
      <h1 className="text-2xl font-bold">LCH color themegenerator</h1>
      <div className="flex items-center gap-4 flex-wrap">
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
          <label htmlFor="farge">Accent</label>
          <input
            type="color"
            id="farge"
            value={accent}
            onChange={(event) => setAccent(event.target.value)}
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
        <ThemePreview
          bgColor={color}
          accentColor={accent}
          contrast={contrast}
        />
        <ThemePreview
          bgColor="#ffffff"
          accentColor="#c026d3"
          contrast={contrast}
        />
        <ThemePreview
          bgColor="#232323"
          accentColor="#c026d3"
          contrast={contrast}
        />
        <ThemePreview
          bgColor="#2fa789"
          accentColor="#c026d3"
          contrast={contrast}
        />
      </div>
    </div>
  );
}

function ThemePreview({
  bgColor,
  accentColor,
  contrast = 0,
  debug,
}: {
  bgColor: string;
  accentColor: string;
  contrast?: number;
  debug?: boolean;
}) {
  const theme = generateTheme({
    base: fromCss(bgColor),
    contrast,
    accent: fromCss(accentColor),
  });
  debug && console.log({ bgColor, contrast, theme });
  const { colors } = theme;
  const objKeys = Object.keys(colors) as Array<keyof typeof colors>;
  const allColors = objKeys.map((k) => {
    return {
      name: k,
      color: colors[k],
    };
  });
  return (
    <div
      className="p-8 rounded"
      style={{
        backgroundColor: toCss(theme.bgBase),
        color: toCss(theme.textBase),
      }}
    >
      <h2 className="font-bold text-xl mb-2">Farge {toCss(theme.bgBase)}</h2>
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
        className="p-2 py-1 rounded border mb-2"
        style={{
          backgroundColor: toCss(theme.bgMuted),
          borderColor: toCss(theme.bgMutedDarker),
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <h3 className="font-bold mb-1">Linear palett</h3>
      <div className="grid grid-cols-8 bg-white p-2 gap-1 text-black">
        {allColors.map((item, i) => (
          <div
            key={i}
            className={classNames(
              "p-2 rounded text-center text-[8px] overflow-hidden text-ellipsis aspect-square",
              {
                "text-white": item.color[0] < 50,
              }
            )}
            title={item.name}
            style={{
              backgroundColor: toCss(item.color as TColor),
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
