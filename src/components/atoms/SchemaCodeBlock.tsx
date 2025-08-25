import { Paper } from "@mui/material";

interface SchemaCodeBlockProps {
  content: string;
}

const SchemaCodeBlockStyles = {
  p: 2,
  bgcolor: "grey.900",
  color: "grey.50",
  overflow: "auto",
  flex: 1,
  borderRadius: 2,
  fontFamily: "monospace",
};

export default function SchemaCodeBlock({ content }: SchemaCodeBlockProps) {
  return (
    <Paper sx={SchemaCodeBlockStyles}>
      <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.4 }}>{content}</pre>
    </Paper>
  );
}
