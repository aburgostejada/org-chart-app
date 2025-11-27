import React from 'react';
import Tree from 'react-d3-tree';
import type { OrgNode } from '../types';
import { Card, Typography, Avatar, useTheme, GlobalStyles } from '@mui/material';

interface OrgChartProps {
    data: OrgNode[];
}

const OrgChart: React.FC<OrgChartProps> = ({ data }) => {
    const theme = useTheme();

    // Custom node render function
    const renderCustomNodeElement = ({ nodeDatum, toggleNode }: any) => {
        // nodeDatum contains the data we passed.

        return (
            <g>
                <foreignObject
                    width={200}
                    height={120}
                    x={-100}
                    y={-60}
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
                            '&:hover': {
                                borderColor: 'primary.main',
                                boxShadow: 3,
                            }
                        }}
                    >
                        <Avatar
                            src={nodeDatum.attributes?.imageUrl}
                            alt={nodeDatum.name}
                            sx={{ width: 48, height: 48, mb: 1, bgcolor: 'primary.light' }}
                        >
                            {nodeDatum.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2" component="div" noWrap sx={{ fontWeight: 'bold', width: '100%', textAlign: 'center', color: 'text.primary' }}>
                            {nodeDatum.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ width: '100%', textAlign: 'center' }}>
                            {nodeDatum.attributes?.position}
                        </Typography>
                    </Card>
                </foreignObject>
            </g>
        );
    };

    if (!data || data.length === 0) return null;

    return (
        <div style={{ width: '100%', height: '80vh', background: theme.palette.background.default }}>
            <GlobalStyles
                styles={{
                    '.rd3t-link': {
                        stroke: `${theme.palette.text.primary} !important`,
                        strokeWidth: '2px !important',
                    },
                }}
            />
            <Tree
                data={data}
                orientation="vertical"
                pathFunc="step"
                translate={{ x: window.innerWidth / 2, y: 100 }}
                nodeSize={{ x: 220, y: 160 }}
                renderCustomNodeElement={renderCustomNodeElement}
                enableLegacyTransitions={true}
                transitionDuration={500}

            />
        </div>
    );
};

export default OrgChart;
