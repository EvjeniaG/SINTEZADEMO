# SINTEZA - Platforma e Shkollës Diellore Inteligjente 🌞

## Përshkrimi
SINTEZA është një platformë inovative që kombinon teknologjinë diellore me edukimin modern për një të ardhme më të qëndrueshme. Projekti është implementuar në Shkollën Profesionale Teknike të Korçës, duke e bërë atë shkollën e parë pioniere në zbatimin e projektit të Shkollës Diellore Inteligjente në Shqipëri.

## Teknologjitë e Përdorura

### Frontend
- **React.js** - Libraria kryesore për ndërtimin e ndërfaqes
- **TypeScript** - Për tip-safe development
- **Tailwind CSS** - Për stilizim modern dhe responsive
- **Framer Motion** - Për animacione të sofistikuara
- **React Router** - Për navigim të brendshëm
- **@lottiefiles/react-lottie-player** - Për animacione komplekse

### Arkitektura e Projektit
```
sinteza/
├── src/
│   ├── components/        # Komponentët e ripërdorshëm
│   ├── pages/            # Faqet kryesore
│   ├── hooks/            # Custom React hooks
│   ├── assets/           # Asetet (imazhe, fonts, etj.)
│   └── App.tsx           # Komponenti kryesor
```

## Funksionalitetet Kryesore

### 1. Sistemi i Autentifikimit
- Login/Register për përdoruesit
- Role të ndryshme (admin, user)
- Menaxhim i sesioneve

### 2. Dashboard
- Monitorim në kohë reale i prodhimit të energjisë
- Statistika dhe analiza
- Vizualizime interaktive të të dhënave

### 3. Zona Edukative
- **Kuize Interaktive**
  - Teste për njohuritë mbi energjinë diellore
  - Sistem pikëzimi dhe progres tracking
  
- **Video-Mësime**
  - Materiale edukative të strukturuara
  - Tutoriale praktike

- **Simulime**
  - Paneli Solar (simulim i prodhimit të energjisë)
  - Sistemi i Baterisë (analiza e ruajtjes së energjisë)
  - Konsumi (monitorimi i konsumit të energjisë)
  - ROI Calculator (llogaritja e kthimit të investimit)

### 4. Ndërfaqja e Përdoruesit
- Design modern dhe responsiv
- Animacione të sofistikuara
- Navigim intuitiv
- Përshtatje për të gjitha pajisjet (mobile-first approach)


## Struktura e Llogarive

### Llojet e Përdoruesve
1. **Admin**
   - Akses i plotë në platformë
   - Menaxhim i përdoruesve
   - Monitorim i të dhënave

2. **Përdorues i Thjeshtë**
   - Akses në dashboard
   - Pjesëmarrje në kuize
   - Shikimi i video-mësimeve
   - Përdorimi i simulimeve


## Falenderime
- Shkolla Profesionale Teknike Korçë për bashkëpunimin
- Të gjithë kontribuesit dhe zhvilluesit
- Komunitetin e React dhe TypeScript 

## Llogaritjet dhe Formula (Me Shembuj)

### Dashboard

#### 1. Llogaritja e Prodhimit të Energjisë
```typescript
// Formula bazë për prodhimin e energjisë diellore
const energyProduction = (solarIrradiance * panelEfficiency * panelArea * (1 - systemLosses)) / 1000;

// Shembull me numra realë:
// solarIrradiance = 1000 W/m² (ditë me diell)
// panelEfficiency = 0.18 (18% efikasitet)
// panelArea = 100 m² (50 panele x 2m² secili)
// systemLosses = 0.16 (16% humbje)

const example = (1000 * 0.18 * 100 * (1 - 0.16)) / 1000;
// = 15.12 kW prodhim në kushte optimale
```

#### 2. Efikasiteti i Sistemit
```typescript
// Llogaritja e performancës ratio (PR)
const performanceRatio = actualEnergy / theoreticalEnergy;
// Shembull: 13.5 kW / 15.12 kW = 0.89 ose 89% PR

// Efikasiteti total i sistemit
const systemEfficiency = (actualOutput / theoreticalMaxOutput) * 100;
// Shembull: (13500 W / 16000 W) * 100 = 84.375%
```

#### 3. Analiza Financiare
```typescript
// Kursimi mujor
const monthlySavings = monthlyEnergyProduction * electricityPrice;
// Shembull: 3000 kWh * 0.12 €/kWh = 360 € në muaj

// Periudha e kthimit të investimit (ROI)
const paybackPeriod = totalSystemCost / annualSavings;
// Shembull: 25000 € / 4320 € = 5.79 vjet
```

### Simulimet

#### 1. Simulimi i Panelit Solar

##### Prodhimi Ditor
```typescript
// Prodhimi për çdo orë
const hourlyProduction = (solarIrradiance, temperature) => {
  const temperatureCoefficient = -0.0035; // %/°C
  const standardTestTemp = 25; // °C
  
  // Korrigjimi për temperaturën
  const tempCorrection = 1 + temperatureCoefficient * (temperature - standardTestTemp);
  
  return solarIrradiance * panelEfficiency * tempCorrection;
};

// Shembull:
// solarIrradiance = 800 W/m²
// temperature = 30°C
// Rezultati: 800 * 0.18 * (1 + (-0.0035 * (30 - 25)))
// = 800 * 0.18 * 0.9825 = 141.48 W/m²

// Prodhimi ditor total për 8 orë diell:
// 141.48 W/m² * 8 orë = 1131.84 Wh/m² ≈ 1.13 kWh/m²
```

