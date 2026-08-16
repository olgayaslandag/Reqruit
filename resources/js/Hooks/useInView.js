import { useEffect, useRef, useState } from 'react';

export function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        if (typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, { rootMargin: '100px', ...options });

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return [ref, inView];
}

export default useInView;