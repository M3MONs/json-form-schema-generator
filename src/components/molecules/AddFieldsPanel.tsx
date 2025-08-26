import { Stack, useMediaQuery, useTheme, Grid } from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {isMobile ? (
        <Grid container spacing={1}>
          {FieldTypes.map(({ type, icon, label }) => (
            <Grid key={type} size={6}>
              <FieldTypeButton icon={icon} label={label} onClick={() => onAddField(type)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={1.5}>
          {FieldTypes.map(({ type, icon, label }) => (
            <FieldTypeButton key={type} icon={icon} label={label} onClick={() => onAddField(type)} />
          ))}
        </Stack>
      )}
    </>
  );
}
