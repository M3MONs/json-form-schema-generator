import { IconButton, Stack, Tooltip, alpha } from "@mui/material";

interface FieldControlsProps {
  index: number;
  totalFields: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
}

const IconButtonStyles = {
  width: 28,
  height: 28,
  "&:disabled": { opacity: 0.3 },
};

const IconButtonRemoveStyles = {
  width: 28,
  height: 28,
  color: "error.main",
  "&:hover": { bgcolor: alpha("#d32f2f", 0.1) },
};

export default function FieldControls({ index, totalFields, onMoveUp, onMoveDown, onRemove }: FieldControlsProps) {
  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveUp(index);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveDown(index);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(index);
  };

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title={index === 0 ? "Can't move up" : "Move up"}>
        <IconButton size="small" onClick={handleMoveUp} disabled={index === 0} sx={IconButtonStyles}>
          ⬆️
        </IconButton>
      </Tooltip>
      <Tooltip title={index === totalFields - 1 ? "Can't move down" : "Move down"}>
        <IconButton size="small" onClick={handleMoveDown} disabled={index === totalFields - 1} sx={IconButtonStyles}>
          ⬇️
        </IconButton>
      </Tooltip>
      <Tooltip title="Remove field">
        <IconButton size="small" onClick={handleRemove} sx={IconButtonRemoveStyles}>
          🗑️
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
