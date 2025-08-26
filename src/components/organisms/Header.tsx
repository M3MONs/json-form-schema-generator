import { Box, Stack, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";

interface HeaderProps {
  title: string;
  subtitle: string;
  iconPath: string;
}

const HeaderBoxStyles = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  py: 3,
  px: 2,
  borderRadius: "0 0 24px 24px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "hidden",
};

const TopCircleStyles = {
  position: "absolute",
  top: -20,
  right: -20,
  width: 100,
  height: 100,
  borderRadius: "50%",
  bgcolor: alpha("#ffffff", 0.1),
};

const BottomCircleStyles = {
  position: "absolute",
  bottom: -30,
  left: -30,
  width: 80,
  height: 80,
  borderRadius: "50%",
  bgcolor: alpha("#ffffff", 0.05),
};

const StackStyles = {
  position: "relative",
};

const IconBoxStyles = {
  width: 48,
  height: 48,
  borderRadius: "12px",
  bgcolor: alpha("#ffffff", 0.2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(10px)",
};

const IconStyles = {
  width: 32,
  height: 32,
  filter: "brightness(0) invert(1)",
};

const TitleStyles = {
  fontWeight: 700,
  letterSpacing: "-0.02em",
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const SubtitleStyles = {
  opacity: 0.9,
  fontWeight: 400,
  mt: 0.5,
};

export default function Header({ title, subtitle, iconPath }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={HeaderBoxStyles}>
      <Box sx={TopCircleStyles} />
      <Box sx={BottomCircleStyles} />
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={2} 
        alignItems="center" 
        justifyContent="center" 
        sx={StackStyles}
      >
        <Box sx={IconBoxStyles}>
          <img src={iconPath} alt="JSON icon" style={IconStyles} />
        </Box>
        <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            sx={TitleStyles}
          >
            {title}
          </Typography>
          <Typography 
            variant={isMobile ? "body2" : "subtitle1"} 
            sx={{
              ...SubtitleStyles,
              fontSize: isMobile ? '0.875rem' : undefined,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
