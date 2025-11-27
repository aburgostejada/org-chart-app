import Papa from 'papaparse';
import type { Employee, TreeNode } from './types';

export const parseCSV = (file: File): Promise<Employee[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Map CSV fields to Employee interface loosely to handle variations
                const data = results.data.map((row: any) => ({
                    id: row.ID || row.id,
                    name: row.Name || row.name,
                    position: row.Position || row.position || row.Title || row.title,
                    organization: row.Organization || row.organization || row.Department || row.department,
                    imageUrl: row['Image URL'] || row.imageUrl || row.image_url || '',
                    managerId: row['Manager ID'] || row.managerId || row.manager_id || row['Reports To'] || row.reports_to,
                })) as Employee[];

                // Filter out invalid rows (must have ID and Name at minimum)
                const validData = data.filter(e => e.id && e.name);
                resolve(validData);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};

export const buildTree = (employees: Employee[]): TreeNode[] => {
    const employeeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Initialize map
    employees.forEach((emp) => {
        employeeMap.set(emp.id, { data: emp, children: [] });
    });

    // Build hierarchy
    employees.forEach((emp) => {
        const node = employeeMap.get(emp.id);
        if (!node) return;

        if (emp.managerId && employeeMap.has(emp.managerId)) {
            const managerNode = employeeMap.get(emp.managerId);
            managerNode?.children.push(node);
        } else {
            // No manager, or manager not found in list -> Root node
            roots.push(node);
        }
    });

    return roots;
};
