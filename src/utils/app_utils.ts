import dayjs from "dayjs";

/**
 * Function to generate model name from user name
 * @param name
 * @returns
 */
export const getModelName = (name: string): string => {
  const modelName = name.charAt(0).toUpperCase() + name.slice(1);
  return `${modelName}'s Model`;
};

/**
 * Function to format date for display, in the viewer's local timezone:
 * "Today", "Yesterday", "Mon 15 Sep" (year appended when not the current year),
 * or "Earlier" when the date is missing or invalid.
 * @param dateInput
 * @returns
 */
export const formatDateForDisplay = (
  dateInput: Date | string | number | null | undefined
): string => {
  if (dateInput === null || dateInput === undefined) return "Earlier";

  // Postgres can emit a two-digit UTC offset ("+00"), which Date can't parse.
  const normalised =
    typeof dateInput === "string" ? dateInput.replace(/([+-]\d{2})$/, "$1:00") : dateInput;

  const date = dayjs(normalised);
  if (!date.isValid()) return "Earlier";

  const today = dayjs();
  if (date.isSame(today, "day")) return "Today";
  if (date.isSame(today.subtract(1, "day"), "day")) return "Yesterday";

  return date.format(date.isSame(today, "year") ? "ddd D MMM" : "ddd D MMM YYYY");
};
