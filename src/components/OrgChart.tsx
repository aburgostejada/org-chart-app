import React, { useMemo } from 'react';
import Tree from 'react-d3-tree';
import type { OrgNode } from '../types';
import { Card, Typography, Avatar, useTheme, GlobalStyles, Box, Paper, Chip } from '@mui/material';
import { uniq } from 'lodash';

interface OrgChartProps {
    data: OrgNode[];
}

// Predefined palette for departments
const DEPARTMENT_COLORS = [
    '#1976d2', // Blue
    '#388e3c', // Green
    '#d32f2f', // Red
    '#fbc02d', // Yellow
    '#7b1fa2', // Purple
    '#0288d1', // Light Blue
    '#e64a19', // Orange
    '#5d4037', // Brown
    '#455a64', // Blue Grey
    '#c2185b', // Pink
];

const OrgChart: React.FC<OrgChartProps> = ({ data }) => {
    const theme = useTheme();

    // 1. Extract all departments and assign colors
    const departmentColorMap = useMemo(() => {
        const departments = new Set<string>();
        const traverse = (nodes: OrgNode[]) => {
            nodes.forEach(node => {
                if (node.attributes?.department) {
                    departments.add(node.attributes.department);
                }
                if (node.children) {
                    traverse(node.children);
                }
            });
        };
        traverse(data);

        const sortedDepts = Array.from(departments).sort();
        const map: Record<string, string> = {};
        sortedDepts.forEach((dept, index) => {
            map[dept] = DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length];
        });
        return map;
    }, [data]);

    // Custom node render function
    const renderCustomNodeElement = ({ nodeDatum, toggleNode }: any) => {
        // nodeDatum contains the data we passed.
        const dept = nodeDatum.attributes?.department;
        const deptColor = dept ? departmentColorMap[dept] : theme.palette.grey[500];

        return (
            <g>
                <foreignObject
                    width={220}
                    height={140}
                    x={-110}
                    y={-70}
                >
                    <Card
                        onClick={toggleNode}
                        sx={{
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1,
                            bgcolor: 'background.paper', // Use theme background
                            backgroundImage: 'none', // Remove default gradient in dark mode if any
                            border: `1px solid ${theme.palette.divider}`,
                            borderTop: `4px solid ${deptColor}`, // Color coded top border
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: deptColor,
                                boxShadow: 4,
                                transform: 'translateY(-2px)',
                            }
                        }}
                    >
                        <Avatar
                            src={nodeDatum.attributes?.imageUrl}
                            alt={nodeDatum.name}
                            sx={{ width: 48, height: 48, mb: 1, bgcolor: deptColor, color: 'white' }}
                        >
                            {nodeDatum.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2" component="div" noWrap sx={{ fontWeight: 'bold', width: '100%', textAlign: 'center', color: 'text.primary' }}>
                            {nodeDatum.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ width: '100%', textAlign: 'center', mb: 0.5 }}>
                            {nodeDatum.attributes?.position}
                        </Typography>
                        {dept && (
                            <Chip
                                label={dept}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: deptColor,
                                    color: 'white',
                                    opacity: 0.9
                                }}
                            />
                        )}
                    </Card>
                </foreignObject>
            </g>
        );
    };

    if (!data || data.length === 0) return null;

    return (
        <div style={{ width: '100%', height: '80vh', background: theme.palette.background.default, position: 'relative' }}>
            <GlobalStyles
                styles={{
                    '.rd3t-link': {
                        stroke: `${theme.palette.text.primary} !important`,
                        strokeWidth: '2px !important',
                    },
                }}
            />

            {/* Legend */}
            <Paper
                elevation={3}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    p: 2,
                    zIndex: 10,
                    maxWidth: 200,
                    maxHeight: 300,
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    opacity: 0.95
                }}
            >
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Departments
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(departmentColorMap).map(([dept, color]) => (
                        <Box key={dept} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
                            <Typography variant="caption" noWrap>
                                {dept}
                            </Typography>
                        </Box>
                    ))}
                    {Object.keys(departmentColorMap).length === 0 && (
                        <Typography variant="caption" color="text.secondary">
                            No departments found
                        </Typography>
                    )}
                </Box>
            </Paper>

            <Tree
                data={data}
                orientation="vertical"
                pathFunc="step"
                translate={{ x: window.innerWidth / 2, y: 100 }}
                nodeSize={{ x: 240, y: 180 }}
                renderCustomNodeElement={renderCustomNodeElement}
                enableLegacyTransitions={true}
                transitionDuration={500}
            />
        </div>
    );
};

export default OrgChart;
