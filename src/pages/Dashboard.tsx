import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Chart } from 'chart.js';
import html2canvas from 'html2canvas';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// System Constants
const SYSTEM_CONSTANTS = {
  TOTAL_PANELS: 24,
  PANEL_POWER: 450, // W
  INSTALLATION_DATE: '2024-01-01',
} as const;

// Mock data generator with time range support
const generateMockData = (range: string) => {
  const multiplier = {
    day: 1,
    week: 7,
    month: 30,
    year: 365
  };
  
  return {
    production: (Math.random() * 50 + 20 * multiplier[range]).toFixed(2),
    savings: (Math.random() * 30 + 10 * multiplier[range]).toFixed(2),
    co2: (Math.random() * 100 + 50 * multiplier[range]).toFixed(2),
    status: Math.random() > 0.1 ? 'Aktiv' : 'Në pritje',
    activePanels: Math.min(SYSTEM_CONSTANTS.TOTAL_PANELS, 
      SYSTEM_CONSTANTS.TOTAL_PANELS - Math.floor(Math.random() * 2))
  };
};

// Mock weather data
const weatherData = {
  temperature: 25,
  condition: 'me diell',
  impact: 'optimal',
  sunlightHours: '11:30',
  sunriseTime: '06:15',
  sunsetTime: '17:45',
  forecast: [
    { day: 'Sot', temp: 25, condition: 'me diell' },
    { day: 'Nesër', temp: 24, condition: 'pjesërisht me re' },
    { day: 'Pasnesër', temp: 23, condition: 'me re' }
  ]
} as const;

// Mock panel details
const panelDetails = Array.from({ length: SYSTEM_CONSTANTS.TOTAL_PANELS }, (_, index) => {
  const efficiency = 85 + Math.random() * 15; // 85-100%
  return {
    id: index + 1,
    power: SYSTEM_CONSTANTS.PANEL_POWER,
    efficiency: Math.round(efficiency),
    status: efficiency < 90 ? 'kujdes' : 'aktiv',
    production: ((efficiency / 100) * 2.5).toFixed(1) // Base production 2.5 kWh adjusted by efficiency
  }
});

// Mock notifications
const mockNotifications = [
  {
    id: 1,
    type: 'warning',
    message: `Eficienca e panelit #12 ka rënë nën ${panelDetails[11].efficiency}`,
    time: '10:30'
  },
  {
    id: 2,
    type: 'success',
    message: 'Prodhimi ditor ka tejkaluar parashikimin',
    time: '09:15'
  },
  {
    id: 3,
    type: 'info',
    message: 'Mirëmbajtja e radhës është planifikuar për javën e ardhshme',
    time: '08:45'
  }
];

// Mock system performance data
const systemPerformance = {
  uptime: '99.8%',
  efficiency: '94%',
  nextMaintenance: '2024-05-15',
  totalPanels: SYSTEM_CONSTANTS.TOTAL_PANELS,
  activePanels: SYSTEM_CONSTANTS.TOTAL_PANELS - 1,
  lastCheck: '2024-04-01 08:30'
};

// Mock alarms data
const alarms = [
  { 
    id: 1, 
    severity: 'high', 
    message: `Panel #12 ka nevojë për pastrim urgjent - Eficienca ${panelDetails[11].efficiency}`, 
    time: '10:15', 
    status: 'active' 
  },
  { 
    id: 2, 
    severity: 'medium', 
    message: 'Eficienca e sistemit ka rënë nën 95%', 
    time: '09:45', 
    status: 'active' 
  },
  { 
    id: 3, 
    severity: 'low', 
    message: 'Mirëmbajtja e radhës është planifikuar', 
    time: '08:30', 
    status: 'resolved' 
  }
];

// Mock detailed panel data
const detailedPanelData = Array.from({ length: SYSTEM_CONSTANTS.TOTAL_PANELS }, (_, index) => {
  const efficiency = 85 + Math.random() * 15;
  const dailyProduction = ((efficiency / 100) * 2.5).toFixed(1);
  return {
    id: index + 1,
    location: `Rresht ${Math.floor(index / 6) + 1}, Panel ${(index % 6) + 1}`,
    power: `${SYSTEM_CONSTANTS.PANEL_POWER}W`,
    daily: `${dailyProduction}kWh`,
    monthly: `${(parseFloat(dailyProduction) * 30).toFixed(0)}kWh`,
    efficiency: `${Math.round(efficiency)}%`,
    status: efficiency < 90 ? 'kujdes' : 'aktiv',
    lastMaintenance: SYSTEM_CONSTANTS.INSTALLATION_DATE
  };
});

// Time range filters with better styling
const timeRanges = {
  day: 'Ditore',
  week: 'Javore',
  month: 'Mujore',
  year: 'Vjetore'
} as const;

type TimeRange = keyof typeof timeRanges;

// Add date range state
type DateRange = {
  start: Date;
  end: Date;
};

// Define chart data types
type LineChartDataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
  tension: number;
};

type BarChartDataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderRadius: number;
};

type ChartDataset = {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor: string;
  fill?: boolean;
  tension?: number;
  borderRadius?: number;
};

type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

// Enhanced data generation functions
const generateDailyData = (): ChartData => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  datasets: [{
    label: 'Prodhimi (kWh)',
    data: Array.from({ length: 24 }, () => Math.random() * 40 + 10),
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    fill: true,
    tension: 0.3
  }]
});

