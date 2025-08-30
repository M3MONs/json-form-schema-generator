import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import type { FieldProps } from '@rjsf/utils';

const LayoutHeaderField: React.FC<FieldProps> = (props) => {
  const { schema, children } = props;
  const title = schema.title || '';

  return (
    <Box sx={{ mb: 3 }}>
      {title && (
        <>
          <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
            {title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}
      {children}
    </Box>
  );
};

export default LayoutHeaderField;
