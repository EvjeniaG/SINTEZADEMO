export interface SystemAlert {
  id: string;
  timestamp: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  status: 'active' | 'resolved';
  panelId?: number;
}

export const systemAlerts: SystemAlert[] = [
  {
    id: 'ALT001',
    timestamp: '2024-03-18T09:30:00',
    type: 'warning',
    message: 'Panel #45 showing reduced efficiency',
    status: 'active',
    panelId: 45
  },
  {
    id: 'ALT002',
    timestamp: '2024-03-17T14:15:00',
    type: 'info',
    message: 'Scheduled maintenance due in 7 days',
    status: 'active'
  },
  {
    id: 'ALT003',
    timestamp: '2024-03-16T11:20:00',
    type: 'error',
    message: 'Communication lost with panel #78',
    status: 'resolved',
    panelId: 78
  }
]; 