##### Humbjet e Sistemit
```typescript
const systemLosses = {
  soiling: 0.02,        // Ndotja 2% = 20W nga 1000W
  shading: 0.03,        // Hijet 3% = 30W nga 1000W
  wiring: 0.02,         // Kabllimi 2% = 20W nga 1000W
  inverter: 0.04,       // Inverteri 4% = 40W nga 1000W
  temperature: 0.05,    // Temperatura 5% = 50W nga 1000W
  total: 0.16           // Totali 16% = 160W humbje nga 1000W
};

// Shembull prodhimi aktual:
// theoreticalProduction = 1000W
const actualProduction = 1000 * (1 - 0.16); // = 840W prodhim real
```

#### 2. Simulimi i Baterisë

##### Kapaciteti i Baterisë
```typescript
// Llogaritja e kapacitetit të disponueshëm
const availableCapacity = (totalCapacity, depthOfDischarge) => {
  return totalCapacity * depthOfDischarge;
};
// Shembull: 10kWh * 0.8 = 8kWh kapacitet i përdorshëm

// Gjendja e karikimit (State of Charge - SoC)
const calculateSoC = (currentEnergy, totalCapacity) => {
  return (currentEnergy / totalCapacity) * 100;
};
// Shembull: (6kWh / 10kWh) * 100 = 60% SoC
```

##### Efikasiteti i Karikimit
```typescript
const chargingEfficiency = 0.95; // 95% efikasitet

// Energjia e ruajtur
// Shembull: 1000Wh input
const storedEnergy = 1000 * 0.95; // = 950Wh energji e ruajtur

// Cikli i jetës për DoD 80%
const batteryLifeCycles = 0.8; // DoD
const cycles = Math.round(7000 - (5000 * 0.8)); // = 3000 cikle
```

#### 3. Simulimi i Konsumit

##### Llogaritja e Konsumit
```typescript
// Konsumi ditor për pajisje
const deviceConsumption = (powerRating, hoursUsed) => {
  return (powerRating * hoursUsed) / 1000; // në kWh
};
// Shembull: Kompjuter 200W * 8 orë = 1.6 kWh/ditë

// Konsumi total për 5 pajisje:
// 1. Kompjuter: 1.6 kWh
// 2. Ndriçim: 0.5 kWh
// 3. Printer: 0.3 kWh
// 4. AC: 2.4 kWh
// 5. Servera: 3.2 kWh
// Totali = 8 kWh/ditë
```

#### 4. ROI Calculator

##### Kthimi i Investimit
```typescript
// Shembull llogaritje ROI për sistem 25000€:
const example = {
  systemCost: 25000,
  annualSavings: 4320, // 360€ * 12 muaj
  electricityPriceIncrease: 0.03 // 3% rritje vjetore
};

// Rezultatet pas 10 vjetësh:
// Kursimet totale: 47520€
// ROI: ((47520 - 25000) / 25000) * 100 = 90.08%
```

##### Analiza e Kursimeve të CO2
```typescript
// Për prodhim vjetor 36000 kWh:
const co2Savings = 36000 * 0.85; // = 30600 kg CO2 = 30.6 ton CO2/vit
```

### Faktorët e Ndikimit në Llogaritje (Vlerat Tipike për Korçë)

1. **Faktorët Mjedisorë**
   - Temperatura mesatare verore: 25-30°C
   - Temperatura mesatare dimërore: 0-10°C
   - Rrezatimi mesatar ditor: 4.2 kWh/m²/ditë
   - Ditë me diell në vit: ~280

2. **Faktorët Teknikë**
   - Orientimi optimal: 180° (Jug)
   - Këndi optimal: 35°
   - Degradimi vjetor: 0.7%
   - Efikasiteti i inverterit: 97%

3. **Faktorët Ekonomikë**
   - Çmimi aktual i energjisë: 0.12 €/kWh
   - Rritja vjetore e çmimit: 3%
   - Kosto mirëmbajtje: 250€/vit
   - Jetëgjatësia e garantuar: 25 vjet 

## Formulat Fizike dhe Matematikore

### 1. Energjia Diellore dhe Rrezatimi

#### Energjia e Rrezatimit Diellor
Energjia e rrezatimit që bie në një sipërfaqe:
E = ∫(I₀ × cosθ) dt

Ku:
- I₀ = Konstanta diellore (≈ 1361 W/m²)
- θ = Këndi midis rrezeve dhe normales së sipërfaqes
- t = Koha

#### Ligji i Stefan-Boltzmann
Fuqia e rrezatuar nga sipërfaqja:
P = εσT⁴

Ku:
- ε = Emetiviteti i sipërfaqes
- σ = Konstanta e Stefan-Boltzmann (5.67 × 10⁻⁸ W/m²K⁴)
- T = Temperatura absolute (K)

