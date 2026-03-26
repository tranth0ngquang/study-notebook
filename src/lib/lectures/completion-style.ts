import type { CSSProperties } from "react";

function normalizeHexColor(color?: string | null) {
  if (!color) {
    return null;
  }

  const trimmed = color.trim();

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return null;
}

function hexToRgb(color?: string | null) {
  const normalized = normalizeHexColor(color);

  if (!normalized) {
    return null;
  }

  const value = normalized.slice(1);

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
    hex: normalized,
  };
}

function rgba(color: string | null | undefined, alpha: number) {
  const rgb = hexToRgb(color);

  if (!rgb) {
    return undefined;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function getLectureCompletionCardStyle(courseColor?: string | null): CSSProperties | undefined {
  const rgb = hexToRgb(courseColor);

  if (!rgb) {
    return undefined;
  }

  return {
    borderColor: rgba(courseColor, 0.45),
    backgroundImage: `linear-gradient(135deg, ${rgba(courseColor, 0.16)} 0%, rgba(255,255,255,1) 68%)`,
  };
}

export function getLectureCompletionBadgeStyle(courseColor?: string | null): CSSProperties | undefined {
  const rgb = hexToRgb(courseColor);

  if (!rgb) {
    return undefined;
  }

  return {
    borderColor: rgba(courseColor, 0.35),
    backgroundColor: rgba(courseColor, 0.16),
    color: rgb.hex,
  };
}

export function getLectureCompletionToggleStyle(courseColor?: string | null) {
  const rgb = hexToRgb(courseColor);

  if (!rgb) {
    return {
      shellStyle: undefined,
      checkedBoxStyle: undefined,
    };
  }

  return {
    shellStyle: {
      borderColor: rgba(courseColor, 0.25),
      backgroundColor: rgba(courseColor, 0.08),
    } satisfies CSSProperties,
    checkedBoxStyle: {
      borderColor: rgb.hex,
      backgroundColor: rgb.hex,
    } satisfies CSSProperties,
  };
}
