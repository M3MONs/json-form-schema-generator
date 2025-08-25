import { Card, CardContent, Typography, Box, Divider, Tabs, Tab } from "@mui/material";
import FieldSettingsForm from "../molecules/FieldSettingsForm";
import SchemaOutput from "../molecules/SchemaOutput";
import type { Field } from "../../types/field";

interface FieldEditorProps {
  selectedField: Field | null;
  activeTab: number;
  jsonSchema: any;
  uiSchema: any;
  onUpdateField: (patch: Partial<Field>) => void;
  onTabChange: (newValue: number) => void;
  onCopySchema: (isJsonSchema: boolean) => void;
  onSaveSchema: (isJsonSchema: boolean) => void;
}

const CardStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  borderRadius: 3,
};

const FieldSettingsFormStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  overflow: "auto",
  px: 3,
  pb: 2,
  flex: 1,
  minHeight: 0,
};

const SelectFieldStyles = {
  textAlign: "center",
  py: 4,
  color: "text.secondary",
};

const TabsStyles = {
  minHeight: 40,
  "& .MuiTab-root": {
    minHeight: 40,
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
  },
};

export default function FieldEditor({
  selectedField,
  activeTab,
  jsonSchema,
  uiSchema,
  onUpdateField,
  onTabChange,
  onCopySchema,
  onSaveSchema,
}: FieldEditorProps) {
  return (
    <Card sx={CardStyles}>
      <Box sx={{ height: "50%", display: "flex", flexDirection: "column", overflow: "hidden", flex: "0 0 50%" }}>
        <CardContent sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
            ⚙️ Field Settings
          </Typography>
        </CardContent>

        <Box sx={FieldSettingsFormStyles}>
          {selectedField === null ? (
            <Box sx={SelectFieldStyles}>
              <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>
                ⚡
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Select a field to edit
              </Typography>
              <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                Click on any field from the list
              </Typography>
            </Box>
          ) : (
            <FieldSettingsForm field={selectedField} onUpdate={onUpdateField} />
          )}
        </Box>
      </Box>

      <Divider />

      <Box sx={{ height: "50%", display: "flex", flexDirection: "column", overflow: "hidden", flex: "0 0 50%" }}>
        <Box sx={{ p: 2 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => onTabChange(newValue)} sx={TabsStyles}>
            <Tab label="📋 JSON Schema" />
            <Tab label="🎨 UI Schema" />
          </Tabs>
        </Box>

        <Box sx={{ m: 2, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <SchemaOutput
            content={activeTab === 0 ? JSON.stringify(jsonSchema, null, 2) : JSON.stringify(uiSchema, null, 2)}
            onCopy={() => onCopySchema(activeTab === 0)}
            onSave={() => onSaveSchema(activeTab === 0)}
          />
        </Box>
      </Box>
    </Card>
  );
}
