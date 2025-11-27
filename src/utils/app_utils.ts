/**
 * Function to generate model name from user name
 * @param name
 * @returns
 */
export const getModelName = (name: string): string => {
  const modelName = name.charAt(0).toUpperCase() + name.slice(1);
  return `${modelName}'s Model`;
};
