import { Button, alpha, useMediaQuery, useTheme } from "@mui/material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const mobileStyles = {
    ...FieldTypeButtonStyles,
    minHeight: 44,
    fontSize: '0.875rem',
    px: 1,
    py: 1.5,
  };

  return (
    <Button 
      variant="outlined" 
      onClick={onClick} 
      sx={isMobile ? mobileStyles : FieldTypeButtonStyles}
      fullWidth
    >
      {icon} {label}
    </Button>
  );
}
