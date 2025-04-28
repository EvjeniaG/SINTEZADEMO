import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../hooks/useAuth';

// Zgjerimi i pyetjeve të kuizit me më shumë kategori
const quizCategories = {
  basics: {
    title: 'Bazat e Energjisë',
    description: 'Mëso konceptet themelore të energjisë diellore',
    icon: '☀️',
    color: 'from-yellow-400 to-orange-500',
    questions: [
      {
        id: 1,
        title: "Çfarë është voltazhi?",
        options: ["Rrjedha e elektroneve", "Forca shtytëse elektrike", "Rezistenca elektrike", "Energjia e ruajtur"],
        correctAnswer: 1,
        explanation: "Voltazhi është forca elektrike shtytëse që bën elektronet të lëvizin në një qark elektrik.",
        difficulty: 'easy'
      },
      {
        id: 2,
        title: "Si funksionon efekti fotovoltaik?",
        options: [
          "Konverton dritën në nxehtësi",
          "Konverton dritën në energji elektrike",
          "Konverton nxehtësinë në energji",
          "Konverton erën në energji"
        ],
        correctAnswer: 1,
        explanation: "Efekti fotovoltaik është procesi ku drita e diellit konvertohet direkt në energji elektrike përmes gjysmëpërçuesve.",
        difficulty: 'medium'
      },
      {
        id: 3,
        title: "Cila është njësia matëse e fuqisë?",
        options: ["Amper (A)", "Volt (V)", "Watt (W)", "Ohm (Ω)"],
        correctAnswer: 2,
        explanation: "Watt (W) është njësia bazë e fuqisë që tregon sasinë e energjisë së transferuar në njësinë e kohës.",
        difficulty: 'easy'
      },
      {
        id: 4,
        title: "Si ndikon temperatura në performancën e panelit?",
        options: [
          "Nuk ka ndikim në performancë",
          "Rrit efikasitetin e panelit",
          "Ul efikasitetin e panelit",
          "Ndikon vetëm në dimër"
        ],
        correctAnswer: 2,
        explanation: "Temperaturat e larta ulin efikasitetin e qelizave fotovoltaike. Për çdo gradë mbi 25°C, efikasiteti bie me rreth 0.4-0.5%.",
        difficulty: 'medium'
      },
      {
        id: 5,
        title: "Çfarë është rrezatimi diellor?",
        options: [
          "Vetëm drita e dukshme",
          "Energjia totale që vjen nga dielli",
          "Vetëm nxehtësia e diellit",
          "Vetëm rrezet UV"
        ],
        correctAnswer: 1,
        explanation: "Rrezatimi diellor përfshin të gjithë energjinë që vjen nga dielli, përfshirë dritën e dukshme, infra të kuqe dhe ultraviolet.",
        difficulty: 'medium'
      }
    ]
  },
  advanced: {
    title: 'Teknologjia',
    description: 'Eksploro teknologjitë moderne të energjisë diellore',
    icon: '🔬',
    color: 'from-blue-400 to-indigo-500',
    questions: [
      {
        id: 1,
        title: "Cili është dallimi mes qelizave monokristaline dhe polikristaline?",
        options: [
          "Vetëm ngjyra e tyre",
          "Eficienca dhe çmimi",
          "Madhësia fizike",
          "Vendi i prodhimit"
        ],
        correctAnswer: 1,
        explanation: "Qelizat monokristaline kanë eficiencë më të lartë (15-22%) dhe kushtojnë më shumë, ndërsa polikristaline kanë eficiencë më të ulët (13-17%) por janë më ekonomike.",
        difficulty: 'hard'
      },
      {
        id: 2,
        title: "Sa është jetëgjatësia mesatare e një paneli?",
        options: ["5-10 vjet", "15-20 vjet", "25-30 vjet", "40-50 vjet"],
        correctAnswer: 2,
        explanation: "Panelet diellore zakonisht zgjasin 25-30 vjet me garanci performance. Pas 25 vitesh, shumica e prodhuesve garantojnë të paktën 80% të prodhimit fillestar.",
        difficulty: 'medium'
      },
      {
        id: 3,
        title: "Çfarë është degradimi vjetor?",
        options: ["0.1-0.2%", "0.5-0.8%", "2-3%", "5-10%"],
        correctAnswer: 1,
        explanation: "Panelet humbasin rreth 0.5-0.8% të efikasitetit çdo vit. Kjo do të thotë që pas 25 vitesh, paneli do të prodhojë rreth 80-85% të energjisë fillestare.",
        difficulty: 'hard'
      },
      {
        id: 4,
        title: "Çfarë është inverteri dhe cili është roli i tij?",
        options: [
          "Ruan energjinë",
          "Konverton DC në AC",
          "Monitoron sistemin",
          "Pastron panelet"
        ],
        correctAnswer: 1,
        explanation: "Inverteri konverton rrymën e vazhduar (DC) të prodhuar nga panelet në rrymë alternative (AC) që përdoret në shtëpinë ose shkollën.",
        difficulty: 'medium'
      },
      {
        id: 5,
        title: "Çfarë është sistemi MPPT?",
        options: [
          "Sistem GPS për panele",
          "Sistem për ndjekjen e pikës maksimale të fuqisë",
          "Sistem për pastrim automatik",
          "Sistem për ruajtjen e energjisë"
        ],
        correctAnswer: 1,
        explanation: "MPPT (Maximum Power Point Tracking) është një teknologji që optimizon prodhimin e energjisë duke gjetur pikën optimale të operimit të panelit.",
        difficulty: 'hard'
      }
    ]
  },
  practical: {
    title: 'Praktika',
    description: 'Mëso aspektet praktike të instalimit dhe mirëmbajtjes',
    icon: '🛠️',
    color: 'from-green-400 to-emerald-500',
    questions: [
      {
        id: 1,
        title: "Si llogaritet konsumi ditor i energjisë?",
        options: [
          "Duke mbledhur fuqinë × orët e përdorimit të çdo pajisjeje",
          "Duke matur vetëm voltazhin",
          "Duke numëruar panelet",
          "Duke parë faturën e fundit"
        ],
        correctAnswer: 0,
        explanation: "Konsumi ditor llogaritet duke mbledhur konsumin e çdo pajisjeje (Watt) × orët e përdorimit në ditë, dhe rezultati shprehet në kWh.",
        difficulty: 'medium'
      },
      {
        id: 2,
        title: "Cili orientim është optimal për panelet në Shqipëri?",
        options: ["Veri", "Jug", "Lindje", "Perëndim"],
        correctAnswer: 1,
        explanation: "Në Shqipëri, orientimi nga jugu është optimal pasi siguron ekspozimin maksimal ndaj diellit gjatë gjithë ditës. Këndi optimal është zakonisht 30-35 gradë.",
        difficulty: 'easy'
      },
      {
        id: 3,
        title: "Si ndikon hija në performancën e sistemit?",
        options: [
          "Nuk ka ndikim",
          "Ul prodhimin vetëm në zonën me hije",
          "Ul prodhimin e të gjithë vargut",
          "Rrit prodhimin"
        ],
        correctAnswer: 2,
        explanation: "Hija në një panel ndikon në të gjithë vargun e lidhur në seri, duke ulur ndjeshëm prodhimin total. Për këtë arsye përdoren optimizuesit ose mikroinverterët.",
        difficulty: 'medium'
      },
      {
        id: 4,
        title: "Sa shpesh duhen pastruar panelet?",
        options: [
          "Çdo ditë",
          "Çdo javë",
          "2-4 herë në vit",
          "Nuk kanë nevojë për pastrim"
        ],
        correctAnswer: 2,
        explanation: "Panelet duhen pastruar 2-4 herë në vit, varësisht nga kushtet lokale. Shiu natyral ndihmon në pastrim, por pluhuri dhe ndotjet kërkojnë pastrim periodik.",
        difficulty: 'easy'
      }
    ]
  },
  economics: {
    title: 'Ekonomia',
    description: 'Analizo aspektet financiare të energjisë diellore',
    icon: '💰',
    color: 'from-purple-400 to-pink-500',
    questions: [
      {
        id: 1,
        title: "Çfarë është periudha e kthimit të investimit (ROI)?",
        options: [
          "Koha e instalimit",
          "Koha për të rikuperuar koston fillestare",
          "Garancia e panelit",
          "Jetëgjatësia e sistemit"
        ],
        correctAnswer: 1,
        explanation: "ROI është periudha kohore e nevojshme që kursimet nga energjia e prodhuar të mbulojnë koston fillestare të investimit.",
        difficulty: 'medium'
      },
      {
        id: 2,
        title: "Si ndikon inflacioni në investimin solar?",
        options: [
          "Ul vlerën e investimit",
          "Rrit vlerën e investimit",
          "Nuk ka efekt",
          "Varet nga vendi"
        ],
        correctAnswer: 1,
        explanation: "Rritja e çmimeve të energjisë elektrike për shkak të inflacionit rrit vlerën e investimit solar, pasi kursimet bëhen më të mëdha.",
        difficulty: 'hard'
      },
      {
        id: 3,
        title: "Cili është avantazhi kryesor ekonomik i sistemit solar?",
        options: [
          "Eliminon plotësisht faturat",
          "Redukton varësinë nga rrjeti dhe kostot",
          "Rrit vlerën e pronës",
          "Jep të ardhura të garantuara"
        ],
        correctAnswer: 1,
        explanation: "Sistemi solar redukton ndjeshëm varësinë nga rrjeti elektrik dhe kostot e energjisë, duke ofruar një zgjidhje afatgjatë për menaxhimin e shpenzimeve.",
        difficulty: 'medium'
      },
      {
        id: 4,
        title: "Si ndikon sistemi solar në vlerën e pronës?",
        options: [
          "Nuk ka ndikim",
          "Ul vlerën e pronës",
          "Rrit vlerën e pronës",
          "Varet nga madhësia"
        ],
        correctAnswer: 2,
        explanation: "Sistemet solare rrisin vlerën e pronës mesatarisht me 4-6% duke ofruar kursime në energji dhe duke treguar përgjegjshmëri mjedisore.",
        difficulty: 'medium'
      }
    ]
  },
  environment: {
    title: 'Mjedisi',
    description: 'Zbulo ndikimin mjedisor të energjisë diellore',
    icon: '🌍',
    color: 'from-teal-400 to-cyan-500',
    questions: [
      {
        id: 1,
        title: "Sa CO2 redukton një sistem diellor 5kW në vit?",
        options: [
          "1-2 ton",
          "3-4 ton",
          "5-6 ton",
          "7-8 ton"
        ],
        correctAnswer: 1,
        explanation: "Një sistem 5kW redukton mesatarisht 3-4 ton CO2 në vit, ekuivalente me mbjelljen e 150 pemëve.",
        difficulty: 'medium'
      },
      {
        id: 2,
        title: "Cili është impakti mjedisor i prodhimit të paneleve?",
        options: [
          "Nuk ka impakt",
          "Impakt i lartë që nuk kompensohet kurrë",
          "Impakti kompensohet brenda 1-2 viteve të para",
          "Impakti kompensohet pas 10 vitesh"
        ],
        correctAnswer: 2,
        explanation: "Impakti mjedisor i prodhimit të paneleve kompensohet plotësisht brenda 1-2 viteve të para të operimit.",
        difficulty: 'hard'
      }
    ]
  },
  safety: {
    title: 'Siguria',
    description: 'Mëso rregullat e sigurisë në punë me sistemet diellore',
    icon: '⚡',
    color: 'from-red-400 to-orange-500',
    questions: [
      {
        id: 1,
        title: "Çfarë duhet bërë në rast të një zjarri në sistem?",
        options: [
          "Përdor ujë për shuarjen",
          "Njofto zjarrfikëset dhe shkëput sistemin",
          "Vazhdo operimin normal",
          "Prit sa të fiket vetë"
        ],
        correctAnswer: 1,
        explanation: "Në rast zjarri, sistemi duhet shkëputur menjëherë dhe duhen njoftuar zjarrfikëset. Mos përdor ujë për shkak të rrezikut elektrik.",
        difficulty: 'medium'
      },
      {
        id: 2,
        title: "Cilat janë pajisjet e sigurisë të nevojshme për instalim?",
        options: [
          "Vetëm doreza",
          "Doreza dhe syze",
          "PPE e plotë (doreza, syze, helmetë, rrip sigurimi)",
          "Nuk nevojiten pajisje sigurie"
        ],
        correctAnswer: 2,
        explanation: "Instalimi kërkon pajisje të plota mbrojtëse personale (PPE) përfshirë doreza izoluese, syze mbrojtëse, helmetë dhe rrip sigurimi për punë në lartësi.",
        difficulty: 'easy'
      }
    ]
  },
  maintenance: {
    title: 'Mirëmbajtja',
    description: 'Mëso si të mirëmbash sistemin diellor',
    icon: '🔧',
    color: 'from-slate-400 to-gray-500',
    questions: [
      {
        id: 1,
        title: "Sa shpesh duhet kontrolluar inverteri?",
        options: [
          "Çdo ditë",
          "Çdo javë",
          "Çdo muaj",
          "Çdo vit"
        ],
        correctAnswer: 2,
        explanation: "Inverteri duhet kontrolluar çdo muaj për performancë optimale. Kontrolli përfshin leximin e të dhënave dhe verifikimin e kodeve të gabimit.",
        difficulty: 'easy'
      },
      {
        id: 2,
        title: "Cilat janë shenjat e degradimit të panelit?",
        options: [
          "Vetëm ngjyra e ndryshuar",
          "Çarje, dekolorim dhe rënie e prodhimit",
          "Vetëm pluhuri sipër",
          "Panelet nuk degradohen"
        ],
        correctAnswer: 1,
        explanation: "Shenjat kryesore të degradimit përfshijnë çarjet në sipërfaqe, dekolorimin e qelizave dhe rënie të ndjeshme në prodhimin e energjisë.",
        difficulty: 'medium'
      }
    ]
  },
  innovation: {
    title: 'Inovacioni',
    description: 'Eksploro teknologjitë e reja në energjinë diellore',
    icon: '💡',
    color: 'from-amber-400 to-yellow-500',
    questions: [
      {
        id: 1,
        title: "Çfarë janë qelizat diellore Perovskite?",
        options: [
          "Lloj baterie",
          "Material i ri për panele me kosto të ulët",
          "Sistem tracking",
          "Lloj inverteri"
        ],
        correctAnswer: 1,
        explanation: "Qelizat Perovskite janë një teknologji e re që premton panele më të lira dhe më efiçente, me potencial për të arritur eficiencë mbi 30%.",
        difficulty: 'hard'
      },
      {
        id: 2,
        title: "Si funksionojnë panelet bifaciale?",
        options: [
          "Prodhojnë energji vetëm në mëngjes",
          "Kapin dritën nga të dyja anët",
          "Funksionojnë vetëm me bateri",
          "Janë vetëm dekorative"
        ],
        correctAnswer: 1,
        explanation: "Panelet bifaciale kapin dritën nga të dyja anët, duke shfrytëzuar edhe dritën e reflektuar nga toka për të rritur prodhimin me 5-30%.",
        difficulty: 'medium'
      }
    ]
  },
  future_tech: {
    title: 'Teknologjitë e së Ardhmes',
    description: 'Eksploro inovacionet dhe zhvillimet e fundit në fushën e energjisë diellore',
    icon: '🚀',
    color: 'from-violet-400 to-purple-500',
    questions: [
      {
        id: 1,
        title: "Çfarë janë qelizat diellore transparente?",
        options: [
          "Panele të padukshme",
          "Qeliza që lejojnë kalimin e dritës duke prodhuar energji",
          "Panele me eficiencë të ulët",
          "Ekrane telefonash"
        ],
        correctAnswer: 1,
        explanation: "Qelizat diellore transparente janë një teknologji e re që lejon kalimin e dritës përmes tyre ndërsa kapin energjinë diellore, duke i bërë ideale për dritare dhe fasada ndërtesash.",
        difficulty: 'medium'
      },
      {
        id: 2,
        title: "Si funksionojnë panelet diellore organike?",
        options: [
          "Përdorin materiale sintetike",
          "Përdorin materiale organike për të kapur dritën",
          "Janë bërë nga bimët",
          "Prodhojnë ushqim"
        ],
        correctAnswer: 1,
        explanation: "Panelet diellore organike përdorin polimere organike për të konvertuar dritën në elektricitet. Janë më të lehta, fleksibël dhe potencialisht më të lira për t'u prodhuar.",
        difficulty: 'hard'
      },
      {
        id: 3,
        title: "Çfarë është teknologjia 'Solar Paint'?",
        options: [
          "Bojë dekorative për panele",
          "Bojë që reflekton dritën",
          "Bojë që konverton dritën në energji",
          "Bojë për mbrojtje nga dielli"
        ],
        correctAnswer: 2,
        explanation: "Solar Paint është një teknologji inovative që përmban nanogrimca të cilat mund të konvertojnë dritën e diellit në energji elektrike, duke transformuar çdo sipërfaqe në një burim potencial energjie.",
        difficulty: 'medium'
      },
      {
        id: 4,
        title: "Cili është avantazhi i teknologjisë 'Tandem Solar Cells'?",
        options: [
          "Janë më të lira",
          "Kapin më shumë spektër të dritës",
          "Janë më të lehta",
          "Zgjasin më shumë"
        ],
        correctAnswer: 1,
        explanation: "Qelizat diellore tandem kombinojnë shtresa të ndryshme materialesh për të kapur më shumë pjesë të spektrit të dritës, duke arritur eficiencë më të lartë se panelet tradicionale.",
        difficulty: 'hard'
      },
      {
        id: 5,
        title: "Si ndihmon Inteligjenca Artificiale në sistemet diellore?",
        options: [
          "Vetëm për monitorim",
          "Optimizon prodhimin dhe parashikon defektet",
          "Kontrollon motin",
          "Rregullon panelet fizikisht"
        ],
        correctAnswer: 1,
        explanation: "AI përdoret për të optimizuar prodhimin e energjisë duke parashikuar kushtet e motit, identifikuar defektet përpara se të ndodhin, dhe përshtatur sistemin për performancë maksimale.",
        difficulty: 'medium'
      },
      {
        id: 6,
        title: "Çfarë është teknologjia 'Solar Tracking 2.0'?",
        options: [
          "Sistem GPS për panele",
          "Sistem inteligjent që ndjek diellin dhe kushtet atmosferike",
          "Program kompjuterik",
          "Sistem manual kontrolli"
        ],
        correctAnswer: 1,
        explanation: "Solar Tracking 2.0 është një sistem i avancuar që jo vetëm ndjek diellin, por përdor AI për të optimizuar këndin bazuar në kushtet atmosferike, temperaturën, dhe faktorë të tjerë mjedisorë.",
        difficulty: 'hard'
      }
    ]
  }
};

