import { useCallback, useEffect } from 'react';

export const useInfiniteScroll = (scrollRef, action) => {

    const observer = useCallback(node => {
        const ob = new IntersectionObserver(
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