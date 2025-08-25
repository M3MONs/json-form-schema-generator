import { Chip } from "@mui/material";

interface FieldChipProps {
  type: string;
  variant?: "filled" | "outlined";
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium";
}

const FieldChipStyles = (size: "small" | "medium") => ({
  height: size === "small" ? 20 : 24,
  fontSize: size === "small" ? "0.7rem" : "0.75rem",
  textTransform: "capitalize",
});

export default function FieldChip({ type, variant = "outlined", color = "default", size = "small" }: FieldChipProps) {
  return <Chip component="span" label={type} size={size} variant={variant} color={color} sx={FieldChipStyles(size)} />;
}
