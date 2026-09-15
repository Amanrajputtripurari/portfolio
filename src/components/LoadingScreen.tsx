import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {
  ready: boolean;
}

/** Full-page loader until the portrait and hero 3D module are ready. */
export default function LoadingScreen({ ready }: LoadingScreenProps) {
  const [progress, setProgress] = useState(8);
  const [timedOut, setTimedOut] = useState(false);
  const done = ready || timedOut;

  useEffect(() => {
    if (done) {
      setProgress(100);
      return;
    }
    const interval = window.setInterval(() => {
      setProgress((current) => (current < 88 ? current + (88 - current) * 0.15 : current));
    }, 120);
    const timeout = window.setTimeout(() => setTimedOut(true), 5000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [done]);

  return (
    <div className={`${styles.screen} ${done ? styles.hidden : ""}`} aria-hidden={done} role="status">
      <div className={styles.content}>
        <div className={styles.orbit} aria-hidden="true">
          <span />
          <span />
        </div>
        <p className={styles.label}>{done ? "System ready" : "Loading 3D module"}</p>
        <div className={styles.track}>
          <div className={styles.bar} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
