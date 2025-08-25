import { Button, alpha } from "@mui/material";

interface FieldTypeButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const FieldTypeButtonStyles = {
  justifyContent: "flex-start",
  borderRadius: 2,
  py: 1.5,
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    bgcolor: alpha("#1976d2", 0.04),
    borderColor: "primary.main",
  },
};

export default function FieldTypeButton({ icon, label, onClick }: FieldTypeButtonProps) {
  return (
    <Button variant="outlined" onClick={onClick} sx={FieldTypeButtonStyles}>
      {icon} {label}
    </Button>
  );
}
