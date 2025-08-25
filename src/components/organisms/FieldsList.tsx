import { Card, CardContent, Stack, Typography, Chip, Divider, List, Box } from "@mui/material";
import AddFieldsPanel from "../molecules/AddFieldsPanel";
import FieldListItem from "../molecules/FieldListItem";
import type { Field, FieldType } from "../../types/field";

interface FieldsListProps {
  fields: Field[];
  selectedIndex: number | null;
  onAddField: (type: FieldType) => void;
  onSelectField: (index: number) => void;
  onMoveFieldUp: (index: number) => void;
  onMoveFieldDown: (index: number) => void;
  onRemoveField: (index: number) => void;
}

const FieldsListStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  borderRadius: 3
};

export default function FieldsList({ 
  fields, 
  selectedIndex, 
  onAddField, 
  onSelectField, 
  onMoveFieldUp, 
  onMoveFieldDown, 
  onRemoveField 
}: FieldsListProps) {
  return (
    <Card sx={FieldsListStyles}>
      <CardContent sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Add Fields
          </Typography>
          <Chip 
            label={fields.length} 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ minWidth: 40, height: 24 }}
          />
        </Stack>

        <AddFieldsPanel onAddField={onAddField} />
      </CardContent>

      <Divider />

      <Box sx={{ p: 2, pt: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
          Form Fields
        </Typography>
      </Box>

      <List sx={{ overflow: "auto", flex: 1, minHeight: 0, px: 1 }}>
        {fields.map((field, index) => (
          <FieldListItem
            key={field.id}
            field={field}
            index={index}
            totalFields={fields.length}
            isSelected={selectedIndex === index}
            onSelect={onSelectField}
            onMoveUp={onMoveFieldUp}
            onMoveDown={onMoveFieldDown}
            onRemove={onRemoveField}
          />
        ))}
      </List>
    </Card>
  );
}
