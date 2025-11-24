import { writeFileSync } from "fs";
import path from "path";

// ANSI escape codes for text colors
const redColor = "\x1b[31m"; // Red
const cyanColor = "\x1b[36m"; // Cyan
const resetColor = "\x1b[0m"; // Reset color
const invalidColor = "\x1b[33m"; // Yellow
const underline = "\x1b[4m"; // Underline
/**
 * Generates an environment sample file based on validation schema.
 * @param {import('yup').ObjectSchema} configurationValidation - Yup validation schema.
 */
const generateSampleEnv = (configurationValidation) => {
  const yupModel = configurationValidation.describe();
  let output = "";
  Object.keys(yupModel.fields).forEach((key) => {
    const keyObject = yupModel.fields[key];
    const label = keyObject?.label;
    const finalLabel = label ? `# ${label}\n` : "";

    let value = `<${key}>`;
    if (yupModel.default[key] !== undefined) {
      value = yupModel.default[key];
    }
    if (keyObject?.oneOf?.length) {
      value = `<${keyObject?.oneOf.join(" | ")}>`;
    }

    output += `${finalLabel}${key}=${value}\n\n`;
  });
  const filePath = path.join(process.cwd(), "env.sample");
  writeFileSync(filePath, output);

  return filePath; // Return the file path for reference
};

/**
 * Converts a string to camelCase.
 * @param {string} str - The input string
 * @returns {string} The camelCase string
 */
export const toCamelCase = (str) => {
  return str
    .split("_") // Split by underscores
    .map((word, index) => {
      if (index === 0) {
        // Lowercase the first word
        return word.toLowerCase();
      }

      // Capitalize the first letter of subsequent words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

/**
 * Validates the current environment variables against a schema.
 * @param {import('yup').ObjectSchema} configurationValidation - Yup validation schema.
 * @returns {Promise<Record<string, any>>} - A promise that resolves to the validated environment variables.
 */
const validateEnv = async (configurationValidation) => {
  try {
    const validationResult = await configurationValidation.validate(process.env, {
      abortEarly: false,
      allowUnknown: true,
      disableStackTrace: true,
      stripUnknown: true,
    });

    if (validationResult.error) {
      throw validationResult.error;
    }

    // Transform the validated result to camelCase
    const transformedResult = Object.entries(validationResult).reduce((acc, [key, value]) => {
      if (key.startsWith("NEXT_PUBLIC_")) {
        const newKey = toCamelCase(key.replace(/^NEXT_PUBLIC_/, ""));

        return { ...acc, [newKey]: value };
      }

      return acc;
    }, {});

    return transformedResult;
  } catch (error) {
    if (error.inner && error.inner.length > 0) {
      const truncateValue = (value, length) => {
        if (typeof value === "string") {
          return (value.length > length ? `${value.slice(0, length - 3)}...` : value).replace(
            /\n/g,
            "\\n"
          );
        }

        return value;
      };

      const missingEnvVariables = error.inner
        .map(
          ({ message, value, params }) =>
            `${redColor}  - ${message
              .replace(/is a required field/g, "is required")
              .replace(
                params.label,
                params.path
              )} ${invalidColor}(Invalid Value: ${underline}${truncateValue(
              value,
              10
            )}${resetColor}${invalidColor})`
        )
        .join("\n");
      const filePath = generateSampleEnv(configurationValidation); // Generate env.sample
      console.log(
        `${redColor} Error: Invalid environment variables:\n${missingEnvVariables}${redColor}\n\n Please refer to ${cyanColor}${filePath}${resetColor}${redColor} for details.${resetColor}`
      );
      process.exit(1);
    } else {
      console.error(`Validation failed: ${error.message}`);
      process.exit(1);
    }
  }
};

export default validateEnv;