const generateWeeklyData = (): ChartData => ({
  labels: ['E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë', 'E Diel'],
  datasets: [{
    label: 'Prodhimi Javor (kWh)',
    data: Array.from({ length: 7 }, () => Math.random() * 300 + 100),
    backgroundColor: 'rgba(16, 185, 129, 0.85)',
    borderRadius: 6
  }]
});

const generateMonthlyData = (): ChartData => ({
  labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
  datasets: [{
    label: 'Prodhimi Mujor (kWh)',
    data: Array.from({ length: 30 }, () => Math.random() * 400 + 150),
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    fill: true,
    tension: 0.3
  }]
});

const generateYearlyData = (): ChartData => ({
  labels: ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'],
  datasets: [{
    label: 'Prodhimi Vjetor (kWh)',
    data: Array.from({ length: 12 }, () => Math.random() * 8000 + 3000),
    backgroundColor: 'rgba(16, 185, 129, 0.85)',
    borderRadius: 6
  }]
});

// Helper function to convert line data to bar data
const convertLineToBarData = (lineData: ChartData): ChartData => ({
  labels: lineData.labels,
  datasets: lineData.datasets.map(dataset => ({
    label: dataset.label,
    data: dataset.data,
    backgroundColor: dataset.backgroundColor,
    borderRadius: 6
  }))
});

// Define color constants for PDF
const pdfColors = {
  primary: [34, 197, 94] as [number, number, number], // green-500
  secondary: [59, 130, 246] as [number, number, number], // blue-500
  warning: [234, 179, 8] as [number, number, number], // yellow-500
  danger: [239, 68, 68] as [number, number, number], // red-500
  gray: [100, 100, 100] as [number, number, number],
  lightGray: [245, 245, 245] as [number, number, number]
};

// Adjust chart dimensions and margins
const chartDimensions = {
  width: 750,
  height: 350,
  marginX: 15,
  marginY: 20
};

// Add refresh interval constant
const REFRESH_INTERVAL = 10000; // 10 seconds

// Add new mock data for consumption
const tedhenaKonsumi = {
  ndricimi: {
    vlera: 25.4,
    perqindja: 30,
    tendenca: 'rritje',
    statusi: 'kujdes'
  },
  ngrohja: {
    vlera: 42.8,
    perqindja: 45,
    tendenca: 'ulje',
    statusi: 'normal'
  },
  laboratoret: {
    vlera: 31.2,
    perqindja: 25,
    tendenca: 'rritje',
    statusi: 'kritik'
  }
};

const keshillat = [
  {
    id: 1,
    mesazhi: "Fik ndriçimin në klasa pas orarit për të kursyer 12%",
    rendesia: "larte",
    kategoria: "ndricim"
  },
  {
    id: 2,
    mesazhi: "Optimizo ngrohjen sipas orarit të mësimit",
    rendesia: "mesme",
    kategoria: "ngrohje"
  },
  {
    id: 3,
    mesazhi: "Laboratorët kanë konsum të lartë - kontrollo pajisjet",
    rendesia: "larte",
    kategoria: "laborator"
  }
];

// Gjenerimi i të dhënave për konsumin orar
const gjeneroKonsuminOrar = () => {
  return {
    labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
    datasets: [
      {
        label: 'Klasa',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 30 + 10)),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Laboratorë',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 40 + 20)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Zyra',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20 + 5)),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };
};

// Shtojmë konstante të reja për filtrat
const EFFICIENCY_FILTERS = {
  all: 'Të gjitha',
  high: '> 95%',
  medium: '90-95%',
  low: '< 90%'
} as const;

const ALARM_FILTERS = {
  all: 'Të gjitha',
  high: 'Kritike',
  medium: 'Kujdes',
  low: 'Normale'
} as const;

type AlarmFilterType = keyof typeof ALARM_FILTERS;

// Types for maintenance contacts
type ContactInfo = {
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  available: string;
};

type MaintenanceContacts = {
  primary: ContactInfo;
  emergency: ContactInfo;
};

// Maintenance contact information
const MAINTENANCE_CONTACTS: MaintenanceContacts = {
  primary: {
    name: "Arben Krasniqi",
    company: "SolarTech Kosovo",
    phone: "+383 44 123 456",
    email: "info@solartechks.com",
    address: "Rr. Agim Ramadani, 10000 Prishtinë",
    available: "E Hënë - E Premte, 09:00 - 17:00"
  },
  emergency: {
    name: "Shërbimi 24/7",
    company: "SolarTech Emergency",
    phone: "+383 45 789 012",
    email: "emergency@solartechks.com",
    address: "Rr. Agim Ramadani, 10000 Prishtinë",
    available: "24/7 Shërbim Emergjent"
  }
};

// Helper function to get period type based on date range
const getPeriodType = (start: Date, end: Date): TimeRange => {
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return 'day';
  if (diffDays <= 7) return 'week';
  if (diffDays <= 31) return 'month';
  return 'year';
};