// Video lessons with real links
const videoLessons = [
  {
    id: 'intro',
    title: 'Hyrje në Energjinë Diellore',
    description: 'Mëso konceptet bazë të energjisë diellore dhe si funksionojnë panelet fotovoltaike.',
    thumbnail: '/thumbnails/intro.jpg',
    videoUrl: 'https://www.youtube.com/embed/L_q6LRgKpTw',
    duration: '7:45',
    points: 30,
    category: 'basics',
    tags: ['bazat', 'hyrje', 'koncepte']
  },
  {
    id: 'installation',
    title: 'Instalimi i Sistemit Solar',
    description: 'Udhëzues i detajuar për instalimin e sistemit diellor në shtëpi, nga planifikimi deri tek montimi.',
    thumbnail: '/thumbnails/installation.jpg',
    videoUrl: 'https://www.youtube.com/embed/Yxt72aDjFgY',
    duration: '12:20',
    points: 40,
    category: 'practical',
    tags: ['instalim', 'praktike', 'udhëzues']
  },
  {
    id: 'efficiency',
    title: 'Optimizimi i Eficiencës së Paneleve',
    description: 'Teknika dhe këshilla për maksimizimin e prodhimit të energjisë nga sistemi juaj solar.',
    thumbnail: '/thumbnails/efficiency.jpg',
    videoUrl: 'https://www.youtube.com/embed/5M8hEVThXYE',
    duration: '9:15',
    points: 35,
    category: 'advanced',
    tags: ['optimizim', 'eficiencë', 'teknika']
  },
  {
    id: 'maintenance',
    title: 'Mirëmbajtja e Sistemit Solar',
    description: 'Si të kujdeseni për sistemin tuaj solar për jetëgjatësi dhe performancë maksimale.',
    thumbnail: '/thumbnails/maintenance.jpg',
    videoUrl: 'https://www.youtube.com/embed/p6kxVswaY1g',
    duration: '8:30',
    points: 45,
    category: 'practical',
    tags: ['mirëmbajtje', 'praktike', 'jetëgjatësi']
  },
  {
    id: 'economics',
    title: 'Analiza Ekonomike e Sistemit Solar',
    description: 'Si të llogarisni kthimin e investimit dhe përfitimet financiare nga sistemi solar.',
    thumbnail: '/thumbnails/economics.jpg',
    videoUrl: 'https://www.youtube.com/embed/00QuPNmTdI8',
    duration: '10:45',
    points: 50,
    category: 'economics',
    tags: ['ekonomi', 'investim', 'ROI']
  },
  {
    id: 'future',
    title: 'Teknologjitë e Reja Solare',
    description: 'Zbulo inovacionet më të fundit në fushën e energjisë diellore dhe trendet e ardhshme.',
    thumbnail: '/thumbnails/future.jpg',
    videoUrl: 'https://www.youtube.com/embed/3GIzZwQw4nc',
    duration: '11:15',
    points: 55,
    category: 'advanced',
    tags: ['inovacion', 'teknologji', 'e ardhmja']
  },
  {
    id: 'batteries',
    title: 'Sistemet e Ruajtjes së Energjisë',
    description: 'Gjithçka që duhet të dini për bateritë dhe sistemet e ruajtjes së energjisë solare.',
    thumbnail: '/thumbnails/batteries.jpg',
    videoUrl: 'https://www.youtube.com/embed/fC48rVyM3Ws',
    duration: '13:20',
    points: 45,
    category: 'advanced',
    tags: ['bateri', 'ruajtje', 'teknologji']
  },
  {
    id: 'planning',
    title: 'Planifikimi i Sistemit Solar',
    description: 'Si të planifikoni sistemin tuaj solar duke marrë parasysh të gjithë faktorët e rëndësishëm.',
    thumbnail: '/thumbnails/planning.jpg',
    videoUrl: 'https://www.youtube.com/embed/khYZTmm7S5I',
    duration: '9:50',
    points: 40,
    category: 'practical',
    tags: ['planifikim', 'dizajn', 'këshilla']
  }
];

