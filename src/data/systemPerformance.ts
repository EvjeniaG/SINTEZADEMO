export interface SystemPerformance {
  uptime: string;
  efficiency: string;
  nextMaintenance: string;
  totalPanels: number;
  activePanels: number;
  lastCheck: string;
}

export const systemPerformance: SystemPerformance = {
  uptime: '99.8%',
  efficiency: '94%',
  nextMaintenance: '2024-05-15',
  totalPanels: 120,
  activePanels: 118,
  lastCheck: '2024-04-01 08:30'
}; 