import slugify from "slugify";
import Venture from "../models/Venture.js"; // Adjust path based on your folder structure

// ─── Basic Utilities ─────────────────────────────────────────────────────
export const isEmpty = (val) => val === undefined || val === null || val === "";

// ─── Required Field Validation ───────────────────────────────────────────
export const validateRequiredFields = (fields) => {
  return Object.entries(fields)
    .filter(([_, value]) => isEmpty(value))
    .map(([key]) => key);
};

// ─── Number Field Validation ─────────────────────────────────────────────
export const validateNumberFields = (fields) => {
  const errors = [];
  for (const { name, value, required } of fields) {
    if (required && isEmpty(value)) {
      errors.push(`${name} is required and must be a valid number.`);
    } else if (!isEmpty(value) && isNaN(Number(value))) {
      errors.push(`${name} must be a valid number.`);
    }
  }
  return errors;
};

// ─── Date Field Validation ───────────────────────────────────────────────
export const validateDateFields = (fields) => {
  const errors = [];
  for (const { name, value, required = true } of fields) {
    const valid = !isEmpty(value) && !isNaN(new Date(value).getTime());

    if (required && !valid) {
      errors.push(`${name} is required and must be a valid date.`);
    } else if (!required && value && !valid) {
      errors.push(`${name} must be a valid date.`);
    }
  }
  return errors;
};

// ─── Slug Generator (Async) ──────────────────────────────────────────────
export const generateUniqueSlug = async (title) => {
  const baseSlug = slugify(title.trim(), { lower: true });
  let slug = baseSlug;
  let counter = 1;
  while (await Venture.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
};

export function validateEnumFields(fields) {
  const errors = [];

  fields.forEach(({ name, value, allowedValues, required = true }) => {
    const isMissing = value === undefined || value === null || value === "";

    if (required && isMissing) {
      errors.push(`${name} is required.`);
      return;
    }

    if (!isMissing && !allowedValues.includes(value)) {
      errors.push(
        `${name} must be one of: ${allowedValues.join(
          ", "
        )}. Received: ${value}`
      );
    }
  });

  return errors;
}
