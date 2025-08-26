import { ListItem, ListItemText, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import FieldChip from "../atoms/FieldChip";
import FieldControls from "./FieldControls";
import type { Field } from "../../types/field";

interface FieldListItemProps {
  field: Field;
  index: number;
  totalFields: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
}

const ListItemStyles = (isSelected: boolean, isMobile: boolean) => ({
  borderRadius: 2,
  mb: 0.5,
  minHeight: isMobile ? 56 : 'auto',
  bgcolor: isSelected ? alpha("#1976d2", 0.08) : "transparent",
  border: isSelected ? "1px solid" : "1px solid transparent",
  borderColor: isSelected ? alpha("#1976d2", 0.3) : "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    bgcolor: alpha("#1976d2", 0.04),
    borderColor: alpha("#1976d2", 0.2),
  },
});

export default function FieldListItem({
  field,
  index,
  totalFields,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
}: FieldListItemProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ListItem
      sx={ListItemStyles(isSelected, isMobile)}
      secondaryAction={
        <FieldControls
          index={index}
          totalFields={totalFields}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onRemove={onRemove}
        />
      }
      onClick={() => onSelect(index)}
    >
      <ListItemText
        primary={
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
            {field.title}
          </Typography>
        }
        secondary={<FieldChip type={field.type} />}
      />
    </ListItem>
  );
}
