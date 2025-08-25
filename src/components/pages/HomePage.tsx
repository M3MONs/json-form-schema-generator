import { useState, type JSX } from "react";
import { Box, Grid } from "@mui/material";
import Header from "../organisms/Header";
import FieldsList from "../organisms/FieldsList";
import FormPreview from "../organisms/FormPreview";
import FieldEditor from "../organisms/FieldEditor";
import type { Field, FieldType } from "../../types/field";
import { defaultField } from "../../utils/utils";

export default function HomePage(): JSX.Element {
  const [fields, setFields] = useState<Field[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  function addField(type: FieldType) {
    setFields((prev) => {
      const next = [...prev, defaultField(type)];
      setSelected(next.length - 1);
      return next;
    });
  }

  function updateFieldAt(index: number, patch: Partial<Field>) {
    setFields((s) => s.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function removeFieldAt(index: number) {
    setFields((s) => s.filter((_, i) => i !== index));
    setSelected((p) => (p === null ? null : p === index ? null : p > index ? p - 1 : p));
  }

  function moveFieldUpAt(index: number) {
    if (index <= 0) return;
    setFields((prev) => {
      const next = [...prev];
      const tmp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = tmp;
      return next;
    });
    setSelected((s) => {
      if (s === null) return null;
      if (s === index) return index - 1;
      if (s === index - 1) return index;
      return s;
    });
  }

  function moveFieldDownAt(index: number) {
    setFields((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      const tmp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = tmp;
      return next;
    });
    setSelected((s) => {
      if (s === null) return null;
      if (s === index) return index + 1;
      if (s === index + 1) return index;
      return s;
    });
  }

  function toJSONSchema() {
    const schema: any = { type: "object", properties: {}, required: [] as string[] };
    const uiSchema: any = {};

    fields.forEach((f) => {
      let prop: any = {};
      let uiConfig: any = {};

      switch (f.type) {
        case "string":
          prop = { type: "string", title: f.title };
          if (f.placeholder) prop.default = f.placeholder;
          if (f.defaultValue && typeof f.defaultValue === "string") prop.default = f.defaultValue;
          if (f.description) prop.description = f.description;
          break;
        case "textarea":
          prop = { type: "string", title: f.title };
          if (f.placeholder) prop.default = f.placeholder;
          if (f.defaultValue && typeof f.defaultValue === "string") prop.default = f.defaultValue;
          if (f.description) prop.description = f.description;
          uiConfig["ui:widget"] = f.widget || "textarea";
          if (f.rows) uiConfig["ui:options"] = { rows: f.rows };
          break;
        case "number":
          prop = { type: "number", title: f.title };
          if (typeof f.minimum === "number") prop.minimum = f.minimum;
          if (typeof f.maximum === "number") prop.maximum = f.maximum;
          if (typeof f.defaultValue === "number") prop.default = f.defaultValue;
          if (f.description) prop.description = f.description;
          break;
        case "boolean":
          prop = { type: "boolean", title: f.title };
          if (typeof f.defaultValue === "boolean") prop.default = f.defaultValue;
          if (f.description) prop.description = f.description;
          if (f.widget === "radio") {
            uiConfig["ui:widget"] = "radio";
          } else if (f.inline) {
            uiConfig["ui:options"] = { inline: true };
          }
          break;
        case "select":
          prop = { type: "string", title: f.title, enum: f.options || [] };
          if (f.defaultValue && typeof f.defaultValue === "string") prop.default = f.defaultValue;
          if (f.description) prop.description = f.description;
          if (f.widget === "radio") {
            uiConfig["ui:widget"] = "radio";
            if (f.inline) uiConfig["ui:options"] = { inline: true };
          }
          break;
        default:
          prop = { type: "string", title: f.title };
      }

      // Common UI properties
      if (f.placeholder && !prop.default) {
        uiConfig["ui:placeholder"] = f.placeholder;
      }
      if (f.help) {
        uiConfig["ui:help"] = f.help;
      }
      if (f.disabled) {
        uiConfig["ui:disabled"] = true;
      }

      schema.properties[f.name] = prop;
      if (Object.keys(uiConfig).length > 0) {
        uiSchema[f.name] = uiConfig;
      }
      if (f.required) schema.required.push(f.name);
    });

    if (schema.required.length === 0) delete schema.required;
    return { schema, uiSchema };
  }

  const handleCopySchema = (isJsonSchema: boolean) => {
    const content = isJsonSchema
      ? JSON.stringify(toJSONSchema().schema, null, 2)
      : JSON.stringify(toJSONSchema().uiSchema, null, 2);
    navigator.clipboard?.writeText(content);
  };

  const handleSaveSchema = (isJsonSchema: boolean) => {
    const content = isJsonSchema
      ? JSON.stringify(toJSONSchema().schema, null, 2)
      : JSON.stringify(toJSONSchema().uiSchema, null, 2);
    const filename = isJsonSchema ? "schema.json" : "uiSchema.json";
    const blob = new Blob([content], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    setFields([]);
    setSelected(null);
  };

  const { schema, uiSchema } = toJSONSchema();

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#fafafa" }}>
      <Header
        title="JSON Schema Generator"
        subtitle="Build forms with visual editor • Export JSON Schema & UI Schema"
        iconPath="/json.svg"
      />

      <Grid container spacing={3} sx={{ flex: 1, minHeight: 0, overflow: "hidden", p: 3, pt: 2 }}>
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%" }}>
          <FieldsList
            fields={fields}
            selectedIndex={selected}
            onAddField={addField}
            onSelectField={setSelected}
            onMoveFieldUp={moveFieldUpAt}
            onMoveFieldDown={moveFieldDownAt}
            onRemoveField={removeFieldAt}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%" }}>
          <FormPreview fieldsCount={fields.length} schema={schema} uiSchema={uiSchema} onClearAll={handleClearAll} />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", flexDirection: "column", minHeight: 0, height: "100%" }}>
          <FieldEditor
            selectedField={selected !== null ? fields[selected] : null}
            activeTab={activeTab}
            jsonSchema={schema}
            uiSchema={uiSchema}
            onUpdateField={(patch) => selected !== null && updateFieldAt(selected, patch)}
            onTabChange={setActiveTab}
            onCopySchema={handleCopySchema}
            onSaveSchema={handleSaveSchema}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
