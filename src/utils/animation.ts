export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/** Maps value from [inMin, inMax] to [outMin, outMax], clamped to the output range. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

/** 0 -> 1 -> 0 across [fadeInStart, fadeInEnd] .. [fadeOutStart, fadeOutEnd]. */
export function bandOpacity(
  value: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number,
): number {
  const rising = mapRange(value, fadeInStart, fadeInEnd, 0, 1);
  const falling = mapRange(value, fadeOutStart, fadeOutEnd, 1, 0);
  return Math.min(rising, falling);
}
