import { Stack, Button } from "@mui/material";
import SchemaCodeBlock from "../atoms/SchemaCodeBlock";

interface SchemaOutputProps {
  content: string;
  onCopy: () => void;
  onSave: () => void;
}

const ButtonStyles = {
  borderRadius: 2,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.75rem",
};

export default function SchemaOutput({ content, onCopy, onSave }: SchemaOutputProps) {
  return (
    <>
      <SchemaCodeBlock content={content} />
      <Stack direction="row" spacing={1} sx={{ p: 2, pt: 1 }}>
        <Button variant="contained" size="small" onClick={onCopy} sx={ButtonStyles}>
          📋 Copy
        </Button>
        <Button variant="outlined" size="small" onClick={onSave} sx={ButtonStyles}>
          💾 Save
        </Button>
      </Stack>
    </>
  );
}
