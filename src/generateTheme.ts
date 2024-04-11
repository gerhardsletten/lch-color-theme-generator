import { lchToHex, hexToLch } from "lch-color-utils";

export type TColor =
  | [number, number, number]
  | [number, number, number, number];

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

const j8 = 0.022,
  LI = 1.414;
function M8(t: number) {
  return t >= j8 ? t : t + (j8 - t) ** LI;
}

function apcaContrast(x: TColor, S: TColor) {
  const _s = x[0] / 100,
    Ko = S[0] / 100;
  let ra, Xs, rc;
  const Yo = M8(_s),
    Qo = M8(Ko),
    kh = Qo > Yo;
  return (
    Math.abs(Qo - Yo) < 5e-4
      ? (Xs = 0)
      : kh
      ? ((ra = Qo ** 0.56 - Yo ** 0.57), (Xs = ra * 1.14))
      : ((ra = Qo ** 0.65 - Yo ** 0.62), (Xs = ra * 1.14)),
    Math.abs(Xs) < 0.1
      ? (rc = 0)
      : Xs > 0
      ? (rc = Xs - 0.027)
      : (rc = Xs + 0.027),
    Math.abs(rc * 100)
  );
}
export function sufficientContrastForText(x: TColor, S: TColor) {
  return apcaContrast(x, S) > 30;
}

function ir(t: number, e: number, s: number): number {
  return Math.max(e, Math.min(s, t));
}

function ar(t: number, e: number, s: number): number {
  return Math.max(e, Math.min(s, t));
}
const e = [0.3457 / 0.3585, 1, (1 - 0.3457 - 0.3585) / 0.3585];
function ie(x: TColor) {
  const S = 903.2962962962963,
    he = 216 / 24389,
    R = [];
  return (
    (R[1] = (x[0] + 16) / 116),
    (R[0] = x[1] / 500 + R[1]),
    (R[2] = R[1] - x[2] / 200),
    [
      Math.pow(R[0], 3) > he ? Math.pow(R[0], 3) : (116 * R[0] - 16) / S,
      x[0] > S * he ? Math.pow((x[0] + 16) / 116, 3) : x[0] / S,
      Math.pow(R[2], 3) > he ? Math.pow(R[2], 3) : (116 * R[2] - 16) / S,
    ].map((J, ce) => J * e[ce])
  );
}
function X(x: TColor): TColor {
  const S = 0.008856451679035631,
    he = 24389 / 27,
    P = x
      .map((J, ce) => J / e[ce])
      .map((J) => (J > S ? Math.cbrt(J) : (he * J + 16) / 116));
  return [116 * P[1] - 16, 500 * (P[0] - P[1]), 200 * (P[1] - P[2])];
}
function _(x: TColor): TColor {
  const S = (Math.atan2(x[2], x[1]) * 180) / Math.PI;
  return [
    x[0],
    Math.sqrt(Math.pow(x[1], 2) + Math.pow(x[2], 2)),
    S >= 0 ? S : S + 360,
    1,
  ];
}
function z(x: TColor): TColor {
  return [
    x[0],
    x[1] * Math.cos((x[2] * Math.PI) / 180),
    x[1] * Math.sin((x[2] * Math.PI) / 180),
  ];
}

function mix(x: TColor, S: TColor, he: number): TColor {
  const R = x[3] ?? 1,
    P = S[3] ?? 1,
    [J, ce, Be] = ie(z(x)),
    [Ne, ke, Ee] = ie(z(S)),
    _s: TColor = [
      J * (1 - he) + he * Ne,
      ce * (1 - he) + he * ke,
      Be * (1 - he) + he * Ee,
    ],
    [Ko, ra, Xs] = _(X(_s));
  return [ar(Ko, 0, 100), ar(ra, 0, 132), ar(Xs, 0, 360), (R + P) / 2];
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
  accent: TColor;
  contrast: number;
};

