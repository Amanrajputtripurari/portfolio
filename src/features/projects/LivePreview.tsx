import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./LivePreview.module.css";

/** Width the site is rendered at before being scaled into the frame. */
const DESKTOP_WIDTH = 1440;
/** Give up on the iframe and keep the poster if it hasn't loaded by then. */
const LOAD_TIMEOUT_MS = 15000;
/** Card previews skip the iframe on small screens and data-saver connections. */
const LIGHT_MODE_QUERY = "(max-width: 760px)";

interface LivePreviewProps {
  url: string;
  title: string;
  poster?: string;
  posterAlt?: string;
  /** Interactive previews can be scrolled and clicked; card previews are inert. */
  interactive?: boolean;
}

function hostname(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function prefersLightweight() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData) || window.matchMedia(LIGHT_MODE_QUERY).matches;
}

/**
 * A browser frame showing the real, current site in an iframe rendered at
 * desktop width and scaled to fit. The screenshot poster shows until the
 * iframe loads, and stays if it never does.
 */
export default function LivePreview({ url, title, poster, posterAlt, interactive = false }: LivePreviewProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.25);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "live" | "failed">("idle");

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const resize = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / DESKTOP_WIDTH);
    });
    resize.observe(viewport);

    if (!interactive && prefersLightweight()) {
      return () => resize.disconnect();
    }

    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMounted(true);
        setStatus("loading");
        visibility.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    visibility.observe(viewport);

    return () => {
      resize.disconnect();
      visibility.disconnect();
    };
  }, [interactive]);

  useEffect(() => {
    if (status !== "loading") return;
    const id = window.setTimeout(() => setStatus("failed"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [status]);

  const live = status === "live";

  return (
    <div className={styles.browser} data-interactive={interactive ? "true" : "false"}>
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.address}>
          <svg viewBox="0 0 16 16">
            <path d="M5 7V5.5a3 3 0 0 1 6 0V7M4.5 7h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
          </svg>
          {hostname(url)}
        </span>
        <span className={styles.badge} data-live={live ? "true" : "false"}>
          {live ? "Live" : status === "loading" ? "Loading" : "Preview"}
        </span>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{ "--scale": scale } as CSSProperties}
      >
        {poster && (
          <img
            className={styles.poster}
            src={poster}
            alt={posterAlt ?? ""}
            decoding="async"
            loading="lazy"
            data-hidden={live ? "true" : "false"}
          />
        )}
        {mounted && status !== "failed" && (
          <iframe
            className={styles.frame}
            src={url}
            title={`${title} — live site`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={interactive ? 0 : -1}
            aria-hidden={interactive ? undefined : true}
            inert={!interactive}
            data-ready={live ? "true" : "false"}
            onLoad={() => setStatus("live")}
          />
        )}
      </div>
    </div>
  );
}
