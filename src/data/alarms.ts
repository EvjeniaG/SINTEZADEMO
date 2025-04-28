export interface Alarm {
  id: number;
  severity: 'high' | 'medium' | 'low';
  message: string;
  time: string;
  status: 'active' | 'resolved';
}

export const alarms: Alarm[] = [
  { 
    id: 1, 
    severity: 'high', 
    message: 'Panel #12 ka nevojë për pastrim urgjent - Eficienca 87%', 
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