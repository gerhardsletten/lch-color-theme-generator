import { lchToHex, hexToLch } from "lch-color-utils";

type TColor = [number, number, number] | [number, number, number, number];

type TLchAdjust = {
  a?: number;
  l?: number;
  c?: number;
  h?: number;
};

export function fromCss(hex: string): TColor {
  const { l, c, h, a } = hexToLch(hex);
  return a ? [l, c, h, a] : [l, c, h];
}
export function toCss([l, c, h]: TColor): string {
  const { value } = lchToHex({ l, c, h });
  return value;
}

function ir(t: number, e: number, s: number): number {
  return Math.max(e, Math.min(s, t));
}

function ar(t: number, e: number, s: number): number {
  return Math.max(e, Math.min(s, t));
}

function adjust(color: TColor, adjustment: TLchAdjust): TColor {
  const [fe, R, P] = color;
  return [
    ir(fe + (adjustment.l ?? 0), 0, 100),
    ir(R + (adjustment.c ?? 0), 0, 132),
    ir(P + (adjustment.h ?? 0), 0, 360),
  ];
}

function adjustTo(color: TColor, adjustment: TLchAdjust): TColor {
  const [oe, ve, x] = color;
  return [
    ar(adjustment.l ?? oe, 0, 100),
    ar(adjustment.c ?? ve, 0, 132),
    ar(adjustment.h ?? x, 0, 360),
  ];
}

function getTextColor(color: TColor): TColor {
  const [_, fe, R] = color;
  return [_ - fe * 0.075 > 65 ? 0 : 100, Math.round(Math.min(fe / 2, fe)), R];
}

export function getTextColor2(color: TColor): TColor {
  const [B, oe, ve] = color;
  return [B > 50 ? 0 : 100, Math.round(Math.min(10, oe)), ve];
}

function uT<T extends Record<string, number>>(
  e: T,
  t: (v1: number, v2: keyof T) => number
) {
  const n = { ...e };
  Object.keys(e).forEach((o) => {
    const r = o as keyof T;
    const num = e[r];
    if (num) {
      n[r] = t(num, r) as typeof num;
    }
  });
  return n;
}

type GenerateThemeParams = {
  base: TColor;
  contrast: number;
};

export function generateTheme(params: GenerateThemeParams) {
  const bgBase = params.base;
  const isBgLight = bgBase[0] > 50;
  //const i = r && o[0] > 98 && o[1] < 8
  const a = ((isBgLight ? -1 : 1) * params.contrast) / 30;
  const p = ((isBgLight ? -1 : 1) * (3 + (100 - params.contrast) / 70)) / 4;
  const y = (1 + Math.abs(bgBase[0] - 50) / 50) / 2;
  // l()
  function adjustBgColor(ps: TColor, gs: TLchAdjust, eo?: TLchAdjust) {
    const fr = adjust(
      ps,
      uT(gs, ($u) => $u * a)
    );
    return eo ? adjustTo(fr, eo) : fr;
  }
  const c = ((isBgLight ? -0.8 : 1) * params.contrast) / 70;
  // d()
  function adjustControlColor(ps: TColor, gs: TLchAdjust, eo?: TLchAdjust) {
    const fr = adjust(
      ps,
      uT(gs, ($u) => $u * c)
    );
    return eo ? adjustTo(fr, eo) : fr;
  }
  // f()
  function adjustFgColor(ps: TColor, gs: TLchAdjust, eo?: TLchAdjust) {
    const fr = adjust(getTextColor(ps), {
      ...gs,
      l: gs.l && gs.l * p,
    });
    return eo ? adjustTo(fr, eo) : fr;
  }
  const u =
    ((isBgLight ? -0.9 : 0.8) *
      (params.contrast + Math.max(params.contrast - 30, 0) * 0.1)) /
    10;
  // h()
  function adjustBgBorderColor(ps: TColor, gs: TLchAdjust, eo?: TLchAdjust) {
    const fr = adjust(ps, {
      ...gs,
      l: gs.l && gs.l * u,
      c: (gs.c ?? 0) * u,
    });
    return eo ? adjustTo(fr, eo) : fr;
  }
  const bgMuted = adjustBgColor(
    bgBase,
    isBgLight
      ? {
          l: 1,
        }
      : {
          l: -2,
          c: -2,
        }
  );
  const bgMutedDarker = adjustBgColor(
    bgBase,
    isBgLight
      ? {
          l: 6,
        }
      : {
          l: -5,
          c: -2,
        }
  );
  const textBase = adjustFgColor(bgBase, {
    l: (isBgLight ? -20 : -10) * y,
    c: 1,
  });
  const textMuted = adjustFgColor(
    bgBase,
    {
      l: isBgLight ? -50 : -20,
    },
    {
      c: 10,
    }
  );
  return {
    bgBase,
    bgMuted,
    bgMutedDarker,
    textBase,
    textMuted,
  };
}