### 2. Efekti Fotoelektrik në Panele

#### Energjia e Fotonit
E = hf = hc/λ

Ku:
- h = Konstanta e Planck (6.626 × 10⁻³⁴ J·s)
- f = Frekuenca e dritës
- c = Shpejtësia e dritës (3 × 10⁸ m/s)
- λ = Gjatësia e valës

#### Rendimenti Kuantik
η = (elektronet e gjeneruara)/(fotonet e absorbuara)

### 3. Termodinamika e Sistemit

#### Ekuacioni i Nxehtësisë
Q = mcΔT

Ku:
- m = Masa e panelit
- c = Nxehtësia specifike
- ΔT = Ndryshimi i temperaturës

#### Humbjet Termike
dQ/dt = -k × A × (T₁ - T₂)/d

Ku:
- k = Përcjellshmëria termike
- A = Sipërfaqja
- d = Trashësia e materialit
- T₁, T₂ = Temperaturat në sipërfaqe të ndryshme

### 4. Elektromagnetizmi

#### Ligji i Ohm-it për Sistemin
V = IR

Ku:
- V = Tensioni
- I = Rryma
- R = Rezistenca totale

#### Fuqia Elektrike
P = VI = I²R = V²/R

### 5. Rendimenti i Konvertimit

#### Rendimenti i Panelit
η = (Energjia elektrike e prodhuar)/(Energjia diellore e marrë) × 100%

#### Faktori i Mbushjes (Fill Factor)
FF = (Vmp × Imp)/(Voc × Isc)

Ku:
- Vmp = Tensioni në pikën e fuqisë maksimale
- Imp = Rryma në pikën e fuqisë maksimale
- Voc = Tensioni i qarkut të hapur
- Isc = Rryma e qarkut të shkurtër

### 6. Sistemet e Ruajtjes së Energjisë

#### Kapaciteti i Baterisë
C = Q/V

Ku:
- C = Kapaciteti (Farad)
- Q = Ngarkesa (Coulomb)
- V = Tensioni (Volt)

#### Energjia e Ruajtur
E = ½CV²

### 7. Gjeometria Diellore

#### Këndi i Deklinacionit Diellor
δ = 23.45° × sin(360/365 × (284 + n))

Ku:
- n = Dita e vitit (1-365)

#### Këndi i Lartësisë së Diellit
sin(α) = sin(φ)sin(δ) + cos(φ)cos(δ)cos(ω)

Ku:
- α = Këndi i lartësisë
- φ = Gjerësia gjeografike
- δ = Deklinacioni
- ω = Këndi orar

### 8. Analiza e Performancës

#### Koeficienti i Performancës (COP)
COP = (Energjia e dobishme)/(Energjia e harxhuar)

#### Faktori i Kapacitetit
CF = (Energjia aktuale e prodhuar)/(Energjia maksimale e mundshme)

### 9. Degradimi i Sistemit

#### Ligji i Degradimit Eksponencial
P(t) = P₀e⁻ᵏᵗ

Ku:
- P(t) = Fuqia në kohën t
- P₀ = Fuqia fillestare
- k = Konstanta e degradimit
- t = Koha

### 10. Analiza Ekonomike

#### Vlera Aktuale Neto (NPV)
NPV = -C₀ + ∑(Cₙ/(1+r)ⁿ)

Ku:
- C₀ = Investimi fillestar
- Cₙ = Fluksi i parave në vitin n
- r = Norma e skontimit
- n = Viti

### 11. Impakti Mjedisor

#### Reduktimi i CO₂
ΔCO₂ = E × f

Ku:
- E = Energjia e prodhuar (kWh)
- f = Faktori i konvertimit CO₂/kWh

### 12. Parametrat e Rrezatimit

#### Rrezatimi i Përgjithshëm
Gt = Gb × Rb + Gd × Rd + (Gb + Gd) × Rr

Ku:
- Gt = Rrezatimi total në sipërfaqen e pjerrët
- Gb = Rrezatimi direkt
- Gd = Rrezatimi difuz
- Rb, Rd, Rr = Faktorët gjeometrikë përkatës 

## Veprimet dhe Formulat e Implementuara

### 1. Monitorimi në Kohë Reale (Dashboard)

#### Prodhimi Aktual i Energjisë
Fuqia momentale e prodhuar:
P = G × A × η × cosθ × (1 - L)

Ku:
- G = Rrezatimi aktual (W/m²)
- A = Sipërfaqja aktive e paneleve
- η = Rendimenti i panelit
- θ = Këndi i rënies së rrezeve
- L = Humbjet totale të sistemit

#### Efikasiteti Aktual
Llogaritja e efikasitetit në kohë reale:
η_real = (P_out / P_in) × [1 - β(T - 25°C)]

Ku:
- P_out = Fuqia në dalje të inverterit
- P_in = Fuqia që bie në panele
- β = Koeficienti i temperaturës
- T = Temperatura aktuale e qelizës

### 2. Simulimi i Panelit Solar

#### Prodhimi Orare
Energjia e prodhuar për çdo orë:
E_h = G_h × A × η × FF × (1 - L_t)

