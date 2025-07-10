export interface JobRequest {
  id: number;
  jobRequest: string;
  submitted: string;
  status: 'In-process' | 'Need to start' | 'Complete' | 'Blocked';
  submitter: string;
  url: string;
  assigned: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  estValue: string;
}

export interface User {
  name: string;
  avatar: string;
  email: string;
}

export interface AppState {
  data: JobRequest[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  activeTab: string;
  selectedRows: number[];
}

export type SortField = keyof JobRequest;
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

export interface Tab {
  id: string;
  label: string;
  count: number;
}