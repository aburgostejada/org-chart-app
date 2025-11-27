export interface Employee {
    id: string;
    managerId: string; // Can be empty for root
    name: string;
    position: string;
    department?: string;
    organization?: string;
    imageUrl?: string;
}

export interface OrgNode {
    name: string;
    attributes?: {
        position: string;
        department?: string;
        imageUrl?: string;
        id: string;
    };
    children?: OrgNode[];
}