Ku:
- G_h = Rrezatimi për orën specifike
- FF = Faktori i mbushjes së panelit
- L_t = Humbjet termike

#### Korrigjimi për Temperaturë
Fuqia e korrektuar:
P_corr = P_stc × [1 - β(T_cell - T_stc)]

Ku:
- P_stc = Fuqia në kushte standarde
- T_cell = Temperatura e qelizës
- T_stc = Temperatura standarde (25°C)

### 3. Simulimi i Baterisë

#### Gjendja e Karikimit (SoC)
SoC(t) = SoC₀ + ∫(P_in - P_out)dt / (V × C)

Ku:
- SoC₀ = Gjendja fillestare
- P_in = Fuqia hyrëse
- P_out = Fuqia dalëse
- V = Tensioni nominal
- C = Kapaciteti

#### Jetëgjatësia e Baterisë
N = N₀ × e^(-k × DoD)

Ku:
- N = Numri i cikleve
- N₀ = Ciklet nominale
- k = Konstanta e degradimit
- DoD = Thellësia e shkarkimit

### 4. Simulimi i Konsumit

#### Konsumi Total Ditor
E_d = ∑(P_i × t_i × f_i)

Ku:
- P_i = Fuqia e pajisjes i
- t_i = Koha e përdorimit
- f_i = Faktori i njëkohshmërisë

#### Parashikimi i Konsumit
E_pred = E_avg × f_s × f_t × (1 + α)

Ku:
- E_avg = Konsumi mesatar historik
- f_s = Faktori sezonal
- f_t = Faktori i temperaturës
- α = Faktori i rritjes

### 5. Llogaritja e ROI

#### Kursimi Vjetor
S = E_y × c_e + E_y × c_c

Ku:
- E_y = Energjia vjetore e prodhuar
- c_e = Çmimi i energjisë
- c_c = Kredia e karbonit

#### Periudha e Kthimit
T = -ln(1 - (r × C₀/S)) / ln(1 + r)

Ku:
- C₀ = Investimi fillestar
- S = Kursimi vjetor
- r = Norma e interesit

### 6. Optimizimi i Sistemit

#### Këndi Optimal i Panelit
β_opt = φ - δ + 15°

Ku:
- φ = Gjerësia gjeografike
- δ = Deklinacioni diellor

#### Distanca Optimale Midis Rreshtave
d = h / tan(α_min)

Ku:
- h = Lartësia e panelit
- α_min = Këndi minimal i diellit

### 7. Monitorimi i Performancës

#### Performance Ratio (PR)
PR = (E_ac / E_dc) × (G_stc / G_real)

Ku:
- E_ac = Energjia AC e prodhuar
- E_dc = Energjia DC teorike
- G_stc = Rrezatimi standard (1000 W/m²)
- G_real = Rrezatimi aktual

#### Faktori i Kapacitetit
CF = E_actual / (P_rated × 8760)

Ku:
- E_actual = Energjia vjetore e prodhuar
- P_rated = Fuqia nominale
- 8760 = Orët në vit

### 8. Analiza e Impaktit Mjedisor

#### Reduktimi i CO₂
CO₂_saved = E_y × f_CO₂

Ku:
- E_y = Energjia vjetore e prodhuar
- f_CO₂ = Faktori i konvertimit (0.85 kg/kWh)

#### Kursimi i Ujit
H₂O_saved = E_y × f_H₂O

Ku:
- f_H₂O = Faktori i kursimit të ujit (2.3 L/kWh)

## Detaje Shtesë të Implementimit

### API Endpoints

#### Autentifikimi
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/verify
```

#### Monitorimi
```
GET /api/monitoring/current
GET /api/monitoring/daily
GET /api/monitoring/monthly
GET /api/monitoring/yearly
```

#### Simulimet
```
POST /api/simulation/panel
POST /api/simulation/battery
POST /api/simulation/consumption
POST /api/simulation/roi
```

### Struktura e Database

#### Tabela Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20),
    created_at TIMESTAMP,
    last_login TIMESTAMP
);
```

#### Tabela Readings
```sql
CREATE TABLE readings (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMP,
    power_output DECIMAL(10,2),
    temperature DECIMAL(5,2),
    irradiance DECIMAL(7,2),
    efficiency DECIMAL(5,2),
    panel_id UUID REFERENCES panels(id)
);
```

#### Tabela Simulations
```sql
CREATE TABLE simulations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50),
    parameters JSONB,
    results JSONB,
    created_at TIMESTAMP
);
```

### Siguria

#### Enkriptimi
- Përdorimi i bcrypt për hash-imin e passwordeve
- JWT për token-at e autentifikimit
- HTTPS për të gjitha komunikimet
- Enkriptim AES-256 për të dhënat sensitive

#### Mbrojtja nga Sulmet
- Rate limiting në API
- CSRF protection
- XSS prevention
- SQL injection protection
- Input validation dhe sanitization

### Backup dhe Recovery

#### Backup Automatik
- Backup ditor i database (00:00 GMT+1)
- Backup javor i plotë i sistemit
- Ruajtja e backup-eve për 90 ditë
- Enkriptimi i backup-eve

#### Procedura e Recovery
1. Verifikimi i integritetit të backup
2. Restore i database
3. Verifikimi i të dhënave
4. Testimi i funksionaliteteve

