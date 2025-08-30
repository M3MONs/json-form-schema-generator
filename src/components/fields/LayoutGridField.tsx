import React from 'react';
import { Grid, Box } from '@mui/material';
import type { FieldProps } from '@rjsf/utils';
import { getUiOptions } from '@rjsf/utils';

const parseGridClassName = (className: string = ''): number => {
  const colMatch = className.match(/col-xs-(\d+)/);
  return colMatch ? parseInt(colMatch[1], 10) : 12;
};

const getNestedProperty = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const renderChildren = (children: any[], registry: any, formData: any, onChange: any, errorSchema: any, schema: any, uiSchema: any): React.ReactElement[] => {
  if (!children) return [];
  
  return children.map((child, index) => {
    if (typeof child === 'string') {
      const fieldPath = child;
      const fieldSchema = getNestedProperty(schema.properties, fieldPath);
      const fieldUiSchema = getNestedProperty(uiSchema, fieldPath) || {};
      const fieldData = getNestedProperty(formData, fieldPath);
      
      if (fieldSchema) {
        const SchemaField = registry.fields.SchemaField;
        return (
          <SchemaField
            key={`${fieldPath}-${index}`}
            name={fieldPath}
            schema={fieldSchema}
            uiSchema={fieldUiSchema}
            formData={fieldData}
            onChange={(newFieldData: any) => {
              const newFormData = { ...formData, [fieldPath]: newFieldData };
              onChange(newFormData);
            }}
            onBlur={() => {}}
            onFocus={() => {}}
            registry={registry}
            disabled={false}
            readonly={false}
            autofocus={false}
            errorSchema={getNestedProperty(errorSchema, fieldPath) || {}}
            idSchema={{ $id: fieldPath }}
            rawErrors={[]}
          />
        );
      }
    }
    
    return <div key={index}></div>;
  });
};

const renderRow = (rowConfig: any, registry: any, formData: any, onChange: any, errorSchema: any, schema: any, uiSchema: any, key: number): React.ReactElement => {
  const { className = '', children = [] } = rowConfig;
  
  return (
    <Grid container spacing={2} className={className} key={`row-${key}`} sx={{ mb: 2 }}>
      {children.map((child: any, index: number) => {
        if (child['ui:col'] || child['ui:columns']) {
          const colConfig = child['ui:col'] || child['ui:columns'];
          return renderColumn(colConfig, registry, formData, onChange, errorSchema, schema, uiSchema, index);
        }
        return null;
      })}
    </Grid>
  );
};

const renderColumn = (colConfig: any, registry: any, formData: any, onChange: any, errorSchema: any, schema: any, uiSchema: any, key: number): React.ReactElement => {
  const { className = '', children = [], style = {} } = colConfig;
  const gridSize = parseGridClassName(className);
  
  return (
    <Grid size={gridSize} className={className} key={`col-${key}`}>
      <Box sx={{ 
        ...style, 
        '& > *': { 
          mb: 2 
        },
        '& > *:last-child': {
          mb: 0
        }
      }}>
        {renderChildren(children, registry, formData, onChange, errorSchema, schema, uiSchema)}
      </Box>
    </Grid>
  );
};

const LayoutGridField: React.FC<FieldProps> = (props) => {
  const { uiSchema, formData, onChange, errorSchema, schema, registry } = props;
  const options = getUiOptions(uiSchema);
  const layoutGrid = options.layoutGrid;
  
  const fullFormData = registry?.formContext?.formData || formData || {};
  
  if (!layoutGrid || !layoutGrid['ui:row']) {
    return <div>No layout configuration found</div>;
  }
  
  const rows = Array.isArray(layoutGrid['ui:row']) ? layoutGrid['ui:row'] : [layoutGrid['ui:row']];
  
  return (
    <Box sx={{ '& > *:last-child': { mb: '0 !important' } }}>
      {rows.map((row, index) => {
        if (row['ui:row']) {
          return renderRow(row['ui:row'], registry, fullFormData, onChange, errorSchema, schema, uiSchema, index);
        }
        return null;
      })}
    </Box>
  );
};

export default LayoutGridField;