// Production and consumption data generator
const generateProductionConsumptionData = (start: Date, end: Date) => {
  const periodType = getPeriodType(start, end);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  let labels: string[] = [];
  let productionData: number[] = [];
  let consumptionData: number[] = [];

  switch (periodType) {
    case 'day':
      // Hourly data for a day
      labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
      productionData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 60 + 40));
      consumptionData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 50 + 30));
      break;
    case 'week':
      // Daily data for week
      for (let i = 0; i < diffDays; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        labels.push(date.toLocaleDateString('sq-AL', { weekday: 'short' }));
        productionData.push(Math.floor(Math.random() * 300 + 200));
        consumptionData.push(Math.floor(Math.random() * 250 + 150));
      }
      break;
    case 'month':
      // Daily data for month
      for (let i = 0; i < diffDays; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        labels.push(date.getDate().toString());
        productionData.push(Math.floor(Math.random() * 400 + 300));
        consumptionData.push(Math.floor(Math.random() * 350 + 250));
      }
      break;
    case 'year':
      // Monthly data for year
      const months = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'];
      labels = months;
      productionData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 8000 + 6000));
      consumptionData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 7000 + 5000));
      break;
  }

  return {
    labels,
    datasets: [
      {
        label: 'Prodhimi (kW)',
        data: productionData,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 4
      },
      {
        label: 'Konsumi (kW)',
        data: consumptionData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderRadius: 4
      }
    ]
  };
};

