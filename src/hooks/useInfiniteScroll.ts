import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMore,
  isFetching,
  onLoadMore,
  threshold = 0.1,
}: UseInfiniteScrollOptions) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Don't create observer if already loading or no more data
    if (isFetching || isLoadingMore || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Only trigger if intersecting and not already loading
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isFetching) {
          setIsLoadingMore(true);
          onLoadMore();
          // Disconnect immediately after triggering to prevent multiple calls
          observer.disconnect();
        }
      },
      { threshold }
    );

    observerRef.current = observer;

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, isFetching, onLoadMore, threshold]);

  // Reset loading flag when loading completes
  useEffect(() => {
    if (!isFetching && isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [isFetching, isLoadingMore]);

  return { observerTarget, isLoadingMore };
};
