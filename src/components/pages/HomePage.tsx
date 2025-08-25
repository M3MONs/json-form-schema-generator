import { useState, type JSX } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

type FieldType = "string" | "number" | "boolean" | "select" | "textarea";

interface Field {
  id: string;
  type: FieldType;
  name: string;
  title: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: string | number | boolean;
  minimum?: number;
  maximum?: number;
  // UI Schema properties
  widget?: string;
  description?: string;
  help?: string;
  rows?: number;
  inline?: boolean;
  disabled?: boolean;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function defaultField(type: FieldType): Field {
  const id = uid();
  return {
    id,
    type,
    name: `${type}_${id}`,
    title:
      type === "textarea"
        ? "Text area"
        : type === "select"
        ? "Select field"
        : `${type.charAt(0).toUpperCase() + type.slice(1)} field`,
    required: false,
  options: type === "select" ? ["Option 1", "Option 2"] : undefined,
  placeholder: type === "textarea" || type === "string" ? "" : undefined,
  defaultValue: type === "boolean" ? false : undefined,
  minimum: type === "number" ? undefined : undefined,
  maximum: type === "number" ? undefined : undefined,
  };
}

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

  return (
    <Box sx={{ p: 2, height: "100vh", display: "flex", flexDirection: "column", overflow: 'hidden' }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
        <img src="/json.svg" alt="JSON icon" style={{ width: 36, height: 36 }} />
        <Typography variant="h5" component="h1">
          JSON FORM SCHEMA GENERATOR
        </Typography>
      </Box>
  <Grid container spacing={2} sx={{ flex: 1, minHeight: 0, overflow: 'hidden', height: 'calc(100vh - 96px)' }}>
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", overflow: 'hidden', boxSizing: 'border-box' }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Add field</Typography>
              <Typography variant="caption">{fields.length}</Typography>
            </Box>

            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Button variant="outlined" onClick={() => addField("string")}>
                Text
              </Button>
              <Button variant="outlined" onClick={() => addField("number")}>
                Number
              </Button>
              <Button variant="outlined" onClick={() => addField("boolean")}>
                Checkbox
              </Button>
              <Button variant="outlined" onClick={() => addField("select")}>
                Select
              </Button>
              <Button variant="outlined" onClick={() => addField("textarea")}>
                Textarea
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List sx={{ overflow: "auto", flex: 1, minHeight: 0 }}>
              {fields.map((f, i) => (
                <ListItem
                  key={f.id}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveFieldUpAt(i);
                        }}
                        aria-label="move-up"
                        disabled={i === 0}
                        title={i === 0 ? "Can't move up" : 'Move up'}
                      >
                        ▲
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveFieldDownAt(i);
                        }}
                        aria-label="move-down"
                        disabled={i === fields.length - 1}
                        title={i === fields.length - 1 ? "Can't move down" : 'Move down'}
                      >
                        ▼
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFieldAt(i);
                        }}
                        aria-label="remove"
                      >
                        ✕
                      </IconButton>
                    </>
                  }
                  onClick={() => setSelected(i)}
                >
                  <ListItemText primary={f.title} secondary={f.type} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", overflow: 'hidden' }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Form preview</Typography>
              <Typography variant="caption">RJSF + MUI</Typography>
            </Box>

            {fields.length === 0 ? (
              <Box sx={{ mt: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography color="text.secondary">Add a field, then select it to start editing the form.</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ mt: 2, flex: 1, overflow: "auto", minHeight: 0 }}>
                  <Form
                    key={fields.map((f) => f.id).join(",")}
                    schema={toJSONSchema().schema}
                    uiSchema={toJSONSchema().uiSchema}
                    validator={validator}
                    onSubmit={({ formData }) => {
                      alert(JSON.stringify(formData, null, 2));
                    }}
                  >
                    <div /> {/* Empty div to prevent RJSF from rendering its own submit button */}
                  </Form>
                </Box>
                <Box sx={{ mt: 2, flexShrink: 0, display: "flex", gap: 1 }}>
                  <Button 
                    variant="contained"
                    onClick={() => {
                      // Trigger form submission programmatically
                      const form = document.querySelector('form');
                      if (form) {
                        const formData = new FormData(form);
                        const data: any = {};
                        formData.forEach((value, key) => {
                          data[key] = value;
                        });
                        alert(JSON.stringify(data, null, 2));
                      }
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFields([]);
                      setSelected(null);
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", overflow: 'hidden' }}>
            {/* split the Paper into two equal halves; each half scrolls if content overflows */}
            <Box sx={{ height: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: '0 0 50%' }}>
              <Typography variant="h6" sx={{ flexShrink: 0 }}>Field settings</Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto', pr: 1, pt: 2, pb: 1, flex: 1, minHeight: 0 }}>
                <Box sx={{ mt: 1 }}>
                {selected === null ? (
                  <Typography sx={{ mt: 2 }} color="text.secondary">
                    Select a field to edit
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      label="Title"
                      value={fields[selected]?.title || ""}
                      onChange={(e) => updateFieldAt(selected, { title: e.target.value })}
                      size="small"
                    />
                    <TextField
                      label="Name"
                      value={fields[selected]?.name || ""}
                      onChange={(e) => updateFieldAt(selected, { name: e.target.value })}
                      size="small"
                    />
                    
                    <TextField
                      label="Description"
                      value={fields[selected]?.description || ""}
                      onChange={(e) => updateFieldAt(selected, { description: e.target.value })}
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Field description (optional)"
                    />
                    
                    <TextField
                      label="Help text"
                      value={fields[selected]?.help || ""}
                      onChange={(e) => updateFieldAt(selected, { help: e.target.value })}
                      size="small"
                      placeholder="Help text shown below field (optional)"
                    />

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Select
                        value={fields[selected]?.type || "string"}
                        onChange={(e) => {
                          const newType = e.target.value as FieldType;
                          const cur = fields[selected]!;
                          const patch: Partial<Field> = { type: newType };
                          if (newType === "select" && !cur.options) patch.options = ["Option 1"];
                          if (newType !== "select") patch.options = undefined;
                          // Reset widget when type changes
                          patch.widget = undefined;
                          updateFieldAt(selected, patch);
                        }}
                        size="small"
                        fullWidth
                      >
                        <MenuItem value="string">text</MenuItem>
                        <MenuItem value="number">number</MenuItem>
                        <MenuItem value="boolean">checkbox</MenuItem>
                        <MenuItem value="select">select</MenuItem>
                        <MenuItem value="textarea">textarea</MenuItem>
                      </Select>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!fields[selected]?.required}
                            onChange={(e) => updateFieldAt(selected, { required: e.target.checked })}
                          />
                        }
                        label="Required"
                      />
                    </Box>
                    
                    {/* Widget selector */}
                    {(fields[selected]?.type === "boolean" || fields[selected]?.type === "select") && (
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Typography variant="body2" sx={{ minWidth: "60px" }}>Widget:</Typography>
                        <Select
                          value={fields[selected]?.widget || "default"}
                          onChange={(e) => updateFieldAt(selected, { widget: e.target.value === "default" ? undefined : e.target.value })}
                          size="small"
                          fullWidth
                        >
                          <MenuItem value="default">Default</MenuItem>
                          {fields[selected]?.type === "boolean" && <MenuItem value="radio">Radio</MenuItem>}
                          {fields[selected]?.type === "select" && <MenuItem value="radio">Radio</MenuItem>}
                        </Select>
                      </Box>
                    )}
                    
                    {/* Additional UI options */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {(fields[selected]?.widget === "radio" || (fields[selected]?.type === "boolean" && fields[selected]?.widget !== "radio")) && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!fields[selected]?.inline}
                              onChange={(e) => updateFieldAt(selected, { inline: e.target.checked })}
                            />
                          }
                          label="Display inline"
                        />
                      )}
                      
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!fields[selected]?.disabled}
                            onChange={(e) => updateFieldAt(selected, { disabled: e.target.checked })}
                          />
                        }
                        label="Disabled"
                      />
                    </Box>

                    {fields[selected]?.type === "select" && (
                      <TextField
                        label="Options (comma separated)"
                        value={(fields[selected].options || []).join(",")}
                        onChange={(e) =>
                          updateFieldAt(selected, {
                            options: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        size="small"
                        multiline
                        rows={3}
                        maxRows={6}
                        fullWidth
                      />
                    )}
                    {fields[selected]?.type === "string" && (
                      <TextField
                        label="Placeholder / Default"
                        value={(fields[selected].defaultValue as string) || fields[selected].placeholder || ""}
                        onChange={(e) => updateFieldAt(selected, { defaultValue: e.target.value, placeholder: e.target.value })}
                        size="small"
                      />
                    )}

                    {fields[selected]?.type === "textarea" && (
                      <>
                        <TextField
                          label="Placeholder / Default"
                          value={(fields[selected].defaultValue as string) || fields[selected].placeholder || ""}
                          onChange={(e) => updateFieldAt(selected, { defaultValue: e.target.value, placeholder: e.target.value })}
                          size="small"
                          multiline
                          rows={3}
                          maxRows={6}
                          fullWidth
                        />
                        <TextField
                          label="Rows"
                          type="number"
                          value={fields[selected].rows ?? 3}
                          onChange={(e) => updateFieldAt(selected, { rows: Number(e.target.value) || 3 })}
                          size="small"
                          inputProps={{ min: 1, max: 20 }}
                        />
                      </>
                    )}

                    {fields[selected]?.type === "number" && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          label="Minimum"
                          type="number"
                          value={fields[selected].minimum ?? ''}
                          onChange={(e) => updateFieldAt(selected, { minimum: e.target.value === '' ? undefined : Number(e.target.value) })}
                          size="small"
                        />
                        <TextField
                          label="Maximum"
                          type="number"
                          value={fields[selected].maximum ?? ''}
                          onChange={(e) => updateFieldAt(selected, { maximum: e.target.value === '' ? undefined : Number(e.target.value) })}
                          size="small"
                        />
                        <TextField
                          label="Default"
                          type="number"
                          value={fields[selected].defaultValue ?? ''}
                          onChange={(e) => updateFieldAt(selected, { defaultValue: e.target.value === '' ? undefined : Number(e.target.value) })}
                          size="small"
                        />
                      </Box>
                    )}

                    {fields[selected]?.type === "boolean" && (
                      <FormControlLabel
                        control={<Checkbox checked={!!fields[selected].defaultValue} onChange={(e) => updateFieldAt(selected, { defaultValue: e.target.checked })} />}
                        label="Default checked"
                      />
                    )}

                    {fields[selected]?.type === "select" && (
                      <TextField
                        label="Default option"
                        value={(fields[selected].defaultValue as string) || ""}
                        onChange={(e) => updateFieldAt(selected, { defaultValue: e.target.value })}
                        size="small"
                        fullWidth
                      />
                    )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ height: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: '0 0 50%' }}>
              <Tabs 
                value={activeTab} 
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ flexShrink: 0, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="JSON Schema" />
                <Tab label="UI Schema" />
              </Tabs>
              
              {activeTab === 0 && (
                <Paper sx={{ mt: 1, p: 1, bgcolor: "grey.900", color: "grey.50", overflow: "auto", flex: 1, minHeight: 0 }}>
                  <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(toJSONSchema().schema, null, 2)}</pre>
                </Paper>
              )}
              
              {activeTab === 1 && (
                <Paper sx={{ mt: 1, p: 1, bgcolor: "grey.900", color: "grey.50", overflow: "auto", flex: 1, minHeight: 0 }}>
                  <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(toJSONSchema().uiSchema, null, 2)}</pre>
                </Paper>
              )}

              <Box sx={{ display: "flex", gap: 1, mt: 1, flexShrink: 0 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    const content = activeTab === 0 
                      ? JSON.stringify(toJSONSchema().schema, null, 2)
                      : JSON.stringify(toJSONSchema().uiSchema, null, 2);
                    navigator.clipboard?.writeText(content);
                  }}
                >
                  Copy
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const content = activeTab === 0 
                      ? JSON.stringify(toJSONSchema().schema, null, 2)
                      : JSON.stringify(toJSONSchema().uiSchema, null, 2);
                    const filename = activeTab === 0 ? "schema.json" : "uiSchema.json";
                    const blob = new Blob([content], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