function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [darkMode, setDarkMode] = useState(false); // Changed to false for light mode default
  const [selectedRange, setSelectedRange] = useState<TimeRange>('day');
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  const [showAlarms, setShowAlarms] = useState(false);
  const [data, setData] = useState(generateMockData('day'));
  const [chartData, setChartData] = useState<ChartData>(generateDailyData());
  const [comparisonData, setComparisonData] = useState<ChartData>(generateWeeklyData());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [playAlertSound, setPlayAlertSound] = useState(false);
  const [shfaqKeshillat, setShfaqKeshillat] = useState(true);
  const [konsumOrar, setKonsumOrar] = useState(gjeneroKonsuminOrar());
  const [efficiencyFilter, setEfficiencyFilter] = useState('all');
  const [alarmFilter, setAlarmFilter] = useState<AlarmFilterType>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateRange, setExportDateRange] = useState({ start: '', end: '' });
  const [selectedExportData, setSelectedExportData] = useState({
    production: true,
    consumption: true,
    alarms: true,
    panels: true
  });
  const [showMaintenanceInfo, setShowMaintenanceInfo] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(),
    end: new Date()
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [prodConsData, setProdConsData] = useState(generateProductionConsumptionData(new Date(), new Date()));

  // Enhanced chart options with better visuals
  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: darkMode ? '#fff' : '#111827',
        bodyColor: darkMode ? '#fff' : '#111827',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 24, 39, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(17, 24, 39, 0.1)',
          display: true
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#4B5563',
          padding: 8,
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#4B5563',
          padding: 8,
          font: {
            size: 11
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        fill: true
      },
      point: {
        radius: 3,
        hoverRadius: 5
      },
      bar: {
        borderRadius: 4
      }
    }
  };

  // Helper function to get date range based on selected period
  const getDateRangeForPeriod = (period: TimeRange): DateRange => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    switch (period) {
      case 'day':
        return { start, end };
      case 'week':
        start.setDate(start.getDate() - 6);
        return { start, end };
      case 'month':
        start.setDate(start.getDate() - 29);
        return { start, end };
      case 'year':
        start.setMonth(start.getMonth() - 11);
        start.setDate(1);
        return { start, end };
      default:
        return { start, end };
    }
  };

  // Enhanced range selection handler
  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    const newDateRange = getDateRangeForPeriod(range);
    setDateRange(newDateRange);
    updateDashboardData(newDateRange);
  };

  // Function to handle custom date selection
  const handleDateRangeChange = (start: Date, end: Date) => {
    const newRange = { start, end };
    setDateRange(newRange);
    updateDashboardData(newRange);
    setShowDatePicker(false);
  };

  // Function to update all dashboard data based on date range
  const updateDashboardData = (range: DateRange) => {
    const { start, end } = range;

    // Update main metrics
    const newData = generateMockDataForRange(start, end);
    setData(newData);

    // Update all charts with the same time range
    setChartData(generateChartDataForRange(start, end));
    setComparisonData(generateComparisonDataForRange(start, end));
    setKonsumOrar(gjeneroKonsuminOrarForRange(start, end));
    setProdConsData(generateProductionConsumptionData(start, end));
  };

  // Enhanced data generation functions
  const generateMockDataForRange = (start: Date, end: Date) => {
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return {
      production: (Math.random() * 50 + 20 * diffDays).toFixed(2),
      savings: (Math.random() * 30 + 10 * diffDays).toFixed(2),
      co2: (Math.random() * 100 + 50 * diffDays).toFixed(2),
      status: Math.random() > 0.1 ? 'Aktiv' : 'Në pritje',
      activePanels: Math.min(SYSTEM_CONSTANTS.TOTAL_PANELS, 
        SYSTEM_CONSTANTS.TOTAL_PANELS - Math.floor(Math.random() * 2))
    };
  };

  // Update the chart data generation function
  const generateChartDataForRange = (start: Date, end: Date): ChartData => {
    const periodType = getPeriodType(start, end);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    let labels: string[] = [];
    let data: number[] = [];

    switch (periodType) {
      case 'day':
        // Hourly data for single day
        labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
        data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 40 + 20));
        break;
      case 'week':
        // Daily data for week
        for (let i = 0; i < diffDays; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          labels.push(date.toLocaleDateString('sq-AL', { weekday: 'short' }));
          data.push(Math.floor(Math.random() * 300 + 100));
        }
        break;
      case 'month':
        // Daily data for month
        for (let i = 0; i < diffDays; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          labels.push(date.getDate().toString());
          data.push(Math.floor(Math.random() * 400 + 150));
        }
        break;
      case 'year':
        // Monthly data for year
        labels = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'];
        data = Array.from({ length: 12 }, () => Math.floor(Math.random() * 8000 + 3000));
        break;
    }

    return {
      labels,
      datasets: [{
        label: 'Prodhimi (kWh)',
        data,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        fill: true,
        tension: 0.3
      }]
    };
  };

  // Update the comparison data generation function
  const generateComparisonDataForRange = (start: Date, end: Date): ChartData => {
    const periodType = getPeriodType(start, end);
    let labels: string[];
    let data: number[];

    switch (periodType) {
      case 'day':
        labels = ['Dje', 'Sot'];
        data = [Math.random() * 300 + 100, Math.random() * 300 + 100];
        break;
      case 'week':
        labels = ['Java e kaluar', 'Java aktuale'];
        data = [Math.random() * 2000 + 500, Math.random() * 2000 + 500];
        break;
      case 'month':
        labels = ['Muaji i kaluar', 'Muaji aktual'];
        data = [Math.random() * 8000 + 3000, Math.random() * 8000 + 3000];
        break;
      case 'year':
        labels = ['Viti i kaluar', 'Viti aktual'];
        data = [Math.random() * 90000 + 40000, Math.random() * 90000 + 40000];
        break;
    }

    return {
      labels,
      datasets: [{
        label: 'Krahasimi i Prodhimit (kWh)',
        data,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6
      }]
    };
  };

  // Update the consumption data generation function
  const gjeneroKonsuminOrarForRange = (start: Date, end: Date) => {
    const periodType = getPeriodType(start, end);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    let labels: string[] = [];

    switch (periodType) {
      case 'day':
        labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
        break;
      case 'week':
        for (let i = 0; i < diffDays; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          labels.push(date.toLocaleDateString('sq-AL', { weekday: 'short' }));
        }
        break;
      case 'month':
        for (let i = 0; i < diffDays; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          labels.push(date.getDate().toString());
        }
        break;
      case 'year':
        labels = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'];
        break;
    }

    const dataLength = labels.length;
    
    return {
      labels,
      datasets: [
        {
          label: 'Klasa',
          data: Array.from({ length: dataLength }, () => Math.floor(Math.random() * 30 + 10)),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Laboratorë',
          data: Array.from({ length: dataLength }, () => Math.floor(Math.random() * 40 + 20)),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Zyra',
          data: Array.from({ length: dataLength }, () => Math.floor(Math.random() * 20 + 5)),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  // Initialize data on component mount
  useEffect(() => {
    const initialRange = getDateRangeForPeriod('day');
    setDateRange(initialRange);
    updateDashboardData(initialRange);
  }, []);

  // Single interval for updating all dashboard data
  useEffect(() => {
    // Initial update
    const currentRange = getDateRangeForPeriod(selectedRange);
    updateDashboardData(currentRange);

    // Set up interval for periodic updates
    const interval = setInterval(() => {
      const currentRange = getDateRangeForPeriod(selectedRange);
      updateDashboardData(currentRange);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [selectedRange]); // Only re-run when selectedRange changes

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      exportToPDF();
    } else {
      exportToExcel();
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      let y = 20;

      // Add title
      doc.setFontSize(16);
      doc.text('SINTEZA - Raporti i Sistemit Solar', 105, y, { align: 'center' });
      y += 20;

      // Add date
      doc.setFontSize(12);
      doc.text(`Gjeneruar më: ${new Date().toLocaleString('sq-AL')}`, 20, y);
      y += 20;

      // Add main metrics
      doc.setFontSize(14);
      doc.text('Të dhënat kryesore:', 20, y);
      y += 10;

      // Parse numerical values and handle potential NaN
      const production = parseFloat(data.production) || 0;
      const savings = parseFloat(data.savings) || 0;
      const co2 = parseFloat(data.co2) || 0;

      doc.setFontSize(12);
      doc.text(`Prodhimi Total: ${production.toFixed(2)} kWh`, 30, y);
      y += 10;
      doc.text(`Kursimi: ${savings.toFixed(2)} €`, 30, y);
      y += 10;
      doc.text(`CO2 e Shmangur: ${co2.toFixed(2)} kg`, 30, y);
      y += 10;
      doc.text(`Panele Aktive: ${data.activePanels}`, 30, y);
      y += 20;

      // Add panel details
      doc.setFontSize(14);
      doc.text('Detajet e Paneleve:', 20, y);
      y += 10;

      detailedPanelData.forEach((panel) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(12);
        doc.text(`Panel ${panel.id}: ${panel.location}`, 30, y);
        y += 7;
        doc.text(`Fuqia: ${panel.power}, Eficienca: ${panel.efficiency}`, 40, y);
        y += 7;
        doc.text(`Prodhimi Ditor: ${panel.daily}, Mujor: ${panel.monthly}`, 40, y);
        y += 10;
      });

      // Add alarms if any
      if (filteredAlarms.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.text('Alarmet Aktive:', 20, y);
        y += 10;

        filteredAlarms.forEach((alarm) => {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(12);
          doc.text(`${alarm.severity.toUpperCase()}: ${alarm.message}`, 30, y);
          y += 7;
          doc.text(`Koha: ${alarm.time}`, 40, y);
          y += 10;
        });
      }

      // Save the PDF
      doc.save('raport-sinteza.pdf');
    } catch (error) {
      console.error('Gabim gjatë gjenerimit të PDF:', error);
    }
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const worksheetData = [
      // Headers
      ['Raporti i Sistemit Solar'],
      ['Gjeneruar më:', new Date().toLocaleString('sq-AL')],
      [],
      ['Performanca e Sistemit'],
      ['Uptime', systemPerformance.uptime],
      ['Eficienca', systemPerformance.efficiency],
      ['Panele Totale', systemPerformance.totalPanels],
      ['Panele Aktive', systemPerformance.activePanels],
      [],
      ['Të Dhënat e Prodhimit'],
      ['Prodhimi Total', `${data.production} kWh`],
      ['Kursimi', `${data.savings} €`],
      ['CO2 e Shmangur', `${data.co2} kg`],
      [],
      ['Detaje të Paneleve'],
      ['ID', 'Vendndodhja', 'Fuqia', 'Prodhimi Ditor', 'Prodhimi Mujor', 'Eficienca', 'Statusi', 'Mirëmbajtja e Fundit'],
      ...detailedPanelData.map(panel => [
        panel.id,
        panel.location,
        panel.power,
        panel.daily,
        panel.monthly,
        panel.efficiency,
        panel.status,
        new Date(panel.lastMaintenance).toLocaleDateString('sq-AL')
      ]),
      [],
      ['Alarmet Aktive'],
      ['Rëndësia', 'Mesazhi', 'Koha', 'Statusi'],
      ...alarms.map(alarm => [
        alarm.severity,
        alarm.message,
        alarm.time,
        alarm.status
      ])
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Raporti');

    // Save Excel file
    XLSX.writeFile(wb, 'raport-sistemi-solar.xlsx');
  };

  const getAlarmSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'medium':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'low':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  // Kontrollojmë nëse duhet të shfaqim njoftimin e mirëmbajtjes
  const shouldShowMaintenanceNotice = () => {
    return false; // Gjithmonë kthejmë false që të mos shfaqet shiriti
  };

  // Filtrojmë panelet sipas efiçencës
  const filteredPanels = detailedPanelData.filter(panel => {
    const efficiency = parseInt(panel.efficiency);
    switch(efficiencyFilter) {
      case 'high': return efficiency > 95;
      case 'medium': return efficiency >= 90 && efficiency <= 95;
      case 'low': return efficiency < 90;
      default: return true;
    }
  });

  // Filtrojmë alarmet sipas rëndësisë
  const filteredAlarms = alarms.filter(alarm => {
    if (alarmFilter === 'all') return true;
    return alarm.severity === alarmFilter;
  });

  return (
    <div className={`p-4 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with improved filters */}
      <div className="flex flex-col gap-4 mb-6 sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700" 
           style={{ backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(249, 250, 251, 0.95)' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Paneli i Monitorimit</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-600'} shadow-sm`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowMaintenanceInfo(true)}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Informacion</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Time Range Filter - Single Row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Shfaq:</span>
              </div>
              <div className={`flex rounded-xl shadow-sm ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-100/80'
              }`}>
                {Object.entries(timeRanges).map(([key, label], index) => (
                  <button
                    key={key}
                    onClick={() => handleRangeChange(key as TimeRange)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200
                              ${index === 0 ? 'rounded-l-xl' : ''} 
                              ${index === Object.entries(timeRanges).length - 1 ? 'rounded-r-xl' : ''}
                              ${selectedRange === key
                                ? `${darkMode 
                                    ? 'bg-emerald-500 text-white shadow-sm z-10' 
                                    : 'bg-emerald-500 text-white shadow-sm z-10'}`
                                : `${darkMode
                                    ? 'text-gray-300 hover:bg-gray-600 hover:text-white'
                                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`
                              } ${index !== Object.entries(timeRanges).length - 1 ? 'border-r border-gray-200 dark:border-gray-600' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-opacity-50 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2
                           hover:bg-red-500 hover:text-white
                           text-red-600 dark:text-red-400"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2
                           hover:bg-emerald-500 hover:text-white
                           text-emerald-600 dark:text-emerald-400"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Excel</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} w-[400px]`}>
            <h3 className="text-lg font-semibold mb-4">Zgjidh Periudhën</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Data e fillimit</label>
                <input
                  type="date"
                  value={dateRange.start.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newStart = new Date(e.target.value);
                    setDateRange(prev => ({ ...prev, start: newStart }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Data e mbarimit</label>
                <input
                  type="date"
                  value={dateRange.end.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newEnd = new Date(e.target.value);
                    setDateRange(prev => ({ ...prev, end: newEnd }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                >
                  Anulo
                </button>
                <button
                  onClick={() => {
                    handleDateRangeChange(dateRange.start, dateRange.end);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Apliko
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Njoftimi i Mirëmbajtjes */}
      {shouldShowMaintenanceNotice() && (
        <div className={`mb-4 p-4 rounded-xl ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'} border border-yellow-200`}>
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-yellow-700 dark:text-yellow-400">
                Mirëmbajtja e Ardhshme
              </h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                Mirëmbajtja e radhës është planifikuar për {new Date(systemPerformance.nextMaintenance).toLocaleDateString('sq-AL')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weather Section - Updated */}
      <div className="mb-4">
        <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {weatherData.condition === 'me diell' ? (
                  <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : weatherData.condition === 'pjesërisht me re' ? (
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">{weatherData.temperature}°C</span>
                <span className="text-sm opacity-70 capitalize">{weatherData.condition}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <div className="text-sm font-medium">{weatherData.sunlightHours} orë</div>
                <div className="text-xs opacity-70">diell</div>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm">{weatherData.sunriseTime}</span>
              </div>
              <span className="text-sm opacity-70">→</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="text-sm">{weatherData.sunsetTime}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex items-center gap-3">
              <div className={`text-center px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className={`text-sm font-medium ${
                  weatherData.impact === 'optimal' ? 'text-emerald-500' :
                  weatherData.impact === 'mesatar' ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {weatherData.impact === 'optimal' ? 'Optimal' :
                   weatherData.impact === 'mesatar' ? 'Mesatar' : 'I Ulët'}
                </div>
                <div className="text-xs opacity-70">ndikimi</div>
              </div>
              <div className={`text-center px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-sm font-medium">
                  {weatherData.forecast[1].temp}°C
                </div>
                <div className="text-xs opacity-70">nesër</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-9 space-y-3">
          {/* Main Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { 
                title: 'Prodhimi Total', 
                value: selectedRange === 'year' ? 
                  `${(parseFloat(data.production) / 1000).toFixed(2)} MWh` : 
                  `${data.production} kWh`,
                color: 'emerald',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                change: '+5.2%'
              },
              { 
                title: 'Kursimi', 
                value: `${data.savings} €`,
                color: 'blue',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                change: '+3.8%'
              },
              { 
                title: 'CO2 e Shmangur', 
                value: selectedRange === 'year' ? 
                  `${(parseFloat(data.co2) / 1000).toFixed(2)} ton` : 
                  `${data.co2} kg`,
                color: 'amber',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                change: '+4.5%'
              },
              { 
                title: 'Panele Aktive', 
                value: `${systemPerformance.activePanels}/${SYSTEM_CONSTANTS.TOTAL_PANELS}`,
                color: 'purple',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                change: '100%'
              }
            ].map((stat, index) => (
              <div key={index} 
                   className={`p-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md
                             bg-gradient-to-br
                             ${stat.color === 'emerald' ? 'from-emerald-500/10 to-emerald-600/10 border-l-2 border-emerald-500' :
                               stat.color === 'blue' ? 'from-blue-500/10 to-blue-600/10 border-l-2 border-blue-500' :
                               stat.color === 'amber' ? 'from-amber-500/10 to-amber-600/10 border-l-2 border-amber-500' :
                               'from-purple-500/10 to-purple-600/10 border-l-2 border-purple-500'}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className={`p-1 rounded-md
                                ${stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-600' :
                                  stat.color === 'blue' ? 'bg-blue-500/20 text-blue-600' :
                                  stat.color === 'amber' ? 'bg-amber-500/20 text-amber-600' :
                                  'bg-purple-500/20 text-purple-600'}`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full
                                ${stat.change.startsWith('+') 
                                  ? 'bg-emerald-500/10 text-emerald-600' 
                                  : 'bg-red-500/10 text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-base font-medium mb-0.5 opacity-80">{stat.title}</h3>
                <p className={`text-lg font-bold
                            ${stat.color === 'emerald' ? 'text-emerald-600' :
                              stat.color === 'blue' ? 'text-blue-600' :
                              stat.color === 'amber' ? 'text-amber-600' :
                              'text-purple-600'}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Main Chart */}
          <div className={`p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Prodhimi Aktual</h3>
              <div className="text-sm opacity-70">
                Përditësuar {currentTime.toLocaleTimeString('sq-AL')}
              </div>
            </div>
            <div className="h-[300px]">
              {selectedRange === 'week' || selectedRange === 'year' ? 
                <Bar data={chartData} options={chartOptions} /> :
                <Line data={chartData} options={chartOptions} />
              }
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-3 space-y-3">
          {/* System Performance */}
          <div className={`p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-3">Performanca e Sistemit</h3>
            <div className="space-y-[13.2px]">
              {[
                { title: 'Uptime', value: systemPerformance.uptime },
                { title: 'Eficienca', value: systemPerformance.efficiency },
                { title: 'Panele Totale', value: systemPerformance.totalPanels },
                { title: 'Mirëmbajtja', value: new Date(systemPerformance.nextMaintenance).toLocaleDateString('sq-AL') },
                { title: 'Kontrolli', value: new Date(systemPerformance.lastCheck).toLocaleDateString('sq-AL') }
              ].map((metric, index) => (
                <div key={index} 
                     className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="text-sm opacity-70">{metric.title}</div>
                  <div className="text-lg font-semibold">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seksioni i Menaxhimit të Konsumit */}
        <div className="col-span-12 mt-6">
          <div className={`rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Menaxhimi i Konsumit të Energjisë
              </h2>
            </div>

            <div className="p-4 space-y-6">
              {/* Kartat e Konsumit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(tedhenaKonsumi).map(([celesi, tedhena]) => (
                  <div key={celesi} 
                       className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}
                                 ${tedhena.statusi === 'kritik' ? 'animate-pulse ring-2 ring-red-500' : ''}
                                 transition-all duration-300`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium capitalize">
                        {celesi === 'ndricimi' ? 'Ndriçimi' :
                         celesi === 'ngrohja' ? 'Ngrohja' : 'Laboratorët'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                             ${tedhena.statusi === 'kritik' ? 'bg-red-100 text-red-700' :
                               tedhena.statusi === 'kujdes' ? 'bg-amber-100 text-amber-700' :
                               'bg-emerald-100 text-emerald-700'}`}>
                        {tedhena.statusi === 'kritik' ? 'Kritik' :
                         tedhena.statusi === 'kujdes' ? 'Kujdes' : 'Normal'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold mb-2">{tedhena.vlera} kW</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-600">
                          <div className={`h-2 rounded-full ${
                            tedhena.statusi === 'kritik' ? 'bg-red-500' :
                            tedhena.statusi === 'kujdes' ? 'bg-amber-500' :
                            'bg-emerald-500'}`}
                               style={{ width: `${tedhena.perqindja}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{tedhena.perqindja}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grafiqet */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Konsumi Orar */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="text-lg font-medium mb-4">Konsumi sipas Orëve (kW)</h3>
                  <div className="h-[250px]">
                    <Line
                      data={konsumOrar}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top' as const,
                            align: 'end' as const,
                            labels: {
                              boxWidth: 12,
                              padding: 15,
                              font: { size: 11 }
                            }
                          },
                          tooltip: {
                            backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            titleColor: darkMode ? '#fff' : '#111827',
                            bodyColor: darkMode ? '#fff' : '#111827',
                            padding: 10,
                            cornerRadius: 4,
                            callbacks: {
                              label: (context) => {
                                const value = context.raw as number;
                                return ` ${context.dataset.label}: ${value.toFixed(1)} kW`;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            grid: { display: false },
                            ticks: {
                              maxRotation: 45,
                              minRotation: 45,
                              font: { size: 10 }
                            }
                          },
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                              font: { size: 10 },
                              callback: (value) => `${value} kW`
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Krahasimi */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="text-lg font-medium mb-4">Prodhimi dhe Konsumi Total</h3>
                  <div className="h-[250px]">
                    <Bar
                      data={prodConsData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          title: { display: false }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Details - Moved to bottom */}
        {isAdmin && (
          <div className="col-span-12">
            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Detaje për Panelet</h3>
                <div className="flex items-center gap-3">
                  <select
                    value={efficiencyFilter}
                    onChange={(e) => setEfficiencyFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                    }`}
                  >
                    {Object.entries(EFFICIENCY_FILTERS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowDetailedTable(!showDetailedTable)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {showDetailedTable ? 'Mbyll tabelën' : 'Shfaq tabelën'}
                  </button>
                </div>
              </div>
              {showDetailedTable && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} sticky top-0`}>
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Vendndodhja</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Fuqia</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Prodhimi Ditor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Prodhimi Mujor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Eficienca</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Statusi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredPanels.map((panel) => (
                        <tr key={panel.id} 
                            className={`text-sm transition-colors duration-150 cursor-pointer
                                      ${selectedPanel === panel.id ? 
                                        (darkMode ? 'bg-gray-700' : 'bg-gray-100') : 
                                        'hover:bg-opacity-50'}`}
                            onClick={() => setSelectedPanel(panel.id === selectedPanel ? null : panel.id)}>
                          <td className="px-4 py-3">{panel.id}</td>
                          <td className="px-4 py-3">{panel.location}</td>
                          <td className="px-4 py-3">{panel.power}</td>
                          <td className="px-4 py-3">{panel.daily}</td>
                          <td className="px-4 py-3">{panel.monthly}</td>
                          <td className="px-4 py-3">
                            <span className={parseFloat(panel.efficiency) < 90 ? 'text-amber-500' : 'text-emerald-500 font-medium'}>
                              {panel.efficiency}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              panel.status === 'aktiv' 
                                ? 'bg-emerald-900/20 text-emerald-500' 
                                : 'bg-amber-900/20 text-amber-500'
                            }`}>
                              {panel.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alarms - Moved to bottom */}
        {isAdmin && (
          <div className="col-span-12">
            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">
                  Alarmet Aktive
                  {!showAlarms && filteredAlarms.length > 3 && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({filteredAlarms.length - 3} të tjera)
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-3">
                  <select
                    value={alarmFilter}
                    onChange={(e) => setAlarmFilter(e.target.value as AlarmFilterType)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                    }`}
                  >
                    {Object.entries(ALARM_FILTERS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {filteredAlarms.length > 3 && (
                    <button
                      onClick={() => setShowAlarms(!showAlarms)}
                      className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {showAlarms ? 'Mbyll listën' : 'Shfaq të gjitha'}
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {(showAlarms ? filteredAlarms : filteredAlarms.slice(0, 3)).map(alarm => (
                  <div
                    key={alarm.id}
                    className={`p-3 rounded-lg ${getAlarmSeverityColor(alarm.severity)} 
                               transition-all duration-300 hover:scale-102`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm">
                        <div className="font-medium">{alarm.message}</div>
                        <div className="opacity-70 text-xs mt-1.5">
                          {alarm.status === 'active' ? 'Aktiv' : 'Zgjidhur'} • {alarm.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredAlarms.length === 0 && (
                  <div className={`p-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Nuk ka alarme aktive për momentin
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Këshillat - Moved to bottom */}
        {user && (
          <div className="col-span-12">
            {shfaqKeshillat && (
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Këshilla për Kursim</h3>
                      <button
                        onClick={() => setShfaqKeshillat(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {keshillat.map(keshilla => (
                        <div key={keshilla.id} 
                             className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600/50' : 'bg-white'}
                                       ${keshilla.rendesia === 'larte' ? 'border-l-4 border-red-500' : 
                                         'border-l-4 border-amber-500'}`}>
                          <p className="text-sm">{keshilla.mesazhi}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modali i Eksportit të Personalizuar */}
      {isAdmin && showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} w-[500px]`}>
            <h3 className="text-lg font-semibold mb-4">Eksporto të Dhënat</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Data e fillimit</label>
                  <input
                    type="date"
                    value={exportDateRange.start}
                    onChange={(e) => setExportDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Data e mbarimit</label>
                  <input
                    type="date"
                    value={exportDateRange.end}
                    onChange={(e) => setExportDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm mb-2">Zgjidh të dhënat</label>
                {Object.entries({
                  production: 'Prodhimi',
                  consumption: 'Konsumi',
                  alarms: 'Alarmet',
                  panels: 'Panelet'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedExportData[key]}
                      onChange={(e) => setSelectedExportData(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                      className="rounded text-emerald-500"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                >
                  Mbyll
                </button>
                <button
                  onClick={() => {
                    handleExport('pdf');
                    setShowExportModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  PDF
                </button>
                <button
                  onClick={() => {
                    handleExport('excel');
                    setShowExportModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informacioni për Mirëmbajtje - Dizajn i Përmirësuar */}
      {isAdmin && showMaintenanceInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} w-[650px] max-h-[85vh] overflow-y-auto`}>
            {/* Header më i vogël */}
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Informacion për Mirëmbajtje</h3>
              </div>
              <button
                onClick={() => setShowMaintenanceInfo(false)}
                className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Specifikimet e Panelit */}
              <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="px-4 py-2.5 bg-emerald-500/10">
                  <h4 className="text-sm font-medium text-emerald-500">Specifikimet e Panelit të Kërkuar</h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} flex items-center gap-3`}>
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Fuqia</div>
                        <div className="text-sm font-medium">{SYSTEM_CONSTANTS.PANEL_POWER}W</div>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} flex items-center gap-3`}>
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Garancia</div>
                        <div className="text-sm font-medium">10 Vjet Minimum</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kontaktet */}
              <div className="grid grid-cols-2 gap-4">
                {/* Instaluesi Kryesor */}
                <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="px-4 py-2.5 bg-blue-500/10">
                    <h4 className="text-sm font-medium text-blue-500">Instaluesi i Autorizuar</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Kompania</div>
                        <div className="text-sm font-medium">{MAINTENANCE_CONTACTS.primary.company}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Telefon</div>
                        <div className="text-sm font-medium">{MAINTENANCE_CONTACTS.primary.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Email</div>
                        <div className="text-sm font-medium">{MAINTENANCE_CONTACTS.primary.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Adresa</div>
                        <div className="text-sm font-medium">{MAINTENANCE_CONTACTS.primary.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shërbimi Emergjent */}
                <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="px-4 py-2.5 bg-red-500/10">
                    <h4 className="text-sm font-medium text-red-500">Shërbimi Emergjent 24/7</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Kontakt</div>
                        <div className="text-sm font-medium">{MAINTENANCE_CONTACTS.emergency.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Telefon</div>
                        <div className="text-sm font-medium">{MAINTENANCE_CONTACTS.emergency.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">Email</div>
                        <div className="text-sm font-medium">{MAINTENANCE_CONTACTS.emergency.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Procedura */}
              <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="px-4 py-2.5 bg-purple-500/10">
                  <h4 className="text-sm font-medium text-purple-500">Procedura e Zëvendësimit</h4>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {[
                      'Kontaktoni instaluesin e autorizuar për inspektim',
                      'Prisni vlerësimin dhe konfirmimin e përputhshmërisë së panelit',
                      'Planifikoni datën e zëvendësimit',
                      'Sigurohuni që sistemi të jetë i fikur gjatë zëvendësimit',
                      'Pas instalimit, prisni konfirmimin e teknikut për rifillimin e sistemit'
                    ].map((hapi, index) => (
                      <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} flex items-center gap-3`}>
                        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                          <div className="w-4 h-4 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                        </div>
                        <div className="text-sm">{hapi}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Butoni i Mbylljes */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowMaintenanceInfo(false)}
                  className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 
                           transition-colors duration-200 inline-flex items-center gap-2"
                >
                  <span>Kuptova</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard; 
