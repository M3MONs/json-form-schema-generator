import { Stack, TextField, Select, MenuItem, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import type { Field, FieldType } from "../../types/field";

interface FieldSettingsFormProps {
  field: Field;
  onUpdate: (patch: Partial<Field>) => void;
}

export default function FieldSettingsForm({ field, onUpdate }: FieldSettingsFormProps) {
  const [optionsText, setOptionsText] = useState("");

  // Update local state when field changes
  useEffect(() => {
    setOptionsText((field.options || []).join(", "));
  }, [field.options]);

  const handleSelectChange = (e: any) => {
    const newType = e.target.value as FieldType;
    const patch: Partial<Field> = { type: newType };
    if (newType === "select" && !field.options) patch.options = ["Option 1"];
    if (newType !== "select") patch.options = undefined;
    patch.widget = undefined;
    onUpdate(patch);
  };

  return (
    <Stack spacing={2.5} paddingTop={1}>
      <TextField
        label="Field Title"
        value={field?.title || ""}
        onChange={(e) => onUpdate({ title: e.target.value })}
        size="small"
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Field Name"
        value={field?.name || ""}
        onChange={(e) => onUpdate({ name: e.target.value })}
        size="small"
        variant="outlined"
        fullWidth
      />

      <TextField
        label="Description"
        value={field?.description || ""}
        onChange={(e) => onUpdate({ description: e.target.value })}
        size="small"
        multiline
        rows={2}
        placeholder="Field description (optional)"
        fullWidth
      />

      <TextField
        label="Help Text"
        value={field?.help || ""}
        onChange={(e) => onUpdate({ help: e.target.value })}
        size="small"
        placeholder="Help text shown below field"
        fullWidth
      />

      <Stack direction="row" spacing={2} alignItems="center">
        <Select value={field?.type || "string"} onChange={handleSelectChange} size="small" sx={{ minWidth: 120 }}>
          <MenuItem value="string">📝 Text</MenuItem>
          <MenuItem value="number">🔢 Number</MenuItem>
          <MenuItem value="boolean">☑️ Boolean</MenuItem>
          <MenuItem value="select">📋 Select</MenuItem>
          <MenuItem value="textarea">📄 Textarea</MenuItem>
        </Select>

        <FormControlLabel
          control={<Checkbox checked={!!field?.required} onChange={(e) => onUpdate({ required: e.target.checked })} />}
          label="Required"
        />
      </Stack>

      {/* Widget selector */}
      {(field?.type === "boolean" || field?.type === "select") && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ minWidth: "60px", fontWeight: 500 }}>
            Widget:
          </Typography>
          <Select
            value={field?.widget || "default"}
            onChange={(e) => onUpdate({ widget: e.target.value === "default" ? undefined : e.target.value })}
            size="small"
            fullWidth
          >
            <MenuItem value="default">Default</MenuItem>
            {field?.type === "boolean" && <MenuItem value="radio">Radio</MenuItem>}
            {field?.type === "select" && <MenuItem value="radio">Radio</MenuItem>}
          </Select>
        </Stack>
      )}

      {/* Additional UI options */}
      <Stack spacing={1}>
        {(field?.widget === "radio" || (field?.type === "boolean" && field?.widget !== "radio")) && (
          <FormControlLabel
            control={<Checkbox checked={!!field?.inline} onChange={(e) => onUpdate({ inline: e.target.checked })} />}
            label="Display inline"
          />
        )}

        <FormControlLabel
          control={<Checkbox checked={!!field?.disabled} onChange={(e) => onUpdate({ disabled: e.target.checked })} />}
          label="Disabled"
        />
      </Stack>

      {/* Type-specific fields */}
      {field?.type === "select" && (
        <TextField
          label="Options (comma separated)"
          value={optionsText}
          onChange={(e) => {
            setOptionsText(e.target.value);
          }}
          onBlur={() => {
            const newOptions = optionsText
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
            onUpdate({
              options: newOptions,
            });
          }}
          size="small"
          multiline
          rows={3}
          fullWidth
        />
      )}

      {field?.type === "string" && (
        <TextField
          label="Placeholder / Default"
          value={(field.defaultValue as string) || field.placeholder || ""}
          onChange={(e) => onUpdate({ defaultValue: e.target.value, placeholder: e.target.value })}
          size="small"
          fullWidth
        />
      )}

      {field?.type === "textarea" && (
        <Stack spacing={2}>
          <TextField
            label="Placeholder / Default"
            value={(field.defaultValue as string) || field.placeholder || ""}
            onChange={(e) => onUpdate({ defaultValue: e.target.value, placeholder: e.target.value })}
            size="small"
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Rows"
            type="number"
            value={field.rows ?? 3}
            onChange={(e) => onUpdate({ rows: Number(e.target.value) || 3 })}
            size="small"
            inputProps={{ min: 1, max: 20 }}
            sx={{ maxWidth: 100 }}
          />
        </Stack>
      )}

      {field?.type === "number" && (
        <Stack direction="row" spacing={1}>
          <TextField
            label="Min"
            type="number"
            value={field.minimum ?? ""}
            onChange={(e) => onUpdate({ minimum: e.target.value === "" ? undefined : Number(e.target.value) })}
            size="small"
          />
          <TextField
            label="Max"
            type="number"
            value={field.maximum ?? ""}
            onChange={(e) => onUpdate({ maximum: e.target.value === "" ? undefined : Number(e.target.value) })}
            size="small"
          />
          <TextField
            label="Default"
            type="number"
            value={field.defaultValue ?? ""}
            onChange={(e) => onUpdate({ defaultValue: e.target.value === "" ? undefined : Number(e.target.value) })}
            size="small"
          />
        </Stack>
      )}

      {field?.type === "boolean" && (
        <FormControlLabel
          control={
            <Checkbox checked={!!field.defaultValue} onChange={(e) => onUpdate({ defaultValue: e.target.checked })} />
          }
          label="Default checked"
        />
      )}

      {field?.type === "select" && (
        <TextField
          label="Default option"
          value={(field.defaultValue as string) || ""}
          onChange={(e) => onUpdate({ defaultValue: e.target.value })}
          size="small"
          fullWidth
        />
      )}
    </Stack>
  );
}
