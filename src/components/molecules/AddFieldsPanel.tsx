import { Stack } from "@mui/material";
import FieldTypeButton from "../atoms/FieldTypeButton";
import type { FieldType } from "../../types/field";

interface AddFieldsPanelProps {
  onAddField: (type: FieldType) => void;
}

const FieldTypes = [
  { type: "string" as FieldType, icon: "📝", label: "Text Input" },
  { type: "number" as FieldType, icon: "🔢", label: "Number Input" },
  { type: "boolean" as FieldType, icon: "☑️", label: "Checkbox" },
  { type: "select" as FieldType, icon: "📋", label: "Select Dropdown" },
  { type: "textarea" as FieldType, icon: "📄", label: "Text Area" },
];

export default function AddFieldsPanel({ onAddField }: AddFieldsPanelProps) {
  return (
    <Stack spacing={1.5}>
      {FieldTypes.map(({ type, icon, label }) => (
        <FieldTypeButton key={type} icon={icon} label={label} onClick={() => onAddField(type)} />
      ))}
    </Stack>
  );
}