export function generateTheme(params: GenerateThemeParams) {
  const bgBase = params.base;
  const o = bgBase;
  const isBgLight = bgBase[0] > 50;
  const r = isBgLight;
  const i = r && o[0] > 98 && o[1] < 8;
  const a = ((isBgLight ? -1 : 1) * params.contrast) / 30;
  const p = ((isBgLight ? -1 : 1) * (3 + (100 - params.contrast) / 70)) / 4;
  const y = (1 + Math.abs(bgBase[0] - 50) / 50) / 2;
  // l() // adjustBgColor
  function l(ps: TColor, gs: TLchAdjust, eo?: TLchAdjust) {
    const fr = adjust(
      ps,
      uT(gs, ($u) => $u * a)
    );
    return eo ? adjustTo(fr, eo) : fr;
  }
  const c = ((isBgLight ? -0.8 : 1) * params.contrast) / 70;
  // d() // adjustControlColor()
  function d(ps: TColor, gs: TLchAdjust, eo?: TLchAdjust) {
    const fr = adjust(
      ps,
      uT(gs, ($u) => $u * c)
    );
    return eo ? adjustTo(fr, eo) : fr;
  }
  // f() / adjustFgColor
  function f(ps: TColor, gs: TLchAdjust, eo?: TLchAdjust) {
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
  // h() / adjustBgBorderColor
  function h(ps: TColor, gs: TLchAdjust, eo?: TLchAdjust) {
    const fr = adjust(ps, {
      ...gs,
      l: gs.l && gs.l * u,
      c: (gs.c ?? 0) * u,
    });
    return eo ? adjustTo(fr, eo) : fr;
  }
  const bgMuted = l(
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
  const bgMutedDarker = l(
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
  const textBase = f(bgBase, {
    l: (isBgLight ? -20 : -10) * y,
    c: 1,
  });
  const textMuted = f(
    bgBase,
    {
      l: isBgLight ? -50 : -20,
    },
    {
      c: 10,
    }
  );
  const j = l(
      o,
      r
        ? {
            //bgBaseHover
            l: 1.25,
          }
        : {
            l: 1.5,
            c: 1,
          }
    ),
    v = l(
      o,
      r
        ? {
            // bgSub
            l: 5,
          }
        : {
            l: -2,
            c: -2,
          }
    ),
    w = l(
      v,
      r
        ? {
            // bgSubHover
            l: 2,
          }
        : {
            l: 2.5,
            c: 3,
          }
    ),
    S = l(
      o,
      i
        ? {
            // bgShade
            l: 4.5,
            c: -2,
          }
        : r
        ? {
            l: -5,
          }
        : {
            l: 5,
            c: 2,
          }
    ),
    C = l(
      S,
      r
        ? {
            // bgShadeHover
            l: 2,
          }
        : {
            l: 2.5,
            c: 1,
          }
    ),
    I = h(o, {
      // bgBorder
      l: 3.5,
      c: 1,
    }),
    $ = h(I, {
      // bgBorderHover
      l: 1,
    }),
    M = h(o, {
      // bgBorderThin
      l: 4,
      c: 1,
    }),
    T = h(
      o,
      r
        ? {
            // bgBorderFaint
            l: 1.5,
            c: 1,
          }
        : {
            l: 1.75,
            c: 1,
          }
    ),
    E = h(T, {
      // bgBorderFaintHover
      l: 1,
    }),
    P = h(
      o,
      r
        ? {
            // bgBorderFaintThin
            l: 2.5,
            c: 1,
          }
        : {
            l: 2,
            c: 1,
          }
    ),
    g = Math.max(1, 1 + Math.max(params.contrast - 30, 0) / (r ? 30 : 10)),
    R = h(o, {
      // bgBorderSolid
      l: 5,
      c: 1,
    }),
    L = h(o, {
      // bgBorderSolidHover
      l: 6,
      c: 1,
    }),
    O = h(o, {
      // bgBorderSolidThin
      l: 5,
      c: 1,
    }),
    F = mix(o, params.accent, (1 + o[1] / 30) * (r ? 0.18 : 0.05)), // bgSelectedBorder: h(F
    B = l(
      F,
      r
        ? {
            // bgSelectedHover
            l: 2,
          }
        : {
            l: 2.5,
            c: 2,
          }
    ),
    _ = f(
      o,
      {
        // controlSelectLabel
        l: r ? -10 * y : 10,
      },
      {
        c: 0,
      }
    ),
    z = f(o, {
      // controlSecondaryLabel
      l: (r ? -20 : -10) * y,
      c: 1,
    }),
    G = f(o, {
      // labelMuted
      l: -40 * y,
      c: 1,
    }),
    Z = f(o, {
      // labelFaint
      l: -66 * y,
      c: 1,
    }),
    W = f(
      o,
      {
        // labelLink
        l: -45 * y,
      },
      {
        h: params.accent[2],
        c: 70,
      }
    ),
    re = params.accent, // controlPrimary
    oe = d(
      o,
      r
        ? {
            // controlSecondary
            l: -6,
          }
        : {
            l: 15,
            c: 6,
          }
    ),
    le = d(
      o,
      r
        ? {}
        : {
            // controlTertiary
            l: 5,
            c: 1,
          }
    ),
    se = d(
      o,
      r
        ? {
            // controlTertiarySelected
            l: 15,
            c: -3,
          }
        : {
            l: 10,
            c: 5,
          }
    ),
    V = params.accent,
    Q =
      V[1] > 50 && (r ? V[0] < 90 : V[0] > 30)
        ? V
        : adjustTo(
            V,
            r
              ? {
                  l: 70,
                  c: 90,
                }
              : {
                  l: 50,
                  c: 120,
                }
          ),
    ee: TColor = [58, 67, 29], // rød-rosa
    Y: TColor = [80, 100, 85], // gul
    J: TColor = [60, 64.37, 141.95], // grønn
    te: TColor = [67.5, 39, 217], // cyan
    ue: TColor = [66, 73, 48], // oransje
    ce: TColor = [48, 59.31, 288.43], // lilla
    we: TColor = [80, 100, 262], // lys blå/lilla
    Pe = r ? 0.6 : 0.3,
    Oe = mix(o, we, Pe), // blueBg
    ve = mix(o, J, Pe), // greenBg
    Be = mix(o, ue, Pe), // orangeBg
    jt = mix(o, ce, Pe), // purpleBg
    Nt = mix(o, ee, Pe), // redBg
    ht = mix(o, te, Pe), // tealBg
    tt = mix(o, Y, Pe),
    pt = r ? 0 : Math.min(0.44, v[0] / 40),
    colors = {
      bgSub: v,
      bgSubHover: w,
      bgBase: o,
      bgBaseHover: j,
      bgShade: S,
      bgShadeHover: C,
      bgSelected: F,
      bgSelectedHover: B,
      bgBorder: I,
      bgBorderHover: $,
      bgBorderThin: M,
      bgBorderFaint: T,
      bgBorderFaintHover: E,
      bgBorderFaintThin: P,
      bgBorderSolid: R,
      bgBorderSolidHover: L,
      bgBorderSolidThin: O,
      bgSelectedBorder: h(F, {
        l: 3.5,
        c: 1,
      }),
      bgSelectedBorderHover: h(F, {
        l: 4.5,
        c: 1,
      }),
      labelBase: z,
      labelFaint: Z,
      labelLink: W,
      labelMuted: G,
      labelTitle: _,
      bgModalOverlay: r
        ? [0, 0, 0, 0.1 * g]
        : adjustTo(o, {
            a: 0.15 * g,
          }),
      cmdBgFocus: l(o, {
        l: r ? 4 : 8,
      }),
      cmdBgShade: l(o, {
        l: r ? 6 : 10,
      }),
      controlSecondaryHighlight: d(oe, {
        l: i ? 15 : r ? -15 : 8,
        c: 2,
      }),
      controlLabel: f(
        params.accent,
        {},
        {
          c: Math.min(5, params.accent[1]),
        }
      ),
      controlSelectLabel: _,
      controlSelectedBg: se,
      controlPrimary: re,
      controlPrimaryHover: l(re, {
        l: r ? 3 : 5,
        c: 2,
      }),
      controlPrimaryLabel: f(
        params.accent,
        {},
        {
          c: Math.min(5, params.accent[1]),
        }
      ),
      controlSecondary: oe,
      controlSecondaryHover: d(oe, {
        l: i ? 8 : r ? -15 : 8,
        c: 2,
      }),
      controlSecondaryLabel: z,
      controlTertiary: le,
      controlTertiaryHover: d(
        le,
        i
          ? {
              l: 10,
            }
          : r
          ? {
              l: -15,
            }
          : {
              l: 4,
              a: 0.2,
            }
      ),
      controlTertiaryLabel: z,
      controlTertiarySelected: se,
      scrollbarBg: adjust(Z, {
        l: r ? 0.3 : 0.4,
      }),
      scrollbarBgHover: adjust(Z, {
        l: 0.8,
      }),
      scrollbarBgActive: Z,
      blueBase: we,
      blueBaseHover: l(we, {
        l: 5,
      }),
      blueBg: Oe,
      blueMid: l(we, {
        l: 8,
      }),
      blueText: f(
        Oe,
        {
          l: -20,
        },
        {
          c: 80,
        }
      ),
      blueTextDark: [7, 14, 246],
      greenBase: J,
      greenBaseHover: l(J, {
        l: 5,
      }),
      greenBg: ve,
      greenMid: l(J, {
        l: 8,
      }),
      greenText: f(
        ve,
        {
          l: -20,
        },
        {
          c: 80,
        }
      ),
      orangeBase: ue,
      orangeBaseHover: l(ue, {
        l: 5,
      }),
      orangeBg: Be,
      orangeMid: l(ue, {
        l: 8,
      }),
      orangeText: f(
        Be,
        {
          l: -20,
        },
        {
          c: 80,
        }
      ),
      orangeTextDark: [6, 15, 34],
      purpleBase: ce,
      purpleBaseHover: l(ce, {
        l: 5,
      }),
      purpleBg: jt,
      purpleMid: l(ce, {
        l: 8,
      }),
      purpleText: f(
        jt,
        {
          l: -20,
        },
        {
          c: 80,
        }
      ),
      redBase: ee,
      redBaseHover: l(ee, {
        l: 5,
      }),
      redBg: Nt,
      redMid: l(ee, {
        l: 8,
      }),
      redText: f(
        Nt,
        {
          l: -20,
        },
        {
          c: 80,
        }
      ),
      tealBase: te,
      tealBaseHover: l(te, {
        l: 5,
      }),
      tealBg: ht,
      tealMid: l(te, {
        l: 8,
      }),
      tealText: f(
        ht,
        {
          l: -20,
        },
        {
          c: 80,
        }
      ),
      yellowBase: Y,
      yellowBaseHover: l(Y, {
        l: 5,
      }),
      yellowBg: tt,
      yellowMid: l(Y, {
        l: 8,
      }),
      yellowText: f(
        tt,
        {
          l: -20,
        },
        {
          c: 80,
        }
      ),
      scrollBackground: r ? [100, 0, 0, 0] : [0, 0, 0, 0.004],
      shadowColor: h(r ? [0, 0, 0, 0.03] : [0, 0, 0, 0.15], {
        l: 1,
      }),
      sidebarLinkActive: _,
      sidebarTint: adjustTo(
        v,
        r
          ? {
              a: 0.1,
            }
          : {
              l: v[1] > 0.5 ? 3 : 0,
              a: 0.54 - pt,
            }
      ),
      textHighlight: r ? [96, 20, 90] : [30, 35, 80],
      focusColor: Q,
      githubLogo: G,
    };
  return {
    bgBase,
    bgMuted,
    bgMutedDarker,
    textBase,
    textMuted,
    colors,
  };
}
