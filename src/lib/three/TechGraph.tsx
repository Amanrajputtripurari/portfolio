import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThreeRenderer } from "@/hooks/useThreeRenderer";
import { useTheme } from "@/providers/ThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { skills } from "@/data/portfolio";
import type { SkillItem } from "@/types/portfolio";
import { gsap } from "@/lib/gsap";
import { createTechGraph, type TechGraph as TechGraphHandles } from "@/lib/three/createTechGraph";
import styles from "./TechGraph.module.css";

interface TechGraphProps {
  active?: boolean;
  onReady?: () => void;
}

const PALETTES = {
  dark: { lineColor: 0x4a5c88 },
  light: { lineColor: 0xaab6d9 },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function TechGraph({ active = true, onReady }: TechGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<TechGraphHandles | null>(null);
  const hoverIndexRef = useRef(-1);
  const draggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0, moved: false });
  const pointer = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const projected = useRef(new THREE.Vector3());
  const [hovered, setHovered] = useState<SkillItem | null>(null);
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();

  useThreeRenderer(
    containerRef,
    ({ scene, camera, renderer }) => {
      const graph = createTechGraph(skills, PALETTES[theme]);
      graphRef.current = graph;
      graph.group.rotation.x = 0.18;
      scene.add(graph.group);
      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      camera.position.set(0, 0.15, 8.2);

      const canvas = renderer.domElement;
      canvas.style.touchAction = "pan-y";

      const setPointer = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.current.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        pointer.current.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
      };

      const pickIndex = () => {
        const current = graphRef.current;
        if (!current) return -1;
        raycaster.current.setFromCamera(pointer.current, camera);
        const hits = raycaster.current.intersectObjects(current.hits);
        const index = hits[0]?.object.userData.index;
        return typeof index === "number" ? index : -1;
      };

      const pointerDown = { active: false };

      const onMove = (event: PointerEvent) => {
        setPointer(event);
        if (pointerDown.active) {
          const dx = event.clientX - dragStart.current.x;
          const dy = event.clientY - dragStart.current.y;
          if (!draggingRef.current) {
            const isTouch = event.pointerType !== "mouse";
            const started = isTouch
              ? Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.1
              : Math.hypot(dx, dy) > 3;
            if (!started) return;
            draggingRef.current = true;
            dragStart.current.moved = true;
            canvas.setPointerCapture(event.pointerId);
          }
          const current = graphRef.current;
          if (current) {
            current.group.rotation.y = dragStart.current.rotY + dx * 0.008;
            current.group.rotation.x = clamp(dragStart.current.rotX + dy * 0.006, -0.95, 0.95);
          }
          hoverIndexRef.current = -1;
          setHovered(null);
          return;
        }

        if (event.pointerType !== "mouse") return;
        const next = pickIndex();
        if (next !== hoverIndexRef.current) {
          hoverIndexRef.current = next;
          setHovered(next >= 0 ? skills[next] : null);
        }
      };

      const onDown = (event: PointerEvent) => {
        if (event.button !== 0 && event.pointerType === "mouse") return;
        const current = graphRef.current;
        if (!current) return;
        pointerDown.active = true;
        draggingRef.current = event.pointerType === "mouse";
        dragStart.current = {
          x: event.clientX,
          y: event.clientY,
          rotX: current.group.rotation.x,
          rotY: current.group.rotation.y,
          moved: false,
        };
        if (event.pointerType === "mouse") {
          canvas.setPointerCapture(event.pointerId);
        }
      };

      const onUp = (event: PointerEvent) => {
        const wasDrag = draggingRef.current;
        pointerDown.active = false;
        draggingRef.current = false;
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch {
          /* already released */
        }
        if (!wasDrag && event.pointerType !== "mouse") {
          setPointer(event);
          const next = pickIndex();
          hoverIndexRef.current = next;
          setHovered(next >= 0 ? skills[next] : null);
        }
      };

      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
      canvas.addEventListener("pointerleave", onUp);

      return () => {
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        canvas.removeEventListener("pointerleave", onUp);
        graph.dispose();
        graphRef.current = null;
      };
    },
    ({ camera, renderer }) => {
      const graph = graphRef.current;
      if (!graph) return;
      if (active && !draggingRef.current && !reducedMotion && hoverIndexRef.current < 0) {
        graph.group.rotation.y += 0.004;
      }
      graph.update(0, hoverIndexRef.current);

      const tooltip = tooltipRef.current;
      const index = hoverIndexRef.current;
      if (!tooltip || index < 0) return;
      const sprite = graph.sprites[index];
      projected.current.copy(sprite.position).applyMatrix4(graph.group.matrixWorld);
      projected.current.project(camera);
      const x = (projected.current.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
      const y = (-projected.current.y * 0.5 + 0.5) * renderer.domElement.clientHeight;
      tooltip.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, calc(-100% - 18px))`;
    },
    () => {
      onReady?.();
    },
  );

  useEffect(() => {
    const tooltip = tooltipRef.current;
    const card = tooltip?.firstElementChild;
    if (!tooltip || !card) return;
    gsap.killTweensOf(card);
    if (hovered) {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.28, ease: "power3.out", overwrite: true },
      );
    }
  }, [hovered]);

  return (
    <div className={styles.stage}>
      <div ref={containerRef} className={styles.canvasHost} data-cursor="hover" />
      <div
        ref={tooltipRef}
        className={styles.tooltip}
        data-visible={hovered ? "true" : "false"}
        aria-hidden={!hovered}
      >
        {hovered && (
          <div className={styles.tooltipCard}>
            <p className={styles.tooltipCategory}>{hovered.category}</p>
            <p className={styles.tooltipName}>{hovered.name}</p>
            <p className={styles.tooltipSummary}>{hovered.summary}</p>
            <div className={styles.stars} aria-label={`${hovered.rating} out of 5`}>
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index} data-on={index < hovered.rating ? "true" : "false"}>
                  ★
                </span>
              ))}
              <em>{hovered.rating}/5</em>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
