import * as THREE from "three";
import type { SkillItem } from "../../data/portfolio";
import { glyphForSkill } from "./skillIcons";

function luminance(hex: string): number {
  const raw = hex.replace("#", "");
  const value = Number.parseInt(raw.length === 3 ? raw.replace(/./g, (c) => c + c) : raw, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function createSkillTexture(skill: SkillItem): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const glyph = glyphForSkill(skill.name);
  const brand = `#${glyph.hex.replace("#", "")}`;
  const ink = luminance(brand) > 0.6 ? "#111318" : "#ffffff";
  const cx = 128;
  const cy = 128;

  ctx.clearRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(cx, cy, 36, cx, cy, 118);
  glow.addColorStop(0, brand);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 118, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 84, 0, Math.PI * 2);
  ctx.fillStyle = brand;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 84, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.stroke();

  const iconSize = 96;
  ctx.save();
  ctx.translate(cx - iconSize / 2, cy - iconSize / 2);
  ctx.scale(iconSize / 24, iconSize / 24);
  ctx.fillStyle = ink;
  ctx.fill(new Path2D(glyph.path));
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
