export interface Employee {
  id: string;
  name: string;
  position: string;
  organization: string;
  imageUrl?: string;
  managerId?: string;
}

export interface TreeNode {
  data: Employee;
  children: TreeNode[];
}
