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
  Chip,
  Tooltip,
  Card,
  CardContent,
  Stack,
  alpha,
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
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: 'hidden', bgcolor: '#fafafa' }}>
      {/* Modern Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 3,
        px: 2,
        borderRadius: '0 0 24px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: alpha('#ffffff', 0.1)
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: alpha('#ffffff', 0.05)
        }} />
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: '12px',
            bgcolor: alpha('#ffffff', 0.2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <img src="/json.svg" alt="JSON icon" style={{ width: 32, height: 32, filter: 'brightness(0) invert(1)' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              JSON Schema Generator
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              opacity: 0.9,
              fontWeight: 400,
              mt: 0.5
            }}>
              Build forms with visual editor • Export JSON Schema & UI Schema
            </Typography>
          </Box>
        </Stack>
      </Box>
  <Grid container spacing={3} sx={{ flex: 1, minHeight: 0, overflow: 'hidden', p: 3, pt: 2 }}>
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Card sx={{ 
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 3, pb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Add Fields
                </Typography>
                <Chip 
                  label={fields.length} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ minWidth: 40, height: 24 }}
                />
              </Stack>

              <Stack spacing={1.5}>
                <Button 
                  variant="outlined" 
                  onClick={() => addField("string")}
                  sx={{ 
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: alpha('#1976d2', 0.04),
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  📝 Text Input
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => addField("number")}
                  sx={{ 
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: alpha('#1976d2', 0.04),
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  🔢 Number Input
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => addField("boolean")}
                  sx={{ 
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: alpha('#1976d2', 0.04),
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  ☑️ Checkbox
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => addField("select")}
                  sx={{ 
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: alpha('#1976d2', 0.04),
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  📋 Select Dropdown
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => addField("textarea")}
                  sx={{ 
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: alpha('#1976d2', 0.04),
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  📄 Text Area
                </Button>
              </Stack>
            </CardContent>

            <Divider />

            <Box sx={{ p: 2, pt: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                Form Fields
              </Typography>
            </Box>

            <List sx={{ overflow: "auto", flex: 1, minHeight: 0, px: 1 }}>
              {fields.map((f, i) => (
                <ListItem
                  key={f.id}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: selected === i ? alpha('#1976d2', 0.08) : 'transparent',
                    border: selected === i ? '1px solid' : '1px solid transparent',
                    borderColor: selected === i ? alpha('#1976d2', 0.3) : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha('#1976d2', 0.04),
                      borderColor: alpha('#1976d2', 0.2)
                    }
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title={i === 0 ? "Can't move up" : "Move up"}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFieldUpAt(i);
                          }}
                          disabled={i === 0}
                          sx={{ 
                            width: 28, 
                            height: 28,
                            '&:disabled': { opacity: 0.3 }
                          }}
                        >
                          ⬆️
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={i === fields.length - 1 ? "Can't move down" : "Move down"}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFieldDownAt(i);
                          }}
                          disabled={i === fields.length - 1}
                          sx={{ 
                            width: 28, 
                            height: 28,
                            '&:disabled': { opacity: 0.3 }
                          }}
                        >
                          ⬇️
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove field">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFieldAt(i);
                          }}
                          sx={{ 
                            width: 28, 
                            height: 28,
                            color: 'error.main',
                            '&:hover': { bgcolor: alpha('#d32f2f', 0.1) }
                          }}
                        >
                          🗑️
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                  onClick={() => setSelected(i)}
                >
                  <ListItemText 
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {f.title}
                      </Typography>
                    } 
                    secondary={
                      <Chip 
                        label={f.type} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          mt: 0.5,
                          textTransform: 'capitalize'
                        }}
                      />
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Card sx={{ 
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 3, pb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Live Preview
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    React JSON Schema Form • Material-UI
                  </Typography>
                </Box>
                {fields.length > 0 && (
                  <Chip 
                    label={`${fields.length} field${fields.length !== 1 ? 's' : ''}`}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Stack>
            </CardContent>

            {fields.length === 0 ? (
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    bgcolor: alpha('#1976d2', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <Typography variant="h3">📝</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
                    Ready to build your form
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Add fields from the left panel to start creating your form
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ flex: 1, overflow: "auto", px: 3, pb: 2 }}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: '#fafafa',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 2
                  }}>
                    <Form
                      key={fields.map((f) => f.id).join(",")}
                      schema={toJSONSchema().schema}
                      uiSchema={toJSONSchema().uiSchema}
                      validator={validator}
                      onSubmit={({ formData }) => {
                        alert(JSON.stringify(formData, null, 2));
                      }}
                    >
                      <div />
                    </Form>
                  </Paper>
                </Box>
                <Box sx={{ px: 3, pb: 3 }}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button 
                      variant="contained"
                      onClick={() => {
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
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                      }}
                    >
                      🚀 Test Form
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setFields([]);
                        setSelected(null);
                      }}
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      🗑️ Clear All
                    </Button>
                  </Stack>
                </Box>
              </>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Card sx={{ 
            height: "100%", 
            display: "flex", 
            flexDirection: "column", 
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: 3
          }}>
            {/* Field Settings Section */}
            <Box sx={{ height: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: '0 0 50%' }}>
              <CardContent sx={{ p: 3, pb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  ⚙️ Field Settings
                </Typography>
              </CardContent>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, 
                overflow: 'auto', 
                px: 3, 
                pb: 2, 
                flex: 1, 
                minHeight: 0 
              }}>
                {selected === null ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    color: 'text.secondary'
                  }}>
                    <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>⚡</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Select a field to edit
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                      Click on any field from the list
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2.5}>
                    <TextField
                      label="Field Title"
                      value={fields[selected]?.title || ""}
                      onChange={(e) => updateFieldAt(selected, { title: e.target.value })}
                      size="small"
                      variant="outlined"
                      fullWidth
                    />
                    <TextField
                      label="Field Name"
                      value={fields[selected]?.name || ""}
                      onChange={(e) => updateFieldAt(selected, { name: e.target.value })}
                      size="small"
                      variant="outlined"
                      fullWidth
                    />
                    
                    <TextField
                      label="Description"
                      value={fields[selected]?.description || ""}
                      onChange={(e) => updateFieldAt(selected, { description: e.target.value })}
                      size="small"
                      multiline
                      rows={2}
                      placeholder="Field description (optional)"
                      fullWidth
                    />
                    
                    <TextField
                      label="Help Text"
                      value={fields[selected]?.help || ""}
                      onChange={(e) => updateFieldAt(selected, { help: e.target.value })}
                      size="small"
                      placeholder="Help text shown below field"
                      fullWidth
                    />

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Select
                        value={fields[selected]?.type || "string"}
                        onChange={(e) => {
                          const newType = e.target.value as FieldType;
                          const cur = fields[selected]!;
                          const patch: Partial<Field> = { type: newType };
                          if (newType === "select" && !cur.options) patch.options = ["Option 1"];
                          if (newType !== "select") patch.options = undefined;
                          patch.widget = undefined;
                          updateFieldAt(selected, patch);
                        }}
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="string">📝 Text</MenuItem>
                        <MenuItem value="number">🔢 Number</MenuItem>
                        <MenuItem value="boolean">☑️ Boolean</MenuItem>
                        <MenuItem value="select">📋 Select</MenuItem>
                        <MenuItem value="textarea">📄 Textarea</MenuItem>
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
                    </Stack>
                    
                    {/* Widget selector */}
                    {(fields[selected]?.type === "boolean" || fields[selected]?.type === "select") && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" sx={{ minWidth: "60px", fontWeight: 500 }}>
                          Widget:
                        </Typography>
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
                      </Stack>
                    )}
                    
                    {/* Additional UI options */}
                    <Stack spacing={1}>
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
                    </Stack>

                    {/* Type-specific fields */}
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
                        fullWidth
                      />
                    )}

                    {fields[selected]?.type === "textarea" && (
                      <Stack spacing={2}>
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
                          sx={{ maxWidth: 100 }}
                        />
                      </Stack>
                    )}

                    {fields[selected]?.type === "number" && (
                      <Stack direction="row" spacing={1}>
                        <TextField
                          label="Min"
                          type="number"
                          value={fields[selected].minimum ?? ''}
                          onChange={(e) => updateFieldAt(selected, { minimum: e.target.value === '' ? undefined : Number(e.target.value) })}
                          size="small"
                        />
                        <TextField
                          label="Max"
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
                      </Stack>
                    )}

                    {fields[selected]?.type === "boolean" && (
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={!!fields[selected].defaultValue} 
                            onChange={(e) => updateFieldAt(selected, { defaultValue: e.target.checked })} 
                          />
                        }
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
                  </Stack>
                )}
              </Box>
            </Box>

            <Divider />

              {/* Schema Output Section */}
              <Box sx={{ height: '50%', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: '0 0 50%' }}>
                <Box sx={{ p: 2 }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{ 
                      minHeight: 40,
                      '& .MuiTab-root': {
                        minHeight: 40,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    <Tab label="📋 JSON Schema" />
                    <Tab label="🎨 UI Schema" />
                  </Tabs>
                </Box>
                
                {activeTab === 0 && (
                  <Paper sx={{ 
                    m: 2, 
                    p: 2, 
                    bgcolor: "grey.900", 
                    color: "grey.50", 
                    overflow: "auto", 
                    flex: 1, 
                    borderRadius: 2,
                    fontFamily: 'monospace'
                  }}>
                    <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.4 }}>
                      {JSON.stringify(toJSONSchema().schema, null, 2)}
                    </pre>
                  </Paper>
                )}
                
                {activeTab === 1 && (
                  <Paper sx={{ 
                    m: 2, 
                    p: 2, 
                    bgcolor: "grey.900", 
                    color: "grey.50", 
                    overflow: "auto", 
                    flex: 1, 
                    borderRadius: 2,
                    fontFamily: 'monospace'
                  }}>
                    <pre style={{ margin: 0, fontSize: 11, lineHeight: 1.4 }}>
                      {JSON.stringify(toJSONSchema().uiSchema, null, 2)}
                    </pre>
                  </Paper>
                )}

                <Box sx={{ p: 2, pt: 1 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        const content = activeTab === 0 
                          ? JSON.stringify(toJSONSchema().schema, null, 2)
                          : JSON.stringify(toJSONSchema().uiSchema, null, 2);
                        navigator.clipboard?.writeText(content);
                      }}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    >
                      📋 Copy
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
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
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    >
                      💾 Save
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }
