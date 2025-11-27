import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, IconButton } from '@mui/material';
import type { Employee } from '../types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
    width: 280,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease',
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        boxShadow: theme.shadows[8],
    },
}));

const PositionLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: theme.spacing(0.5),
}));

interface OrgChartNodeProps {
    data: Employee;
    hasChildren: boolean;
    expanded: boolean;
    onToggle: () => void;
}

export const OrgChartNode: React.FC<OrgChartNodeProps> = ({
    data,
    hasChildren,
    expanded,
    onToggle,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <StyledCard onClick={hasChildren ? onToggle : undefined} elevation={2}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                    <Avatar
                        src={data.imageUrl}
                        alt={data.name}
                        sx={{ width: 56, height: 56, mr: 2, border: '2px solid white', boxShadow: 1 }}
                    >
                        {data.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography variant="h6" noWrap title={data.name} sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                            {data.name}
                        </Typography>
                        <PositionLabel noWrap title={data.position}>
                            {data.position || 'Employee'}
                        </PositionLabel>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                            {data.organization}
                        </Typography>
                    </Box>
                    {hasChildren && (
                        <IconButton size="small" sx={{ ml: 1 }}>
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    )}
                </CardContent>
            </StyledCard>
        </motion.div>
    );
};
