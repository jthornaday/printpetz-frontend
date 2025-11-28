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
 * Function to format date for display
 * @param dateInput
 * @returns
 */
export const formatDateForDisplay = (dateInput: Date | string): string => {
  const date = new Date(dateInput);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const toYYYYMMDD = (d: Date) => d.toISOString().split("T")[0];

  const dateString = toYYYYMMDD(date);
  const todayString = toYYYYMMDD(today);
  const yesterdayString = toYYYYMMDD(yesterday);

  if (dateString === todayString) {
    return "Today";
  } else if (dateString === yesterdayString) {
    return "Yesterday";
  } else {
    return dateString;
  }
};
