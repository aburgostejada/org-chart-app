import React, { useState } from 'react';
import type { TreeNode } from '../types';
import { OrgChartNode } from './OrgChartNode';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';



const ChildrenContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    position: 'relative',
    gap: 16,
    flexWrap: 'wrap', // Allow wrapping on small screens if needed, though tree usually scrolls
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 2,
        height: 20,
        backgroundColor: '#ccc',
        transform: 'translateX(-50%)',
    },
});

const NodeWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
});



interface OrgChartProps {
    node: TreeNode;
    depth?: number;
}

export const OrgChart: React.FC<OrgChartProps> = ({ node, depth = 0 }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <NodeWrapper>
            <OrgChartNode
                data={node.data}
                hasChildren={hasChildren}
                expanded={expanded}
                onToggle={() => setExpanded(!expanded)}
            />

            <AnimatePresence>
                {hasChildren && expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChildrenContainer>
                            {/* Line connecting parent to children container */}
                            {node.children.map((child, index) => (
                                <Box key={child.data.id} sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {/* Horizontal line logic */}
                                    {node.children.length > 1 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -20,
                                                left: index === 0 ? '50%' : 0,
                                                right: index === node.children.length - 1 ? '50%' : 0,
                                                height: 2,
                                                backgroundColor: '#ccc',
                                            }}
                                        />
                                    )}
                                    {/* Vertical line to child */}
                                    <Box sx={{ width: 2, height: 20, backgroundColor: '#ccc', mt: -2.5, mb: 0 }} />

                                    <OrgChart node={child} depth={depth + 1} />
                                </Box>
                            ))}
                        </ChildrenContainer>
                    </motion.div>
                )}
            </AnimatePresence>
        </NodeWrapper>
    );
};
