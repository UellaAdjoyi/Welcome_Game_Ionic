export interface Task {
  id: number;
  title: string;
  description?: string;
  link?: string;
  is_active: boolean;
  completed?: boolean;
}
