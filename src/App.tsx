import { createTheme, ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Button, Container, IconButton, useMediaQuery } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import OrgChart from './components/OrgChart';
import type { OrgNode } from './types';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const [orgData, setOrgData] = useState<OrgNode[] | null>(null);

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

  const handleDataLoaded = (data: OrgNode[]) => {
    // If multiple roots, wrap them in a virtual root or just pass them.
    // react-d3-tree handles array but might be better to have a single root for the chart.
    // Let's wrap if > 1
    if (data.length > 1) {
      setOrgData([{
        name: 'Organization',
        attributes: {
          position: 'Root',
          id: 'root',
        },
        children: data,
      }]);
    } else {
      setOrgData(data);
    }
  };

  const handleReset = () => {
    setOrgData(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
              Org Chart Visualizer
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {orgData && (
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
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
          {!orgData ? (
            <Container maxWidth="md">
              <FileUpload onDataLoaded={handleDataLoaded} />
            </Container>
          ) : (
            <OrgChart data={orgData} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