// Demo AI responses
const demoAIResponses = {
  "Si funksionon paneli diellor?": "Panelet diellore funksionojnë duke shfrytëzuar efektin fotovoltaik. Kur rrezet e diellit bien mbi qelizat e silikonit në panel, ato çlirojnë elektrone, duke krijuar një rrjedhë elektrike. Kjo energji pastaj kapet dhe konvertohet në elektricitet të përdorshëm për shtëpinë ose shkollën.",
  "Çfarë është eficienca e energjisë?": "Eficienca e energjisë është masa e sasisë së energjisë së shfrytëzuar në mënyrë efektive krahasuar me humbjet. Për shembull, një panel diellor me eficiencë 20% do të thotë që 20% e energjisë së diellit që bie mbi të kthehet në energji elektrike. Sa më e lartë eficienca, aq më shumë energji prodhohet.",
  "default": "Më vjen keq, por nuk e kuptova plotësisht pyetjen tuaj. A mund ta riformuloni ose të më pyesni diçka më specifike rreth energjisë diellore?"
};

type TabType = 'quiz' | 'simulation' | 'forum';

interface QuizProgress {
  category: string;
  score: number;
  totalQuestions: number;
  date: Date;
  points: number;
  timeSpent: number;
  difficulty: string;
}

interface UserProgress {
  totalPoints: number;
  completedQuizzes: QuizProgress[];
  achievements: string[];
  level: number;
  nextLevelPoints: number;
}

