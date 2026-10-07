import { useEffect, useState } from 'react';
import { scrollToSection } from "@/lib/scrollToSection";
import styles from './BackToTop.module.css';

const RING_RADIUS = 18;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export default function BackToTop() {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const hero = document.getElementById('hero');
        if (!hero) return;

        const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0, rootMargin: '-18% 0px 0px 0px' });
        observer.observe(hero);

        let frame = 0;
        const updateProgress = () => {
            frame = 0;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        };
        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(updateProgress);
        };

        updateProgress();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    function handleClick() {
        document.body.style.overflow = "";
        scrollToSection("hero");
    }

    return (
        <button
            type='button'
            className={styles.button}
            data-visible={visible ? 'true' : 'false'}
            aria-label='Back to top'
            aria-hidden={!visible}
            tabIndex={visible ? 0 : -1}
            onClick={handleClick}>
            <svg className={styles.ring} viewBox='0 0 44 44' aria-hidden='true'>
                <circle className={styles.track} cx='22' cy='22' r={RING_RADIUS} />
                <circle
                    className={styles.meter}
                    cx='22'
                    cy='22'
                    r={RING_RADIUS}
                    strokeDasharray={RING_LENGTH}
                    strokeDashoffset={RING_LENGTH * (1 - progress)}
                />
            </svg>
            <span className={styles.core}>
                <svg viewBox='0 0 16 16' aria-hidden='true'>
                    <path d='M8 12.25V3.75M8 3.75L3.75 8M8 3.75L12.25 8' />
                </svg>
            </span>
        </button>
    );
}
