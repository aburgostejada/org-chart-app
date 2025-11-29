import React, { useMemo } from 'react';
import Tree from 'react-d3-tree';
import type { OrgNode } from '../types';
import { Card, Typography, Avatar, useTheme, GlobalStyles, Box, Paper, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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
    const [hiddenDepartments, setHiddenDepartments] = React.useState<Set<string>>(new Set());

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

    // 2. Filter data based on hidden departments
    const filteredData = useMemo(() => {
        if (hiddenDepartments.size === 0) return data;

        const filterNodes = (nodes: OrgNode[]): OrgNode[] => {
            return nodes
                .filter(node => {
                    const dept = node.attributes?.department;
                    return !dept || !hiddenDepartments.has(dept);
                })
                .map(node => ({
                    ...node,
                    children: node.children ? filterNodes(node.children) : undefined
                }))
            // Remove nodes that were filtered out but kept as undefined/empty in map if any (though filter handles it)
            // The map above returns a new object, so we are good.
            // However, if a parent is hidden, its children are gone too.
            // If a child is hidden, it is removed from the parent's children array.
        };

        return filterNodes(data);
    }, [data, hiddenDepartments]);

    const toggleDepartment = (dept: string) => {
        setHiddenDepartments(prev => {
            const next = new Set(prev);
            if (next.has(dept)) {
                next.delete(dept);
            } else {
                next.add(dept);
            }
            return next;
        });
    };

    // Custom node render function
    const renderCustomNodeElement = React.useCallback(({ nodeDatum, toggleNode }: any) => {
        // nodeDatum contains the data we passed.
        const dept = nodeDatum.attributes?.department;
        const deptColor = dept ? departmentColorMap[dept] : theme.palette.grey[500];

        // Calculate children count
        // react-d3-tree moves children to _children when collapsed
        const hasChildren = (nodeDatum.children && nodeDatum.children.length > 0);
        const hasHiddenChildren = (nodeDatum.__rd3t && nodeDatum.__rd3t.collapsed);
        const childrenCount = (nodeDatum.children?.length || 0) + (nodeDatum._children?.length || 0);

        // Determine icon and rotation
        let ExpandIcon = null;
        if (hasChildren || hasHiddenChildren) {
            ExpandIcon = (
                <ExpandMoreIcon
                    key="expand-icon"
                    fontSize="small"
                    sx={{
                        transform: hasHiddenChildren ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease-in-out'
                    }}
                />
            );
        }

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
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={nodeDatum.attributes?.imageUrl}
                                alt={nodeDatum.name}
                                sx={{ width: 48, height: 48, mb: 1, bgcolor: deptColor, color: 'white' }}
                            >
                                {nodeDatum.name.charAt(0)}
                            </Avatar>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%', justifyContent: 'center' }}>
                            <Typography variant="subtitle2" component="div" noWrap sx={{ fontWeight: 'bold', textAlign: 'center', color: 'text.primary', maxWidth: '70%' }}>
                                {nodeDatum.name}
                            </Typography>
                            {childrenCount > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: theme.palette.action.hover, borderRadius: 1, px: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                                        {childrenCount}
                                    </Typography>
                                    {ExpandIcon}
                                </Box>
                            )}
                        </Box>

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
    }, [departmentColorMap, theme]);

    const [isLegendExpanded, setIsLegendExpanded] = React.useState(true);

    if (!filteredData || filteredData.length === 0) {
        // If all data is filtered out, show a message or just empty container
        // But we should probably keep the legend visible
        return (
            <div style={{ width: '100%', height: '100%', background: theme.palette.background.default, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                        opacity: 0.95,
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Box
                        onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            mb: isLegendExpanded ? 1 : 0
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Departments
                        </Typography>
                        <ExpandMoreIcon
                            fontSize="small"
                            sx={{
                                transform: isLegendExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                                transition: 'transform 0.3s ease-in-out'
                            }}
                        />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        maxHeight: isLegendExpanded ? 500 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease-in-out',
                        opacity: isLegendExpanded ? 1 : 0
                    }}>
                        {Object.entries(departmentColorMap).map(([dept, color]) => (
                            <Box
                                key={dept}
                                onClick={() => toggleDepartment(dept)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    cursor: 'pointer',
                                    opacity: hiddenDepartments.has(dept) ? 0.5 : 1,
                                    textDecoration: hiddenDepartments.has(dept) ? 'line-through' : 'none',
                                    '&:hover': { opacity: 0.8 }
                                }}
                            >
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
                <Typography color="text.secondary">No data to display (All departments hidden)</Typography>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%', background: theme.palette.background.default, position: 'relative' }}>
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
                    opacity: 0.95,
                    transition: 'all 0.3s ease'
                }}
            >
                <Box
                    onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        mb: isLegendExpanded ? 1 : 0
                    }}
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Departments
                    </Typography>
                    <ExpandMoreIcon
                        fontSize="small"
                        sx={{
                            transform: isLegendExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition: 'transform 0.3s ease-in-out'
                        }}
                    />
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    maxHeight: isLegendExpanded ? 500 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-in-out',
                    opacity: isLegendExpanded ? 1 : 0
                }}>
                    {Object.entries(departmentColorMap).map(([dept, color]) => (
                        <Box
                            key={dept}
                            onClick={() => toggleDepartment(dept)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                                opacity: hiddenDepartments.has(dept) ? 0.5 : 1,
                                textDecoration: hiddenDepartments.has(dept) ? 'line-through' : 'none',
                                '&:hover': { opacity: 0.8 }
                            }}
                        >
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
                data={filteredData}
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