const calculatePoints = (score: number, difficulty: string, timeSpent: number) => {
  // Base points per correct answer
  const basePoints = 10;
  
  // Difficulty multiplier
  const difficultyMultiplier = 
    difficulty === 'easy' ? 1 :
    difficulty === 'medium' ? 1.5 :
    2; // hard
    
  // Time bonus (if completed under 30 seconds per question)
  const timeBonus = timeSpent < 30 ? 1.2 : 1;
  
  return Math.round(score * basePoints * difficultyMultiplier * timeBonus);
};

const calculateLevel = (points: number) => {
  // Every 100 points = 1 level
  return Math.floor(points / 100) + 1;
};

const calculateNextLevelPoints = (currentPoints: number) => {
  const nextLevel = calculateLevel(currentPoints) + 1;
  return nextLevel * 100;
};

const STORAGE_KEY = 'quiz_progress';

const loadProgress = (): UserProgress => {
  const savedProgress = localStorage.getItem(STORAGE_KEY);
  if (savedProgress) {
    const parsed = JSON.parse(savedProgress);
    // Convert date strings back to Date objects
    parsed.completedQuizzes = parsed.completedQuizzes.map((quiz: any) => ({
      ...quiz,
      date: new Date(quiz.date)
    }));
    return parsed;
  }
  return {
    totalPoints: 0,
    completedQuizzes: [],
    achievements: [],
    level: 1,
    nextLevelPoints: 100
  };
};

const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

interface DrawingProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

// Simulation Types and Interfaces
interface SimulationState {
  activeSimulation: string;
  batteryLevel: number;
  consumption: number;
  gridConnection: boolean;
  inverterEfficiency: number;
  temperature: number;
  shadingPercentage: number;
  panelType: string;
  roofAngle: number;
  systemSize: number;
  monthlyBill: number;
  energyPrice: number;
}

const initialSimulationState: SimulationState = {
  activeSimulation: 'panel',
  batteryLevel: 80,
  consumption: 500,
  gridConnection: true,
  inverterEfficiency: 96,
  temperature: 25,
  shadingPercentage: 0,
  panelType: 'mono',
  roofAngle: 30,
  systemSize: 5,
  monthlyBill: 150,
  energyPrice: 0.12
};

