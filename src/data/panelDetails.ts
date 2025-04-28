export interface SystemPerformance {
  currentOutput: number;
  dailyEnergy: number;
  monthlyEnergy: number;
  yearlyEnergy: number;
  efficiency: number;
  activePanels: number;
  totalPanels: number;
}

export interface PanelDetail {
  id: number;
  location: string;
  power: string;
  daily: string;
  monthly: string;
  efficiency: string;
  status: 'aktiv' | 'kujdes';
  lastMaintenance: string;
}

export const systemStats: SystemPerformance = {
  currentOutput: 85.5,
  dailyEnergy: 450.2,
  monthlyEnergy: 13506,
  yearlyEnergy: 162072,
  efficiency: 95.8,
  activePanels: 118,
  totalPanels: 120
};

export const detailedPanelData: PanelDetail[] = Array.from({ length: 120 }, (_, index) => {
  const efficiency = 85 + Math.random() * 15;
  const dailyProduction = ((efficiency / 100) * 2.5).toFixed(1);
  return {
    id: index + 1,
    location: `Rresht ${Math.floor(index / 6) + 1}, Panel ${(index % 6) + 1}`,
    power: '450W',
    daily: `${dailyProduction}kWh`,
    monthly: `${(parseFloat(dailyProduction) * 30).toFixed(0)}kWh`,
    efficiency: `${Math.round(efficiency)}%`,
    status: efficiency < 90 ? 'kujdes' : 'aktiv',
    lastMaintenance: '2024-01-01'
  };
}); 