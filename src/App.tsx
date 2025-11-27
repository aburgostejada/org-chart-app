import { createTheme, ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useState } from 'react';
import FileUpload from './components/FileUpload';
import OrgChart from './components/OrgChart';
import type { OrgNode } from './types';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#005c97', // Workday-ish blue
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f4f6f8',
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '8px',
        },
      },
    },
  },
});

function App() {
  const [orgData, setOrgData] = useState<OrgNode[] | null>(null);

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
        <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
          <Toolbar>
            <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
              Org Chart Visualizer
            </Typography>
            {orgData && (
              <Button
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                color="inherit"
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
