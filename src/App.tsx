import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, AppBar, Toolbar, Typography, Box, IconButton, Button } from '@mui/material';
import { FileUploader } from './components/FileUploader';
import { OrgChart } from './components/OrgChart';
import { parseCSV, buildTree } from './utils';
import type { TreeNode } from './types';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [trees, setTrees] = useState<TreeNode[]>([]);


  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#2563eb' : '#60a5fa',
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h6: {
            fontWeight: 700,
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode]
  );

  const handleUpload = async (file: File) => {
    // setLoading(true);
    try {
      const employees = await parseCSV(file);
      const builtTrees = buildTree(employees);
      setTrees(builtTrees);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please check the format.');
    } finally {
      // setLoading(false);
    }
  };

  const handleLoadDemo = async () => {
    try {
      const response = await fetch('/sample_org.csv');
      const blob = await response.blob();
      const file = new File([blob], 'sample_org.csv', { type: 'text/csv' });
      await handleUpload(file);
    } catch (error) {
      console.error('Error loading demo data:', error);
      alert('Error loading demo data.');
    }
  };

  const handleReset = () => {
    setTrees([]);
  };

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              🏢 Org Chart Visualizer
            </Typography>
            {trees.length > 0 && (
              <Button
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                sx={{ mr: 2 }}
                color="inherit"
              >
                Upload New
              </Button>
            )}
            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ flexGrow: 1, py: 4, overflowX: 'auto' }}>
          {trees.length === 0 ? (
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
              <FileUploader onUpload={handleUpload} />
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Need a sample?
                  <Button
                    href="/sample_org.csv"
                    download
                    startIcon={<DownloadIcon />}
                    sx={{ ml: 1 }}
                  >
                    Download Sample CSV

                  </Button>
                  <Button
                    onClick={handleLoadDemo}
                    variant="outlined"
                    sx={{ ml: 2 }}
                  >
                    Load Demo Data
                  </Button>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {trees.map((root, index) => (
                <Box key={root.data.id || index} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <OrgChart node={root} />
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </Box >
    </ThemeProvider >
  );
}

export default App;
