import type { Field, FieldType } from "../types/field";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function defaultField(type: FieldType): Field {
  const id = uid();
  return {
    id,
    type,
    name: `${type}_${id}`,
    title:
      type === "textarea"
        ? "Text area"
        : type === "select"
        ? "Select field"
        : `${type.charAt(0).toUpperCase() + type.slice(1)} field`,
    required: false,
  options: type === "select" ? ["Option 1", "Option 2"] : undefined,
  placeholder: type === "textarea" || type === "string" ? "" : undefined,
  defaultValue: type === "boolean" ? false : undefined,
  minimum: type === "number" ? undefined : undefined,
  maximum: type === "number" ? undefined : undefined,
  };
}
