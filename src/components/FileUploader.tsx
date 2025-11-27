import React, { useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const UploadBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px dashed ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderColor: theme.palette.primary.dark,
        transform: 'scale(1.02)',
    },
}));

interface FileUploaderProps {
    onUpload: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onUpload(e.dataTransfer.files[0]);
            }
        },
        [onUpload]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                p: 2,
            }}
        >
            <input
                accept=".csv"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleChange}
            />
            <label htmlFor="raised-button-file" style={{ width: '100%', maxWidth: '600px' }}>
                <UploadBox
                    elevation={3}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom color="text.primary">
                        Upload Org Chart CSV
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                        Drag and drop your CSV file here, or click to select file
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
                        Required columns: ID, Name. Optional: Manager ID, Position, Organization, Image URL
                    </Typography>
                </UploadBox>
            </label>
        </Box>
    );
};