### Monitorimi i Sistemit

#### Metrikat e Monitoruara
- CPU usage
- Memory usage
- Disk space
- Network latency
- API response times
- Error rates
- User sessions

#### Alertet
- Email notifications
- SMS për alerts kritike
- Dashboard notifications
- Webhook integrations

### Skenarët e Testimit

#### Unit Tests
```typescript
describe('Panel Efficiency Calculation', () => {
  test('should calculate correct efficiency', () => {
    const input = {
      power_output: 1000,
      irradiance: 1000,
      panel_area: 1.6
    };
    expect(calculateEfficiency(input)).toBe(0.625);
  });
});
```

#### Integration Tests
```typescript
describe('Simulation Flow', () => {
  test('should complete full simulation cycle', async () => {
    const simulation = await startSimulation({
      type: 'panel',
      parameters: {...}
    });
    expect(simulation.status).toBe('completed');
  });
});
```

### Optimizimi i Performancës

#### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Service workers
- Progressive loading

#### Backend
- Query optimization
- Connection pooling
- Caching layer
- Load balancing
- Horizontal scaling
- Task queuing

### Dokumentimi i API-t

#### Shembull i Kërkesës
```json
POST /api/simulation/panel
{
  "parameters": {
    "panel_count": 50,
    "panel_power": 400,
    "location": {
      "latitude": 40.6167,
      "longitude": 20.7833
    },
    "installation_angle": 35,
    "orientation": "south"
  }
}
```

#### Shembull i Përgjigjes
```json
{
  "simulation_id": "uuid",
  "results": {
    "daily_production": 250.5,
    "monthly_production": 7515,
    "yearly_production": 91250,
    "efficiency": 0.185,
    "performance_ratio": 0.75
  }
}
```

### Mirëmbajtja

#### Detyrat Periodike
- Përditësimi i dependencies
- Optimizimi i database
- Pastrimi i log files
- Verifikimi i backup-eve
- Kontrolli i sigurisë
- Monitorimi i performancës

#### Procedurat e Update
1. Backup i sistemit
2. Testimi në staging
3. Deployment në production
4. Verifikimi post-deployment
5. Rollback plan

### Skenarët e Dështimit

#### Plani i Vazhdimësisë
1. Failover automatik
2. Redundancy në sistemet kritike
3. Disaster recovery procedures
4. Business continuity plan

#### Procedurat e Recovery
1. Identifikimi i problemit
2. Izolimi i impaktit
3. Aktivizimi i sistemeve backup
4. Riparimi dhe restore
5. Root cause analysis

## Instalimi dhe Konfigurimi

### Kërkesat Paraprake
- Node.js (v16 ose më e re)
- npm ose yarn
- Git

### Hapat e Instalimit

1. Klono repository-n:
```bash
git clone https://github.com/your-username/sinteza.git
cd sinteza
```

2. Instalo dependencies:
```bash
npm install
# ose
yarn install
```

3. Krijo file-in e konfigurimit (.env):
```env
VITE_API_URL=your_api_url
VITE_AUTH_KEY=your_auth_key
```

4. Starto aplikacionin në development:
```bash
npm run dev
# ose
yarn dev
```

5. Për build production:
```bash
npm run build
# ose
yarn build
```

### Konfigurimi i Vite

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser'
  }
})
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Scripts të Disponueshëm

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

### Struktura e Projektit
```
sinteza/
├── src/
│   ├── components/        # Komponentët e ripërdorshëm
│   ├── pages/            # Faqet kryesore
│   ├── hooks/            # Custom React hooks
│   ├── assets/           # Asetet (imazhe, fonts, etj.)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── services/         # API services
│   ├── store/            # State management
│   └── App.tsx           # Komponenti kryesor
├── public/               # Static assets
├── index.html           # Entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── README.md           # Documentation
```

### Best Practices për Zhvillim

1. **TypeScript**
   - Përdorimi i strict mode
   - Definimi i types për të gjitha variablat
   - Përdorimi i interfaces dhe types
   - Validimi i props me PropTypes

2. **React**
   - Komponentë funksionalë me hooks
   - Memoization me useMemo dhe useCallback
   - Error boundaries për error handling
   - Lazy loading për komponentë të mëdhenj

3. **Performance**
   - Code splitting me React.lazy()
   - Image optimization
   - Bundle analysis
   - Caching strategies

4. **Testing**
   - Unit tests me Jest
   - Integration tests
   - E2E tests me Cypress
   - Test coverage reporting

## Falenderime
- Shkolla Profesionale Teknike Korçë për bashkëpunimin
- Të gjithë kontribuesit dhe zhvilluesit
- Komunitetin e React dhe TypeScript 

## Llogaritjet dhe Formula (Me Shembuj)

### Dashboard

#### 1. Llogaritja e Prodhimit të Energjisë
```typescript
// Formula bazë për prodhimin e energjisë diellore
const energyProduction = (solarIrradiance * panelEfficiency * panelArea * (1 - systemLosses)) / 1000;

// Shembull me numra realë:
// solarIrradiance = 1000 W/m² (ditë me diell)
// panelEfficiency = 0.18 (18% efikasitet)
// panelArea = 100 m² (50 panele x 2m² secili)
// systemLosses = 0.16 (16% humbje)

const example = (1000 * 0.18 * 100 * (1 - 0.16)) / 1000;
// = 15.12 kW prodhim në kushte optimale
```

