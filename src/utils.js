import { useCallback, useEffect, useRef, useState } from 'react';

export const useInfiniteScroll = (scrollRef, action) => {

    const observer = useCallback(node => {
        /* eslint-disable */
        const ob = new IntersectionObserver(
            /*eslint-enable */
            entries => {
                entries.forEach(en => {
                    if (en.intersectionRatio > 0) {
                        action();
                    }
                })
            }
        ).observe(node);
    }, [action]);

    useEffect(() => {
        if (scrollRef) {
            observer(scrollRef.current);
        }
    }, [scrollRef, observer]);
}

export const useImageLazyLoad = () => {
    const [visibleState, setVisibleState] = useState(false);
    const imageRef = useRef(null);

    const observer = useCallback(node => {
        const ob = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    setVisibleState(true);
                    ob.unobserve(node);
                }
            })
        }, { threshold: 0.25 });
        ob.observe(node);
    }, []);

    useEffect(() => {
        if (imageRef) {
            observer(imageRef.current);
        }
    }, [imageRef, observer]);

    return [visibleState, imageRef];
}