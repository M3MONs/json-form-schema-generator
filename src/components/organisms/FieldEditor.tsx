import { Card, CardContent, Typography, Box, Divider, Tabs, Tab } from "@mui/material";
import { useState, useEffect, useRef } from "react";
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

const ArrowStyles = {
  position: "absolute",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 20,
  backgroundColor: "background.paper",
  borderRadius: "12px 12px 0 0",
  boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
  border: "1px solid",
  borderColor: "divider",
  borderBottom: "none",
  zIndex: 10,
  animation: "bounce 2s infinite",
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateX(-50%) translateY(0)",
    },
    "40%": {
      transform: "translateX(-50%) translateY(-3px)",
    },
    "60%": {
      transform: "translateX(-50%) translateY(-2px)",
    },
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
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const element = scrollContainerRef.current;
        const isScrollable = element.scrollHeight > element.clientHeight;
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;

        // Show arrow if there's scrollable content and user is not at the very bottom
        const isNotAtBottom = scrollTop < scrollHeight - clientHeight - 10;
        setHasMoreContent(isScrollable && isNotAtBottom);
      }
    };

    checkScrollable();

    const timeoutId1 = setTimeout(checkScrollable, 100);
    const timeoutId2 = setTimeout(checkScrollable, 300);

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollable);
      window.addEventListener("resize", checkScrollable);
      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        scrollContainer.removeEventListener("scroll", checkScrollable);
        window.removeEventListener("resize", checkScrollable);
      };
    }

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, [selectedField]);

  return (
    <Card sx={CardStyles}>
      <Box
        sx={{
          height: "50%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: "0 0 50%",
          position: "relative",
        }}
      >
        <CardContent sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
            ⚙️ Field Settings
          </Typography>
        </CardContent>

        <Box sx={FieldSettingsFormStyles} ref={scrollContainerRef}>
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

        {hasMoreContent && (
          <Box sx={ArrowStyles}>
            <Typography variant="caption" sx={{ fontSize: "14px", lineHeight: 1 }}>
              ⬇️
            </Typography>
          </Box>
        )}
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
