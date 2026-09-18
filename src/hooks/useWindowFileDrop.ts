import { useEffect, useRef, useState } from "react";

const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes("Files");

/**
 * Accept a file drop anywhere on the page while the caller is mounted.
 *
 * A browser only skips its default action (navigating to the dropped image) if
 * the element under the cursor cancels dragover/dragenter and handles drop. A
 * per-element handler leaves every pixel outside that element -- the thumbnail
 * grid, the modal's other panel, the overlay -- as a navigation. Listening on
 * `window` covers all of it; `isDragging` lets the caller show a highlight.
 */
export const useWindowFileDrop = (onFiles: (files: File[]) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const onFilesRef = useRef(onFiles);
  useEffect(() => {
    onFilesRef.current = onFiles;
  }, [onFiles]);

  useEffect(() => {
    // dragenter/dragleave also fire for every child element crossed, so a
    // counter, not a boolean, says whether the drag is still over the page.
    let depth = 0;

    const onEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth += 1;
      setIsDragging(true);
    };
    const onOver = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    };
    const onLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setIsDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      setIsDragging(false);
      // Copy out synchronously: the FileList is emptied once the event ends.
      const files = Array.from(e.dataTransfer?.files ?? []);
      if (files.length) onFilesRef.current(files);
    };

    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragover", onOver);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  return isDragging;
};