#### 2. Efikasiteti i Sistemit
```typescript
// Llogaritja e performancës ratio (PR)
const performanceRatio = actualEnergy / theoreticalEnergy;
// Shembull: 13.5 kW / 15.12 kW = 0.89 ose 89% PR

// Efikasiteti total i sistemit
const systemEfficiency = (actualOutput / theoreticalMaxOutput) * 100;
// Shembull: (13500 W / 16000 W) * 100 = 84.375%
```

#### 3. Analiza Financiare
```typescript
// Kursimi mujor
const monthlySavings = monthlyEnergyProduction * electricityPrice;
// Shembull: 3000 kWh * 0.12 €/kWh = 360 € në muaj

// Periudha e kthimit të investimit (ROI)
const paybackPeriod = totalSystemCost / annualSavings;
// Shembull: 25000 € / 4320 € = 5.79 vjet
```

### Simulimet

#### 1. Simulimi i Panelit Solar

##### Prodhimi Ditor
```typescript
// Prodhimi për çdo orë
const hourlyProduction = (solarIrradiance, temperature) => {
  const temperatureCoefficient = -0.0035; // %/°C
  const standardTestTemp = 25; // °C
  
  // Korrigjimi për temperaturën
  const tempCorrection = 1 + temperatureCoefficient * (temperature - standardTestTemp);
  
  return solarIrradiance * panelEfficiency * tempCorrection;
};

// Shembull:
// solarIrradiance = 800 W/m²
// temperature = 30°C
// Rezultati: 800 * 0.18 * (1 + (-0.0035 * (30 - 25)))
// = 800 * 0.18 * 0.9825 = 141.48 W/m²

// Prodhimi ditor total për 8 orë diell:
// 141.48 W/m² * 8 orë = 1131.84 Wh/m² ≈ 1.13 kWh/m²
```

##### Humbjet e Sistemit
```typescript
const systemLosses = {
  soiling: 0.02,        // Ndotja 2% = 20W nga 1000W
  shading: 0.03,        // Hijet 3% = 30W nga 1000W
  wiring: 0.02,         // Kabllimi 2% = 20W nga 1000W
  inverter: 0.04,       // Inverteri 4% = 40W nga 1000W
  temperature: 0.05,    // Temperatura 5% = 50W nga 1000W
  total: 0.16           // Totali 16% = 160W humbje nga 1000W
};

// Shembull prodhimi aktual:
// theoreticalProduction = 1000W
const actualProduction = 1000 * (1 - 0.16); // = 840W prodhim real
```

#### 2. Simulimi i Baterisë

##### Kapaciteti i Baterisë
```typescript
// Llogaritja e kapacitetit të disponueshëm
const availableCapacity = (totalCapacity, depthOfDischarge) => {
  return totalCapacity * depthOfDischarge;
};
// Shembull: 10kWh * 0.8 = 8kWh kapacitet i përdorshëm

// Gjendja e karikimit (State of Charge - SoC)
const calculateSoC = (currentEnergy, totalCapacity) => {
  return (currentEnergy / totalCapacity) * 100;
};
// Shembull: (6kWh / 10kWh) * 100 = 60% SoC
```

##### Efikasiteti i Karikimit
```typescript
const chargingEfficiency = 0.95; // 95% efikasitet

// Energjia e ruajtur
// Shembull: 1000Wh input
const storedEnergy = 1000 * 0.95; // = 950Wh energji e ruajtur

// Cikli i jetës për DoD 80%
const batteryLifeCycles = 0.8; // DoD
const cycles = Math.round(7000 - (5000 * 0.8)); // = 3000 cikle
```

#### 3. Simulimi i Konsumit

##### Llogaritja e Konsumit
```typescript
// Konsumi ditor për pajisje
const deviceConsumption = (powerRating, hoursUsed) => {
  return (powerRating * hoursUsed) / 1000; // në kWh
};
// Shembull: Kompjuter 200W * 8 orë = 1.6 kWh/ditë

// Konsumi total për 5 pajisje:
// 1. Kompjuter: 1.6 kWh
// 2. Ndriçim: 0.5 kWh
// 3. Printer: 0.3 kWh
// 4. AC: 2.4 kWh
// 5. Servera: 3.2 kWh
// Totali = 8 kWh/ditë
```

#### 4. ROI Calculator

##### Kthimi i Investimit
```typescript
// Shembull llogaritje ROI për sistem 25000€:
const example = {
  systemCost: 25000,
  annualSavings: 4320, // 360€ * 12 muaj
  electricityPriceIncrease: 0.03 // 3% rritje vjetore
};

// Rezultatet pas 10 vjetësh:
// Kursimet totale: 47520€
// ROI: ((47520 - 25000) / 25000) * 100 = 90.08%
```