const Edukimi: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('quiz');
  const [selectedCategory, setSelectedCategory] = useState('basics');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuizDashboard, setShowQuizDashboard] = useState(true);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [userProgress, setUserProgress] = useState<UserProgress>(loadProgress());

  // Simulation states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sunAngle, setSunAngle] = useState(30);
  const [direction, setDirection] = useState('Jug');
  const [weather, setWeather] = useState('Diell');
  const [production, setProduction] = useState(5.0);
  const [activeSimulation, setActiveSimulation] = useState('panel');
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [consumptionValue, setConsumptionValue] = useState(3.5);
  const [consumptionHistory, setConsumptionHistory] = useState<number[]>([]);
  const [gridConnection, setGridConnection] = useState(true);
  const [inverterEfficiency, setInverterEfficiency] = useState(96);
  const [temperature, setTemperature] = useState(25);
  const [shadingPercentage, setShadingPercentage] = useState(0);
  const [panelType, setPanelType] = useState('mono');
  const [roofAngle, setRoofAngle] = useState(30);

  // Inside Edukimi component, add:
  const [simulationState, setSimulationState] = useState<SimulationState>(initialSimulationState);

  // Drawing functions
  const drawSolarPanel = useCallback(({ ctx, width, height }: DrawingProps) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.7);
    
    // Draw ground
    const groundGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
    groundGradient.addColorStop(0, '#90EE90');
    groundGradient.addColorStop(1, '#228B22');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, height * 0.7, width, height * 0.3);
    
    // Draw sun with rays
    const sunX = width * 0.8;
    const sunY = height * 0.2;
    const sunRadius = width * 0.05;
    
    // Sun glow
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2);
    sunGlow.addColorStop(0, 'rgba(255, 255, 0, 0.3)');
    sunGlow.addColorStop(1, 'rgba(255, 255, 0, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun body
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    
    // Draw house
    const houseWidth = width * 0.4;
    const houseHeight = height * 0.35;
    const houseX = width * 0.3;
    const houseY = height * 0.7;
    
    // House walls
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(houseX, houseY - houseHeight, houseWidth, houseHeight);
    
    // House roof
    ctx.beginPath();
    ctx.moveTo(houseX - 20, houseY - houseHeight);
    ctx.lineTo(houseX + houseWidth/2, houseY - houseHeight - houseHeight * 0.4);
    ctx.lineTo(houseX + houseWidth + 20, houseY - houseHeight);
    ctx.fillStyle = '#654321';
    ctx.fill();
    
    // Draw solar panel on roof
    const panelWidth = houseWidth * 0.6;
    const panelHeight = houseHeight * 0.4;
    const panelX = houseX + (houseWidth - panelWidth) / 2;
    const panelY = houseY - houseHeight - houseHeight * 0.35;
    
    ctx.save();
    ctx.translate(panelX + panelWidth/2, panelY + panelHeight/2);
    ctx.rotate((roofAngle * Math.PI) / 180);
    
    // Panel frame
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight);
    
    // Panel cells
    const cellColor = panelType === 'mono' ? '#1E2761' : '#2E4272';
    const cellRows = 4;
    const cellCols = 8;
    const cellWidth = (panelWidth * 0.9) / cellCols;
    const cellHeight = (panelHeight * 0.9) / cellRows;
    const startX = -panelWidth/2 + panelWidth * 0.05;
    const startY = -panelHeight/2 + panelHeight * 0.05;
    
    for(let i = 0; i < cellRows; i++) {
      for(let j = 0; j < cellCols; j++) {
        ctx.fillStyle = cellColor;
        ctx.fillRect(
          startX + j * cellWidth,
          startY + i * cellHeight,
          cellWidth * 0.95,
          cellHeight * 0.95
        );
        
        // Cell borders
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          startX + j * cellWidth,
          startY + i * cellHeight,
          cellWidth * 0.95,
          cellHeight * 0.95
        );
      }
    }
    
    // Draw shading if applicable
    if (shadingPercentage > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${shadingPercentage / 100 * 0.7})`;
      ctx.fillRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight);
    }
    
    // Temperature effect
    if (temperature > 25) {
      const heatIntensity = (temperature - 25) / 20;
      
      // Red overlay
      ctx.fillStyle = `rgba(255, 0, 0, ${heatIntensity * 0.2})`;
      ctx.fillRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight);
      
      // Heat waves
      ctx.strokeStyle = `rgba(255, 0, 0, ${heatIntensity * 0.4})`;
      ctx.lineWidth = 2;
      
      for(let i = 0; i < 3; i++) {
        ctx.beginPath();
        for(let x = -panelWidth/2; x <= panelWidth/2; x += 20) {
          const waveHeight = Math.sin(x / 50 + Date.now() / 1000 + i) * 5;
          ctx.lineTo(x, -panelHeight/2 + panelHeight * (i + 1)/4 + waveHeight);
        }
        ctx.stroke();
      }
    }
    
    ctx.restore();
    
    // Efficiency indicator
    const efficiency = Math.round((production / 5.0) * 100);
    const indicatorWidth = width * 0.15;
    const indicatorHeight = height * 0.04;
    const indicatorX = width - indicatorWidth - 20;
    const indicatorY = height - indicatorHeight - 20;
    
    // Indicator background
    ctx.fillStyle = '#fff';
    ctx.fillRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight);
    
    // Efficiency bar
    const barGradient = ctx.createLinearGradient(indicatorX, 0, indicatorX + indicatorWidth, 0);
    barGradient.addColorStop(0, '#00ff00');
    barGradient.addColorStop(0.5, '#ffff00');
    barGradient.addColorStop(1, '#ff0000');
    
    ctx.fillStyle = barGradient;
    ctx.fillRect(
      indicatorX,
      indicatorY,
      indicatorWidth * (efficiency / 100),
      indicatorHeight
    );
    
    // Efficiency text
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${efficiency}% Eficiencë`,
      indicatorX + indicatorWidth / 2,
      indicatorY + indicatorHeight / 2 + 5
    );
    
  }, [roofAngle, panelType, shadingPercentage, temperature, production]);

  const drawBattery = useCallback(({ ctx, width, height }: DrawingProps) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const batteryWidth = width * 0.4;
    const batteryHeight = height * 0.6;
    const x = width * 0.3;
    const y = height * 0.2;
    
    // Battery container shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    // Battery container
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, batteryWidth, batteryHeight);
    ctx.shadowColor = 'transparent';
    
    // Battery level
    const levelHeight = batteryHeight * (batteryLevel / 100);
    const gradient = ctx.createLinearGradient(x, y + batteryHeight - levelHeight, x, y + batteryHeight);
    
    if (batteryLevel > 60) {
      gradient.addColorStop(0, '#4CAF50');
      gradient.addColorStop(1, '#81C784');
    } else if (batteryLevel > 20) {
      gradient.addColorStop(0, '#FFC107');
      gradient.addColorStop(1, '#FFD54F');
    } else {
      gradient.addColorStop(0, '#F44336');
      gradient.addColorStop(1, '#E57373');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      x,
      y + batteryHeight - levelHeight,
      batteryWidth,
      levelHeight
    );
    
    // Battery terminal
    ctx.fillStyle = '#333';
    ctx.fillRect(x + batteryWidth * 0.35, y - height * 0.05, batteryWidth * 0.3, height * 0.05);
    
    // Grid connection indicator
    if (gridConnection) {
      // Draw power lines
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 3;
      
      const startX = x + batteryWidth + 50;
      const startY = y + batteryHeight / 2;
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(startX, startY + i * 20);
        ctx.lineTo(startX + 50, startY + i * 20);
        ctx.stroke();
      }
      
      // Draw connection status
      ctx.fillStyle = '#4CAF50';
      ctx.font = '14px Arial';
      ctx.fillText('Lidhur me Rrjetin', startX - 20, startY + 80);
    }
    
    // Consumption indicator
    const consumptionHeight = 5;
    const consumptionWidth = (consumptionValue / 10) * batteryWidth;
    
    ctx.fillStyle = '#E91E63';
    ctx.fillRect(x, y + batteryHeight + 20, consumptionWidth, consumptionHeight);
    
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText(`Konsumi: ${consumptionValue} kW`, x, y + batteryHeight + 40);
    
    // Battery percentage
    ctx.fillStyle = batteryLevel > 20 ? '#000' : '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${batteryLevel}%`,
      x + batteryWidth / 2,
      y + batteryHeight / 2 + 8
    );
  }, [batteryLevel, gridConnection, consumptionValue]);

  const drawConsumptionGraph = useCallback(({ ctx, width, height }: DrawingProps) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 24; i += 4) {
      const x = padding + (i / 24) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      
      // Hour labels
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${i}:00`, x, height - padding + 20);
    }
    
    // Horizontal grid lines
    const maxConsumption = Math.max(...consumptionHistory, 10);
    for (let i = 0; i <= maxConsumption; i += 2) {
      const y = height - padding - (i / maxConsumption) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // kWh labels
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${i} kWh`, padding - 10, y + 4);
    }
    
    // Draw consumption line
    if (consumptionHistory.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 3;
      
      consumptionHistory.forEach((value, index) => {
        const x = padding + (index / (consumptionHistory.length - 1)) * graphWidth;
        const y = height - padding - (value / maxConsumption) * graphHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Fill area under the line
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      ctx.fillStyle = 'rgba(33, 150, 243, 0.1)';
      ctx.fill();
      
      // Draw data points
      consumptionHistory.forEach((value, index) => {
        const x = padding + (index / (consumptionHistory.length - 1)) * graphWidth;
        const y = height - padding - (value / maxConsumption) * graphHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#2196F3';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Konsumi i Energjisë (24 orë)', width / 2, padding - 10);
  }, [consumptionHistory]);

  const handleCanvasUpdate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const props = { ctx, width, height };
    
    switch (activeSimulation) {
      case 'solar':
        drawSolarPanel(props);
        break;
      case 'battery':
        drawBattery(props);
        break;
      case 'consumption':
        drawConsumptionGraph(props);
        break;
    }
  }, [activeSimulation, drawSolarPanel, drawBattery, drawConsumptionGraph]);

  // Update canvas when dependencies change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw based on active simulation
    handleCanvasUpdate();
  }, [
    activeSimulation,
    handleCanvasUpdate
  ]);

  // Load progress on component mount
  useEffect(() => {
    const savedProgress = loadProgress();
    setUserProgress(savedProgress);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(userProgress);
  }, [userProgress]);

  // Calculate production based on simulation parameters
  useEffect(() => {
    let baseProduction = 5.0;
    
    // Angle efficiency
    const angleEfficiency = Math.sin((sunAngle * Math.PI) / 180);
    
    // Direction multiplier
    const directionMultiplier = direction === 'Jug' ? 1 :
                               direction === 'Lindje' || direction === 'Perëndim' ? 0.7 :
                               0.4;
    
    // Weather multiplier
    const weatherMultiplier = weather === 'Diell' ? 1 :
                             weather === 'Re' ? 0.6 :
                             0.3;
    
    const newProduction = baseProduction * angleEfficiency * directionMultiplier * weatherMultiplier;
    setProduction(Number(newProduction.toFixed(2)));
  }, [sunAngle, direction, weather]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const currentCategoryQuestions = quizCategories[selectedCategory as keyof typeof quizCategories].questions;
    const isCorrect = selectedAnswer === currentCategoryQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      
      if (currentQuestion < currentCategoryQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const currentCategoryQuestions = quizCategories[selectedCategory as keyof typeof quizCategories].questions;
  const currentQuestionData = currentCategoryQuestions[currentQuestion];

  // Filter videos by category
  const [selectedVideoCategory, setSelectedVideoCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVideos = videoLessons.filter(video => {
    const matchesCategory = selectedVideoCategory === 'all' || video.category === selectedVideoCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Track video progress
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const handleVideoComplete = (videoId: string) => {
    if (!watchedVideos.includes(videoId)) {
      setWatchedVideos([...watchedVideos, videoId]);
    }
  };

  // Calculate total questions per category
  const getTotalQuestions = (category: string) => {
    return quizCategories[category as keyof typeof quizCategories].questions.length;
  };

  // Calculate completion percentage per category
  const getCategoryCompletion = (category: string) => {
    const completed = userProgress.completedQuizzes.filter(q => q.category === category).length;
    const total = getTotalQuestions(category);
    return Math.round((completed / total) * 100);
  };

  const startQuiz = (category: string) => {
    setShowQuizDashboard(false);
    setSelectedCategory(category);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizCompleted(false);
    setQuizStartTime(Date.now());
  };

  const handleQuizComplete = () => {
    const timeSpent = (Date.now() - quizStartTime) / 1000;
    const averageTimePerQuestion = timeSpent / currentCategoryQuestions.length;
    
    const earnedPoints = calculatePoints(
      score,
      currentQuestionData.difficulty,
      averageTimePerQuestion
    );

    const newQuizProgress: QuizProgress = {
      category: selectedCategory,
      score: score,
      totalQuestions: currentCategoryQuestions.length,
      date: new Date(),
      points: earnedPoints,
      timeSpent: timeSpent,
      difficulty: currentQuestionData.difficulty
    };

    const newProgress = {
      ...userProgress,
      totalPoints: userProgress.totalPoints + earnedPoints,
      completedQuizzes: [...userProgress.completedQuizzes, newQuizProgress],
      level: calculateLevel(userProgress.totalPoints + earnedPoints),
      nextLevelPoints: calculateNextLevelPoints(userProgress.totalPoints + earnedPoints)
    };

    setUserProgress(newProgress);
    saveProgress(newProgress);
    setQuizCompleted(true);

    const oldLevel = calculateLevel(userProgress.totalPoints);
    const newLevel = calculateLevel(userProgress.totalPoints + earnedPoints);
    if (newLevel > oldLevel) {
      console.log(`Congratulations! You reached level ${newLevel}!`);
    }
  };

  // Modify the quiz dashboard header to show level and progress
  const renderQuizDashboardHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold text-[#00b894] mb-2">Qendra e Kuizeve</h2>
        <p className="text-gray-600">Zgjidh një kategori për të filluar mësimin</p>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-3xl font-bold text-[#00b894]">{userProgress.totalPoints}</p>
          <p className="text-sm text-gray-600">Pikë Totale</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <p className="text-3xl font-bold text-[#fab32b]">Niveli {userProgress.level}</p>
          </div>
          <div className="w-32 h-2 bg-gray-100 rounded-full mt-2">
            <div 
              className="h-full bg-gradient-to-r from-[#fab32b] to-[#f39c12] rounded-full"
              style={{ 
                width: `${(userProgress.totalPoints % 100) / 100 * 100}%`
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {userProgress.nextLevelPoints - userProgress.totalPoints} pikë deri në nivelin tjetër
          </p>
        </div>
      </div>
    </div>
  );

  // Modify the quiz completion screen to show detailed points breakdown
  const renderQuizCompletionScreen = () => (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-center">
          <span className="text-5xl mb-4 block">🎉</span>
          <h3 className="text-2xl font-bold text-[#00b894] mb-2">Urime!</h3>
          <p className="text-gray-600 mb-6">
            Përfunduat kuizin me sukses
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>Përgjigje të sakta</span>
            <span className="font-semibold">{score}/{currentCategoryQuestions.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>Pikë bazë</span>
            <span className="font-semibold">{score * 10}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>Bonus vështirësie</span>
            <span className="font-semibold text-[#00b894]">
              {currentQuestionData.difficulty === 'easy' ? '+0%' :
               currentQuestionData.difficulty === 'medium' ? '+50%' :
               '+100%'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>Bonus kohe</span>
            <span className="font-semibold text-[#fab32b]">
              {(Date.now() - quizStartTime) / 1000 / currentCategoryQuestions.length < 30 ? '+20%' : '+0%'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-[#00b894]/10 rounded-lg">
            <span className="font-medium">Totali i pikëve</span>
            <span className="font-bold text-[#00b894]">
              +{calculatePoints(
                score,
                currentQuestionData.difficulty,
                (Date.now() - quizStartTime) / 1000 / currentCategoryQuestions.length
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={() => setShowQuizDashboard(true)}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Kthehu te Qendra
          </motion.button>
          <motion.button
            onClick={() => handleCategoryChange(selectedCategory)}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-[#00b894] to-[#00a884] text-white rounded-xl font-medium hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Provo Përsëri
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw based on active simulation
    switch (activeSimulation) {
      case 'panel':
        drawSolarPanel({ ctx, width: canvas.width, height: canvas.height });
        break;
      case 'battery':
        drawBattery({ ctx, width: canvas.width, height: canvas.height });
        break;
      case 'consumption':
        drawConsumptionGraph({ ctx, width: canvas.width, height: canvas.height });
        break;
    }
  }, [
    activeSimulation,
    drawSolarPanel,
    drawBattery,
    drawConsumptionGraph
  ]);

  // Update consumption handlers
  const handleConsumptionChange = (value: number) => {
    setConsumptionValue(value);
    setConsumptionHistory(prev => [...prev, value].slice(-24)); // Keep last 24 hours
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[#00b894] via-[#fab32b] to-[#0984e3] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Zona Interaktive e Dijes
          </motion.h1>
          <motion.p
            className="text-gray-600 text-center mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Eksploro, mëso dhe testo njohuritë tuaja rreth energjisë diellore përmes kuizeve, videove dhe simulimeve interaktive.
          </motion.p>
        </header>

        <nav className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'quiz', label: 'Kuizet', icon: '📝' },
              { id: 'videos', label: 'Video-Mësimet', icon: '🎥' },
              { id: 'simulation', label: 'Simulimet', icon: '🔬' }
            ].map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 text-sm
                          ${activeTab === tab.id
                    ? 'bg-white text-[#00b894] shadow-lg scale-105 border border-[#00b894]/10' 
                    : 'bg-white/50 text-gray-600 hover:bg-white hover:shadow-md'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        <AnimatePresence mode="wait">
            <motion.div
            key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100"
          >
            {activeTab === 'quiz' && (
              <>
                {showQuizDashboard ? (
                  <div className="space-y-8">
                    {renderQuizDashboardHeader()}
                    {/* Quiz Dashboard Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(quizCategories).map(([key, category]) => (
                <motion.div
                          key={key}
                          className="bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-[#00b894] transition-all duration-300"
                          whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-500">
                              {getCategoryCompletion(key)}% Përfunduar
                            </span>
                    </div>
                          
                          <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                          
                          <div className="mb-4">
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#00b894] to-[#00a884] rounded-full transition-all duration-500"
                                style={{ width: `${getCategoryCompletion(key)}%` }}
                              />
                    </div>
                    </div>

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span>{getTotalQuestions(key)} Pyetje</span>
                            <span>{Math.round(getTotalQuestions(key) * 0.6)} Pikë Maksimale</span>
                  </div>

                          <motion.button
                            onClick={() => startQuiz(key)}
                            className="w-full py-2 px-4 bg-gradient-to-r from-[#00b894] to-[#00a884] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Fillo Kuizin
                          </motion.button>
                </motion.div>
              ))}
                    </div>

                    {/* Recent Activity */}
                    {userProgress.completedQuizzes.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Aktiviteti i Fundit</h3>
                        <div className="space-y-3">
                          {userProgress.completedQuizzes.slice(-3).reverse().map((quiz, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {quizCategories[quiz.category as keyof typeof quizCategories].icon}
                                </span>
                                <div>
                                  <p className="font-medium">
                                    {quizCategories[quiz.category as keyof typeof quizCategories].title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(quiz.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-[#00b894]">
                                  {quiz.score}/{quiz.totalQuestions} Saktë
                                </p>
                                <p className="text-sm text-gray-500">
                                  {quiz.score * 10} Pikë
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Quiz Header */}
                    <div className="flex items-center justify-between mb-6">
                      <motion.button
                        onClick={() => setShowQuizDashboard(true)}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#00b894] transition-colors"
                        whileHover={{ x: -5 }}
                      >
                        <span>←</span>
                        <span>Kthehu te Qendra</span>
                      </motion.button>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">
                          {quizCategories[selectedCategory as keyof typeof quizCategories].icon}
                        </span>
                        <h2 className="text-xl font-semibold">
                          {quizCategories[selectedCategory as keyof typeof quizCategories].title}
                        </h2>
                      </div>
                    </div>

                    {/* Quiz Progress */}
                    <div className="mb-6">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
                          className="h-2 bg-gradient-to-r from-[#00b894] to-[#00a884] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestion + 1) / currentCategoryQuestions.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          Pyetja {currentQuestion + 1} nga {currentCategoryQuestions.length}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          currentQuestionData.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          currentQuestionData.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {currentQuestionData.difficulty === 'easy' ? 'Lehtë' :
                           currentQuestionData.difficulty === 'medium' ? 'Mesatar' : 'Vështirë'}
                        </span>
                      </div>
                    </div>

                    {/* Question */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="text-xl font-semibold mb-6">{currentQuestionData.title}</h3>
                      <div className="space-y-3">
                        {currentQuestionData.options.map((option, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                              selectedAnswer === index
                                ? 'border-[#00b894] bg-[#00b894]/5 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={showFeedback}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    {showFeedback && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-xl ${
                          selectedAnswer === currentQuestionData.correctAnswer
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">
                            {selectedAnswer === currentQuestionData.correctAnswer ? '🎉' : '❌'}
                          </span>
                          <p className="font-semibold text-lg">
                            {selectedAnswer === currentQuestionData.correctAnswer
                              ? 'Përgjigje e saktë!'
                              : 'Përgjigje e pasaktë'}
                          </p>
                        </div>
                        <p className="text-gray-700">{currentQuestionData.explanation}</p>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      onClick={() => {
                        if (showFeedback) {
                          if (currentQuestion < currentCategoryQuestions.length - 1) {
                            setCurrentQuestion(currentQuestion + 1);
                            setSelectedAnswer(null);
                            setShowFeedback(false);
                          } else {
                            handleQuizComplete();
                          }
                        } else {
                          handleSubmit();
                        }
                      }}
                      disabled={selectedAnswer === null}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedAnswer === null
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#00b894] to-[#00a884] text-white hover:shadow-lg'
                      }`}
                      whileHover={selectedAnswer !== null ? { scale: 1.02 } : {}}
                      whileTap={selectedAnswer !== null ? { scale: 0.98 } : {}}
                    >
                      {showFeedback 
                        ? currentQuestion < currentCategoryQuestions.length - 1
                          ? 'Pyetja Tjetër'
                          : 'Përfundo Kuizin'
                        : 'Kontrollo'}
                    </motion.button>
                  </div>
                )}

                {quizCompleted && renderQuizCompletionScreen()}
              </>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <h2 className="text-2xl font-bold text-[#e67e22]">Video-Mësimet</h2>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Kërko video..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e67e22] w-full md:w-auto"
                    />
                    <select
                      value={selectedVideoCategory}
                      onChange={(e) => setSelectedVideoCategory(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#e67e22] w-full md:w-auto"
                    >
                      <option value="all">Të gjitha</option>
                      <option value="basics">Bazat</option>
                      <option value="practical">Praktike</option>
                      <option value="advanced">Avancuar</option>
                      <option value="economics">Ekonomi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map(video => (
                <motion.div
                      key={video.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-video relative">
                        <iframe
                          src={video.videoUrl}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                    />
                  </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {video.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                              {tag}
                      </span>
                          ))}
                    </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 flex items-center gap-1">
                            <span>⏱️</span>
                            {video.duration}
                          </span>
                          <span className="text-[#e67e22] font-medium flex items-center gap-1">
                            <span>⭐</span>
                            +{video.points} pikë
                          </span>
                        </div>
                        {watchedVideos.includes(video.id) && (
                          <div className="mt-3 text-sm text-green-600 flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full w-fit">
                            <span>✓</span>
                            <span>E përfunduar</span>
                          </div>
                        )}
                  </div>
                </motion.div>
              ))}
                </div>
              </div>
            )}

            {activeTab === 'simulation' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#fab32b] to-[#f39c12] bg-clip-text text-transparent">
                    Simulimet Profesionale
                  </h2>
                  <div className="text-sm text-gray-500">
                    Eksploro dhe analizo sistemet solare në detaje
                  </div>
                </div>

                {/* Simulation Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { id: 'panel', title: 'Paneli Solar', icon: '☀️', desc: 'Simulim i prodhimit të energjisë' },
                    { id: 'battery', title: 'Sistemi i Baterisë', icon: '🔋', desc: 'Analiza e ruajtjes së energjisë' },
                    { id: 'consumption', title: 'Konsumi', icon: '📊', desc: 'Monitorimi i konsumit të energjisë' },
                    { id: 'roi', title: 'ROI Calculator', icon: '💰', desc: 'Llogaritja e kthimit të investimit' }
                  ].map(sim => (
                    <motion.button
                      key={sim.id}
                      onClick={() => setActiveSimulation(sim.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        activeSimulation === sim.id
                          ? 'border-[#fab32b] bg-[#fab32b]/5 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl mb-2 block">{sim.icon}</span>
                      <h3 className="font-semibold mb-1">{sim.title}</h3>
                      <p className="text-sm text-gray-600">{sim.desc}</p>
                    </motion.button>
                  ))}
                </div>

                {/* Main Simulation Area */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {activeSimulation === 'panel' && (
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Canvas Container */}
                        <div className="bg-gray-50 rounded-xl border-2 border-gray-100 p-4 min-h-[400px] flex items-center justify-center">
                          <div className="w-full h-[400px] relative">
                            <canvas
                              ref={canvasRef}
                              className="w-full h-full"
                              style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Lloji i Panelit
                              </label>
                              <select
                                value={panelType}
                                onChange={(e) => setPanelType(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#fab32b]"
                              >
                                <option value="mono">Monokristalor</option>
                                <option value="poly">Polikristalor</option>
                                <option value="thin">Thin Film</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Temperatura ({temperature}°C)
                              </label>
                              <input
                                type="range"
                                min="15"
                                max="45"
                                value={temperature}
                                onChange={(e) => setTemperature(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Këndi i Çatisë ({roofAngle}°)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="45"
                                value={roofAngle}
                                onChange={(e) => setRoofAngle(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Hijezimi ({shadingPercentage}%)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={shadingPercentage}
                                onChange={(e) => setShadingPercentage(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Drejtimi
                              </label>
                              <select
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#fab32b]"
                              >
                                <option value="Jug">Jug</option>
                                <option value="Lindje">Lindje</option>
                                <option value="Perëndim">Perëndim</option>
                                <option value="Veri">Veri</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Kushtet Atmosferike
                              </label>
                              <select
                                value={weather}
                                onChange={(e) => setWeather(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#fab32b]"
                              >
                                <option value="Diell">Me diell</option>
                                <option value="Re">Me re</option>
                                <option value="Shi">Me shi</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Results Dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-6">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Prodhimi Aktual</h4>
                          <p className="text-2xl font-bold text-[#fab32b]">{production} kWh</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Eficienca</h4>
                          <p className="text-2xl font-bold text-[#00b894]">
                            {Math.round((production / 5.0) * 100)}%
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Humbjet nga Temperatura</h4>
                          <p className="text-2xl font-bold text-[#e74c3c]">
                            {Math.round((temperature - 25) * 0.4)}%
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Prodhimi Vjetor</h4>
                          <p className="text-2xl font-bold text-[#0984e3]">
                            {Math.round(production * 365 * 0.75)} kWh
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSimulation === 'battery' && (
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Battery Visualization */}
                        <div className="bg-gray-50 rounded-xl border-2 border-gray-100 p-4 min-h-[400px] flex items-center justify-center">
                          <div className="w-full h-[400px] relative">
                            <canvas
                              ref={canvasRef}
                              className="w-full h-full"
                              style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                          </div>
                        </div>

                        {/* Battery Controls */}
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Niveli i Baterisë ({batteryLevel}%)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={batteryLevel}
                                onChange={(e) => setBatteryLevel(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Konsumi Aktual ({consumptionValue} kW)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={consumptionValue}
                                onChange={(e) => handleConsumptionChange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">
                                Lidhja me Rrjetin
                              </label>
                    <button
                                onClick={() => setGridConnection(!gridConnection)}
                                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                  gridConnection
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {gridConnection ? 'E Lidhur' : 'E Shkëputur'}
                    </button>
                </div>
              </div>

                          {/* Battery Stats */}
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Statistikat e Sistemit</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Kapaciteti i Mbetur</h4>
                                <p className="text-2xl font-bold text-green-500">{batteryLevel}%</p>
                        </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Koha e Mbetur</h4>
                                <p className="text-2xl font-bold text-[#0984e3]">
                                  {Math.round((batteryLevel / 100 * 10) / consumptionValue * 60)} min
                                </p>
                      </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Statusi</h4>
                                <p className="text-2xl font-bold text-[#00b894]">
                                  {batteryLevel > 20 ? 'Optimal' : 'I Ulët'}
                                </p>
                        </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Konsumi Total</h4>
                                <p className="text-2xl font-bold text-[#e74c3c]">
                                  {(consumptionValue * 24).toFixed(1)} kWh/ditë
                                </p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
                    </div>
                  )}

                  {activeSimulation === 'consumption' && (
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Consumption Graph */}
                        <div className="bg-gray-50 rounded-xl border-2 border-gray-100 p-4 min-h-[400px] flex items-center justify-center">
                          <div className="w-full h-[400px] relative">
                            <canvas
                              ref={canvasRef}
                              className="w-full h-full"
                              style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
        </div>
                        </div>

                        {/* Consumption Analysis */}
                        <div className="space-y-6">
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Analiza e Konsumit</h3>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <h4 className="text-sm font-medium text-gray-600 mb-2">Konsumi Ditor</h4>
                                  <p className="text-2xl font-bold text-[#0984e3]">{(consumptionValue * 24).toFixed(1)} kWh</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <h4 className="text-sm font-medium text-gray-600 mb-2">Konsumi Mujor</h4>
                                  <p className="text-2xl font-bold text-[#0984e3]">{(consumptionValue * 24 * 30).toFixed(1)} kWh</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-700">Shpërndarja e Konsumit</h4>
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Pajisjet Elektrike</span>
                                      <span className="text-sm font-medium">45%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                      <div className="w-[45%] h-full bg-blue-500 rounded-full"/>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Ngrohje/Ftohje</span>
                                      <span className="text-sm font-medium">30%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                      <div className="w-[30%] h-full bg-green-500 rounded-full"/>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-gray-600">Ndriçimi</span>
                                      <span className="text-sm font-medium">15%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full">
                                      <div className="w-[15%] h-full bg-yellow-500 rounded-full"/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSimulation === 'roi' && (
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* ROI Calculator Controls */}
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Madhësia e Sistemit (kW)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={simulationState.systemSize}
                                onChange={(e) => setSimulationState({
                                  ...simulationState,
                                  systemSize: Number(e.target.value)
                                })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#fab32b]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Fatura Mujore (€)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={simulationState.monthlyBill}
                                onChange={(e) => setSimulationState({
                                  ...simulationState,
                                  monthlyBill: Number(e.target.value)
                                })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#fab32b]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Çmimi i Energjisë (€/kWh)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={simulationState.energyPrice}
                                onChange={(e) => setSimulationState({
                                  ...simulationState,
                                  energyPrice: Number(e.target.value)
                                })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#fab32b]"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Eficienca e Inverterit (%)
                              </label>
                              <input
                                type="number"
                                min="80"
                                max="100"
                                value={simulationState.inverterEfficiency}
                                onChange={(e) => setSimulationState({
                                  ...simulationState,
                                  inverterEfficiency: Number(e.target.value)
                                })}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#fab32b]"
                              />
                            </div>
                          </div>

                          {/* Results Dashboard */}
                          <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Analiza e Investimit</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Kosto Totale</h4>
                                <p className="text-2xl font-bold text-[#e74c3c]">
                                  {(simulationState.systemSize * 800).toFixed(0)}€
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Kursimi Vjetor</h4>
                                <p className="text-2xl font-bold text-[#00b894]">
                                  {(simulationState.monthlyBill * 12).toFixed(0)}€
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Periudha e Kthimit</h4>
                                <p className="text-2xl font-bold text-[#0984e3]">
                                  {((simulationState.systemSize * 800) / (simulationState.monthlyBill * 12)).toFixed(1)} vite
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">ROI 25-Vjeçar</h4>
                                <p className="text-2xl font-bold text-[#fab32b]">
                                  {(((simulationState.monthlyBill * 12 * 25) - (simulationState.systemSize * 800)) / (simulationState.systemSize * 800) * 100).toFixed(0)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ROI Graph */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold mb-4">Parashikimi Financiar 25-Vjeçar</h3>
                          <div className="space-y-4">
                            <div className="relative pt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Investimi Fillestar</span>
                                <span className="font-medium text-[#e74c3c]">
                                  -{(simulationState.systemSize * 800).toFixed(0)}€
                                </span>
                              </div>
                              <div className="h-2 bg-[#e74c3c] rounded-full" />
                            </div>

                            <div className="relative pt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Kursimet Totale</span>
                                <span className="font-medium text-[#00b894]">
                                  +{(simulationState.monthlyBill * 12 * 25).toFixed(0)}€
                                </span>
                              </div>
                              <div className="h-2 bg-[#00b894] rounded-full" />
                            </div>

                            <div className="relative pt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Fitimi Net</span>
                                <span className="font-medium text-[#0984e3]">
                                  {((simulationState.monthlyBill * 12 * 25) - (simulationState.systemSize * 800)).toFixed(0)}€
                                </span>
                              </div>
                              <div className="h-2 bg-[#0984e3] rounded-full" style={{
                                width: `${Math.min(100, ((simulationState.monthlyBill * 12 * 25) / (simulationState.systemSize * 800)) * 50)}%`
                              }} />
                            </div>

                            <div className="mt-8 p-4 bg-white rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3">Pikët Kyçe</h4>
                              <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-[#fab32b] rounded-full" />
                                  Kthimi i investimit pas {((simulationState.systemSize * 800) / (simulationState.monthlyBill * 12)).toFixed(1)} vitesh
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-[#00b894] rounded-full" />
                                  Kursime mujore prej {simulationState.monthlyBill.toFixed(0)}€
                                </li>
                                <li className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-[#0984e3] rounded-full" />
                                  Prodhim vjetor prej {(simulationState.systemSize * 1500).toFixed(0)} kWh
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Edukimi; 