import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function is404Error(error: FetchBaseQueryError | SerializedError | undefined) {
  return (error as FetchBaseQueryError)?.status === 404;
}

export const formatDate = (
  value: string | null | undefined,
  options?: {
    format?: string; // custom format
    relative?: boolean; // return relative time (e.g., "12 hours ago")
  }
) => {
  if (!value) return null;

  const d = dayjs(value);
  if (!d.isValid()) return null;

  if (options?.relative) {
    return d.fromNow(); // e.g., "12 hours ago"
  }

  return d.format(options?.format ?? "D-M-YY, HH:mm");
};

export const convertToCamelCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const convertTo12Hour = (time24: string) => {
  // Split hours and minutes
  const timeArray = time24.split(":").map(Number);
  let hours = timeArray[0];
  const minutes = timeArray[1];

  // Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // 0 -> 12, 13 -> 1

  // Return formatted string
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const removeDuplicatesById = <T extends { id: string }>(arr: T[]): T[] => {
  const seen = new Set<string | number>();
  return arr.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};