##### Analiza e Kursimeve të CO2
```typescript
// Për prodhim vjetor 36000 kWh:
const co2Savings = 36000 * 0.85; // = 30600 kg CO2 = 30.6 ton CO2/vit
```

### Faktorët e Ndikimit në Llogaritje (Vlerat Tipike për Korçë)

1. **Faktorët Mjedisorë**
   - Temperatura mesatare verore: 25-30°C
   - Temperatura mesatare dimërore: 0-10°C
   - Rrezatimi mesatar ditor: 4.2 kWh/m²/ditë
   - Ditë me diell në vit: ~280

2. **Faktorët Teknikë**
   - Orientimi optimal: 180° (Jug)
   - Këndi optimal: 35°
   - Degradimi vjetor: 0.7%
   - Efikasiteti i inverterit: 97%

3. **Faktorët Ekonomikë**
   - Çmimi aktual i energjisë: 0.12 €/kWh
   - Rritja vjetore e çmimit: 3%
   - Kosto mirëmbajtje: 250€/vit
   - Jetëgjatësia e garantuar: 25 vjet 

## Formulat Fizike dhe Matematikore

### 1. Energjia Diellore dhe Rrezatimi

#### Energjia e Rrezatimit Diellor
Energjia e rrezatimit që bie në një sipërfaqe:
E = ∫(I₀ × cosθ) dt

Ku:
- I₀ = Konstanta diellore (≈ 1361 W/m²)
- θ = Këndi midis rrezeve dhe normales së sipërfaqes
- t = Koha

#### Ligji i Stefan-Boltzmann
Fuqia e rrezatuar nga sipërfaqja:
P = εσT⁴

Ku:
- ε = Emetiviteti i sipërfaqes
- σ = Konstanta e Stefan-Boltzmann (5.67 × 10⁻⁸ W/m²K⁴)
- T = Temperatura absolute (K)

### 2. Efekti Fotoelektrik në Panele

#### Energjia e Fotonit
E = hf = hc/λ

Ku:
- h = Konstanta e Planck (6.626 × 10⁻³⁴ J·s)
- f = Frekuenca e dritës
- c = Shpejtësia e dritës (3 × 10⁸ m/s)
- λ = Gjatësia e valës

#### Rendimenti Kuantik
η = (elektronet e gjeneruara)/(fotonet e absorbuara)

### 3. Termodinamika e Sistemit

#### Ekuacioni i Nxehtësisë
Q = mcΔT

Ku:
- m = Masa e panelit
- c = Nxehtësia specifike
- ΔT = Ndryshimi i temperaturës

#### Humbjet Termike
dQ/dt = -k × A × (T₁ - T₂)/d

Ku:
- k = Përcjellshmëria termike
- A = Sipërfaqja
- d = Trashësia e materialit
- T₁, T₂ = Temperaturat në sipërfaqe të ndryshme

### 4. Elektromagnetizmi

#### Ligji i Ohm-it për Sistemin
V = IR

Ku:
- V = Tensioni
- I = Rryma
- R = Rezistenca totale

#### Fuqia Elektrike
P = VI = I²R = V²/R

### 5. Rendimenti i Konvertimit

#### Rendimenti i Panelit
η = (Energjia elektrike e prodhuar)/(Energjia diellore e marrë) × 100%

#### Faktori i Mbushjes (Fill Factor)
FF = (Vmp × Imp)/(Voc × Isc)

Ku:
- Vmp = Tensioni në pikën e fuqisë maksimale
- Imp = Rryma në pikën e fuqisë maksimale
- Voc = Tensioni i qarkut të hapur
- Isc = Rryma e qarkut të shkurtër

### 6. Sistemet e Ruajtjes së Energjisë

#### Kapaciteti i Baterisë
C = Q/V

Ku:
- C = Kapaciteti (Farad)
- Q = Ngarkesa (Coulomb)
- V = Tensioni (Volt)

#### Energjia e Ruajtur
E = ½CV²

### 7. Gjeometria Diellore

#### Këndi i Deklinacionit Diellor
δ = 23.45° × sin(360/365 × (284 + n))

Ku:
- n = Dita e vitit (1-365)

#### Këndi i Lartësisë së Diellit
sin(α) = sin(φ)sin(δ) + cos(φ)cos(δ)cos(ω)

Ku:
- α = Këndi i lartësisë
- φ = Gjerësia gjeografike
- δ = Deklinacioni
- ω = Këndi orar

### 8. Analiza e Performancës

#### Koeficienti i Performancës (COP)
COP = (Energjia e dobishme)/(Energjia e harxhuar)

#### Faktori i Kapacitetit
CF = (Energjia aktuale e prodhuar)/(Energjia maksimale e mundshme)

### 9. Degradimi i Sistemit

#### Ligji i Degradimit Eksponencial
P(t) = P₀e⁻ᵏᵗ

Ku:
- P(t) = Fuqia në kohën t
- P₀ = Fuqia fillestare
- k = Konstanta e degradimit
- t = Koha

### 10. Analiza Ekonomike

#### Vlera Aktuale Neto (NPV)
NPV = -C₀ + ∑(Cₙ/(1+r)ⁿ)

Ku:
- C₀ = Investimi fillestar
- Cₙ = Fluksi i parave në vitin n
- r = Norma e skontimit
- n = Viti

