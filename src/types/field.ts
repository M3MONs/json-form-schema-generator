export type FieldType = "string" | "number" | "boolean" | "select" | "textarea";

export interface Field {
  id: string;
  type: FieldType;
  name: string;
  title: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: string | number | boolean;
  minimum?: number;
  maximum?: number;
  
  // UI Schema properties
  widget?: string;
  description?: string;
  help?: string;
  rows?: number;
  inline?: boolean;
  disabled?: boolean;
}
