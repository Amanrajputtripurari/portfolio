import HeroImage from "@/features/hero/HeroImage";
import HeroLighting from "@/features/hero/HeroLighting";
import styles from "./HeroPortrait.module.css";

interface HeroPortraitProps {
  onReady?: () => void;
}

/** Static cutout portrait. Rim light is drop-shadow on the sharp image only. */
export default function HeroPortrait({ onReady }: HeroPortraitProps) {
  return (
    <div className={styles.stage}>
      <HeroLighting />
      <div className={styles.wrapper}>
        <div className={styles.frame}>
          <HeroImage onReady={onReady} />
        </div>
      </div>
    </div>
  );
}