### 11. Impakti Mjedisor

#### Reduktimi i CO₂
ΔCO₂ = E × f

Ku:
- E = Energjia e prodhuar (kWh)
- f = Faktori i konvertimit CO₂/kWh

### 12. Parametrat e Rrezatimit

#### Rrezatimi i Përgjithshëm
Gt = Gb × Rb + Gd × Rd + (Gb + Gd) × Rr

Ku:
- Gt = Rrezatimi total në sipërfaqen e pjerrët
- Gb = Rrezatimi direkt
- Gd = Rrezatimi difuz
- Rb, Rd, Rr = Faktorët gjeometrikë përkatës 

## Veprimet dhe Formulat e Implementuara

### 1. Monitorimi në Kohë Reale (Dashboard)

#### Prodhimi Aktual i Energjisë
Fuqia momentale e prodhuar:
P = G × A × η × cosθ × (1 - L)

Ku:
- G = Rrezatimi aktual (W/m²)
- A = Sipërfaqja aktive e paneleve
- η = Rendimenti i panelit
- θ = Këndi i rënies së rrezeve
- L = Humbjet totale të sistemit

#### Efikasiteti Aktual
Llogaritja e efikasitetit në kohë reale:
η_real = (P_out / P_in) × [1 - β(T - 25°C)]

Ku:
- P_out = Fuqia në dalje të inverterit
- P_in = Fuqia që bie në panele
- β = Koeficienti i temperaturës
- T = Temperatura aktuale e qelizës

### 2. Simulimi i Panelit Solar

#### Prodhimi Orare
Energjia e prodhuar për çdo orë:
E_h = G_h × A × η × FF × (1 - L_t)

Ku:
- G_h = Rrezatimi për orën specifike
- FF = Faktori i mbushjes së panelit
- L_t = Humbjet termike

#### Korrigjimi për Temperaturë
Fuqia e korrektuar:
P_corr = P_stc × [1 - β(T_cell - T_stc)]

Ku:
- P_stc = Fuqia në kushte standarde
- T_cell = Temperatura e qelizës
- T_stc = Temperatura standarde (25°C)

### 3. Simulimi i Baterisë

#### Gjendja e Karikimit (SoC)
SoC(t) = SoC₀ + ∫(P_in - P_out)dt / (V × C)

Ku:
- SoC₀ = Gjendja fillestare
- P_in = Fuqia hyrëse
- P_out = Fuqia dalëse
- V = Tensioni nominal
- C = Kapaciteti

#### Jetëgjatësia e Baterisë
N = N₀ × e^(-k × DoD)

Ku:
- N = Numri i cikleve
- N₀ = Ciklet nominale
- k = Konstanta e degradimit
- DoD = Thellësia e shkarkimit

### 4. Simulimi i Konsumit

#### Konsumi Total Ditor
E_d = ∑(P_i × t_i × f_i)

Ku:
- P_i = Fuqia e pajisjes i
- t_i = Koha e përdorimit
- f_i = Faktori i njëkohshmërisë

#### Parashikimi i Konsumit
E_pred = E_avg × f_s × f_t × (1 + α)

Ku:
- E_avg = Konsumi mesatar historik
- f_s = Faktori sezonal
- f_t = Faktori i temperaturës
- α = Faktori i rritjes

### 5. Llogaritja e ROI

#### Kursimi Vjetor
S = E_y × c_e + E_y × c_c

Ku:
- E_y = Energjia vjetore e prodhuar
- c_e = Çmimi i energjisë
- c_c = Kredia e karbonit

#### Periudha e Kthimit
T = -ln(1 - (r × C₀/S)) / ln(1 + r)

Ku:
- C₀ = Investimi fillestar
- S = Kursimi vjetor
- r = Norma e interesit

### 6. Optimizimi i Sistemit

#### Këndi Optimal i Panelit
β_opt = φ - δ + 15°

Ku:
- φ = Gjerësia gjeografike
- δ = Deklinacioni diellor

#### Distanca Optimale Midis Rreshtave
d = h / tan(α_min)

Ku:
- h = Lartësia e panelit
- α_min = Këndi minimal i diellit

### 7. Monitorimi i Performancës

#### Performance Ratio (PR)
PR = (E_ac / E_dc) × (G_stc / G_real)

Ku:
- E_ac = Energjia AC e prodhuar
- E_dc = Energjia DC teorike
- G_stc = Rrezatimi standard (1000 W/m²)
- G_real = Rrezatimi aktual

#### Faktori i Kapacitetit
CF = E_actual / (P_rated × 8760)

Ku:
- E_actual = Energjia vjetore e prodhuar
- P_rated = Fuqia nominale
- 8760 = Orët në vit

### 8. Analiza e Impaktit Mjedisor

#### Reduktimi i CO₂
CO₂_saved = E_y × f_CO₂

Ku:
- E_y = Energjia vjetore e prodhuar
- f_CO₂ = Faktori i konvertimit (0.85 kg/kWh)

#### Kursimi i Ujit
H₂O_saved = E_y × f_H₂O

Ku:
- f_H₂O = Faktori i kursimit të ujit (2.3 L/kWh) 