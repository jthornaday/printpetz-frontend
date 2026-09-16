import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

/**
 * Loads the next page while the sentinel (`observerTarget`) is visible.
 * Attach `scrollRoot` to the scrolling container the sentinel lives in;
 * without it, visibility is measured against the viewport.
 */
export const useInfiniteScroll = ({
  hasMore,
  isFetching,
  onLoadMore,
  threshold = 0.1,
}: UseInfiniteScrollOptions) => {
  // Callback refs (state setters) so the observer is created once the
  // elements actually mount, e.g. after a loading state.
  const [target, observerTarget] = useState<HTMLDivElement | null>(null);
  const [root, scrollRoot] = useState<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Latest callback without re-running effects when callers pass an inline arrow.
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  // The observer stays attached for the lifetime of the elements, including
  // while a page is being fetched.
  useEffect(() => {
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { root, threshold }
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [target, root, threshold]);

  // Also re-runs when a fetch finishes, so a sentinel that is still visible
  // after a page lands loads the next one.
  useEffect(() => {
    if (isIntersecting && hasMore && !isFetching) {
      onLoadMoreRef.current();
    }
  }, [isIntersecting, hasMore, isFetching]);

  return { observerTarget, scrollRoot, isLoadingMore: isIntersecting && isFetching };
};
