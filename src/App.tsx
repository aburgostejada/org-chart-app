
import { createTheme, ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Button, Container, IconButton, useMediaQuery, Tabs, Tab } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import OrgChart from './components/OrgChart';
import type { OrgNode } from './types';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: light)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const [orgDataByPhase, setOrgDataByPhase] = useState<Record<string, OrgNode[]>>({});
  const [selectedPhase, setSelectedPhase] = useState<string | false>(false);

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#005c97', // Workday-ish blue
          },
          secondary: {
            main: '#f50057',
          },
          background: {
            default: mode === 'light' ? '#f4f6f8' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h6: {
            fontWeight: 600,
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' ? '0 4px 12px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.5)',
                borderRadius: '8px',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                color: mode === 'light' ? '#000000' : '#ffffff',
              },
            },
          },
        },
      }),
    [mode],
  );

  const handleOrgDataLoaded = (data: Record<string, OrgNode[]>) => {
    setOrgDataByPhase(data);

    // Set initial phase
    const phases = Object.keys(data);
    if (phases.length > 0) {
      setSelectedPhase(phases[0]);
    }
  };

  const handleReset = () => {
    setOrgDataByPhase({});
    setSelectedPhase(false);
  };

  const handlePhaseChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedPhase(newValue);
  };

  const currentData = selectedPhase ? orgDataByPhase[selectedPhase] : [];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
              Construction Org Chart
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {Object.keys(orgDataByPhase).length > 0 && (
              <Button
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                color="inherit"
                sx={{ ml: 2 }}
              >
                Upload New
              </Button>
            )}
          </Toolbar>
          {Object.keys(orgDataByPhase).length > 0 && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedPhase}
                onChange={handlePhaseChange}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                aria-label="construction phases tabs"
              >
                {Object.keys(orgDataByPhase).map((phase) => (
                  <Tab key={phase} label={phase} value={phase} />
                ))}
              </Tabs>
            </Box>
          )}
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative', p: 2, display: 'flex', flexDirection: 'column' }}>
          {Object.keys(orgDataByPhase).length === 0 ? (
            <Container maxWidth="md">
              <FileUpload onDataLoaded={handleOrgDataLoaded} />
            </Container>
          ) : (
            <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative', height: '100%' }}>
              {currentData.length > 0 ? (
                <OrgChart data={currentData} />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="h6" color="text.secondary">
                    No data for this phase
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box >
    </ThemeProvider >
  );
}

export default App;
