import styles from "./ModuleLoader.module.css";

interface ModuleLoaderProps {
  label?: string;
}

/** Inline loader for lazy Three.js chunks and first WebGL frame. */
export default function ModuleLoader({ label = "Loading 3D module" }: ModuleLoaderProps) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <div className={styles.orbit} aria-hidden="true">
        <span />
        <span />
      </div>
      <p className={styles.label}>{label}</p>
      <div className={styles.track}>
        <div className={styles.bar} />
      </div>
    </div>
  );
}
