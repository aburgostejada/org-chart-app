import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Link, Divider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import TableViewIcon from '@mui/icons-material/TableView';
import { parseCSV, buildOrgTree } from '../utils/csvParser';
import type { OrgNode } from '../types';

interface FileUploadProps {
    onDataLoaded: (data: OrgNode[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const processFile = async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            const employees = await parseCSV(file);
            if (employees.length === 0) {
                throw new Error('No employee data found in CSV');
            }
            const tree = buildOrgTree(employees);
            if (tree.length === 0) {
                throw new Error('Could not build org tree. Check manager IDs.');
            }
            onDataLoaded(tree);
        } catch (err: any) {
            setError(err.message || 'Failed to parse CSV');
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const loadSampleData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/sample.csv');
            if (!response.ok) throw new Error('Failed to fetch sample data');
            const blob = await response.blob();
            const file = new File([blob], 'sample.csv', { type: 'text/csv' });
            await processFile(file);
        } catch (err: any) {
            setError(err.message || 'Failed to load sample data');
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Paper
                variant="outlined"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                sx={{
                    p: 6,
                    width: '100%',
                    maxWidth: 600,
                    textAlign: 'center',
                    bgcolor: dragActive ? 'action.hover' : 'background.paper',
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    borderColor: dragActive ? 'primary.main' : 'divider',
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <input
                    accept=".csv"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleChange}
                />
                <label htmlFor="raised-button-file" style={{ cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CloudUploadIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                        <Typography variant="h5" color="text.primary" gutterBottom>
                            Upload Organization CSV
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            Drag and drop your CSV file here, or click to browse
                        </Typography>
                        <Button variant="contained" component="span" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Select File'}
                        </Button>
                        {error && (
                            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                                {error}
                            </Alert>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                            Required columns: id, name, position. Optional: manager_id, department, image_url
                        </Typography>
                    </Box>
                </label>

                <Divider sx={{ my: 4 }}>OR</Divider>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<TableViewIcon />}
                        onClick={loadSampleData}
                        disabled={loading}
                    >
                        Load Sample Data
                    </Button>

                    <Link href="/sample.csv" download underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DownloadIcon fontSize="small" />
                        Download Sample CSV
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};

export default FileUpload;
