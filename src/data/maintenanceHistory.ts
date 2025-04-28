export interface MaintenanceRecord {
  date: string;
  type: 'routine' | 'repair' | 'cleaning';
  description: string;
  technician: string;
  panelsServiced: number;
}

export const maintenanceHistory: MaintenanceRecord[] = [
  {
    date: '2024-03-15',
    type: 'routine',
    description: 'Quarterly system inspection and cleaning',
    technician: 'John Smith',
    panelsServiced: 120
  },
  {
    date: '2023-12-15',
    type: 'repair',
    description: 'Replaced faulty inverter on panel #45',
    technician: 'Sarah Johnson',
    panelsServiced: 1
  },
  {
    date: '2023-09-15',
    type: 'cleaning',
    description: 'Full system cleaning and debris removal',
    technician: 'Mike Brown',
    panelsServiced: 120
  }
]; 