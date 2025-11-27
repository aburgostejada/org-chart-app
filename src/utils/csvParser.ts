import Papa from 'papaparse';
import type { Employee, OrgNode } from '../types';
import { groupBy } from 'lodash';

export const parseCSV = (file: File): Promise<Employee[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Basic validation or mapping could happen here
                // We assume the CSV headers match or we map them
                const data = results.data.map((row: any) => ({
                    id: row.id || row.employee_id || row.ID,
                    managerId: row.manager_id || row.managerId || row.MANAGER_ID || '',
                    name: row.name || row.Name || row.NAME,
                    position: row.position || row.Position || row.POSITION || row.Title || row.title,
                    department: row.department || row.Department || row.DEPARTMENT,
                    organization: row.organization || row.Organization || row.ORGANIZATION || 'Default Org',
                    imageUrl: row.imageUrl || row.image_url || row.IMAGE_URL || row.photo || '',
                })) as Employee[];
                resolve(data);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};

export const buildOrgTree = (employees: Employee[]): OrgNode[] => {
    const employeeMap = new Map<string, OrgNode>();
    const roots: OrgNode[] = [];

    // First pass: Create nodes
    employees.forEach((emp) => {
        employeeMap.set(emp.id, {
            name: emp.name,
            attributes: {
                position: emp.position,
                department: emp.department,
                imageUrl: emp.imageUrl,
                id: emp.id,
            },
            children: [],
        });
    });

    // Second pass: Link children to parents
    employees.forEach((emp) => {
        const node = employeeMap.get(emp.id);
        if (!node) return;

        if (emp.managerId && employeeMap.has(emp.managerId)) {
            const parent = employeeMap.get(emp.managerId);
            parent?.children?.push(node);
        } else {
            // No manager or manager not found -> Root
            roots.push(node);
        }
    });

    return roots;
};

export const buildOrgTreesByOrganization = (employees: Employee[]): Record<string, OrgNode[]> => {
    const grouped = groupBy(employees, 'organization');
    const result: Record<string, OrgNode[]> = {};

    Object.entries(grouped).forEach(([orgName, orgEmployees]) => {
        result[orgName] = buildOrgTree(orgEmployees);
    });

    return result;
};
