export const ro = {
  common: {
    loading: 'Se incarca...',
    saving: 'Se salveaza...',
    error: 'Eroare',
    submit: 'Trimite',
    continue: 'Continua',
    back: 'Inapoi',
    close: 'Inchide',
    yes: 'Da',
    no: 'Nu',
    on: 'Activat',
    off: 'Dezactivat',
    none: 'Niciunul',
    select: 'Selecteaza...',
    view: 'Vizualizeaza',
    refresh: 'Reincarca',
    enter: 'Intra',
    adaptive: 'Adaptiv',
    control: 'Control',
    complete: 'Finalizat',
    active: 'Activ',
    condition: 'Conditie',
    session: 'Sesiune',
    participant: 'Participant',
    exportCsv: 'Exporta CSV',
    language: 'Limba',
  },

  study: {
    title: 'Studiu de Accesibilitate Adaptiva',
    steps: {
      consent: 'Consimtamant',
      warmup: 'Incalzire',
      tasks: 'Sarcini',
      sus: 'SUS',
      nasatlx: 'NASA-TLX',
      summary: 'Sumar',
    },
  },

  consent: {
    heading: 'Consimtamant & Configurare Studiu',
    participantInfo: 'Informatii Participant',
    participantId: 'ID Participant',
    participantIdPlaceholder: 'ex., P001',
    condition: 'Conditie',
    conditionAdaptive: 'Adaptiv (interfata se adapteaza la comportament)',
    conditionControl: 'Control (interfata statica)',
    informedConsent: 'Consimtamant Informat',
    consentText1:
      'Acest studiu investigheaza daca adaptarea interfetei bazata pe comportament poate imbunatati utilizabilitatea. In timpul sesiunii, sistemul va colecta date despre interactiunile dumneavoastra (click-uri, derulare, gesturi de zoom) pentru a evalua mecanismul de adaptare.',
    consentText2:
      'Participarea dumneavoastra este voluntara. Va puteti retrage in orice moment fara consecinte. Toate datele sunt stocate anonim folosind doar ID-ul de participant.',
    consentText3:
      'Sesiunea va dura aproximativ 15-20 de minute si include: o faza de incalzire, sarcini de citire si interactiune, si doua chestionare scurte.',
    consentCheckbox:
      'Am citit si inteles informatiile de mai sus. Consimt sa particip la acest studiu si la colectarea datelor mele de interactiune.',
    errorNoId: 'Va rugam sa introduceti un ID de participant.',
    errorNoConsent: 'Va rugam sa va dati consimtamantul pentru a continua.',
    errorSessionFailed: 'Nu s-a putut crea sesiunea. Asigurati-va ca backend-ul este pornit.',
    creatingSession: 'Se creeaza sesiunea...',
    beginStudy: 'Incepe Studiul',
  },

  warmup: {
    heading: 'Faza de Incalzire',
    timeRemaining: '{{time}}s ramase',
    readyToContinue: 'Gata de continuare',
    practiceHeading: 'Practica: Familiarizare',
    practiceText1:
      'Aceasta este o scurta faza de incalzire pentru a va ajuta sa va obisnuiti cu interfata. Nu ezitati sa derulati, sa faceti click pe butoane si sa cititi textul de mai jos.',
    practiceText2:
      'Sistemul va monitorizeaza acum interactiunile. In conditia adaptiva, interfata se poate ajusta in functie de tiparele comportamentului dumneavoastra. Acest lucru este normal si face parte din designul studiului.',
    instructions:
      'Aveti {{duration}} secunde sa explorati interfata. Derulati prin continut, faceti click pe butoane si incercati zoom-ul (Ctrl+Rotita).',
    continueToTasks: 'Continua la Sarcini',
    pleaseWait: 'Va rugam asteptati {{time}}s...',
  },

  tasks: {
    heading: 'Sarcina {{current}} din {{total}}',
    article: 'Articol: {{title}}',
    yourAnswer: 'Raspunsul Dumneavoastra',
    answerPlaceholder: 'Scrieti raspunsul aici...',
    navigationHint:
      'Derulati in jos pentru a gasi sectiunea mentionata, apoi interactionati cu zona de test.',
    submitContinue: 'Trimite & Continua',
    submitted: 'Trimis',
  },

  sus: {
    heading: 'Scala de Utilizabilitate a Sistemului (SUS)',
    instructions:
      'Va rugam sa evaluati acordul dumneavoastra cu fiecare afirmatie despre sistemul pe care tocmai l-ati folosit.',
    questions: [
      'Cred ca mi-ar placea sa folosesc acest sistem frecvent.',
      'Am gasit sistemul inutil de complex.',
      'Am considerat ca sistemul este usor de utilizat.',
      'Cred ca as avea nevoie de suportul unei persoane tehnice pentru a putea folosi acest sistem.',
      'Am constatat ca diferitele functii ale sistemului sunt bine integrate.',
      'Am considerat ca exista prea multa inconsistenta in acest sistem.',
      'Mi-as imagina ca majoritatea oamenilor ar invata sa foloseasca acest sistem foarte repede.',
      'Am gasit sistemul foarte greoi de utilizat.',
      'M-am simtit foarte increzator folosind sistemul.',
      'A trebuit sa invat multe lucruri inainte de a putea folosi acest sistem.',
    ],
    likert: [
      'Total Dezacord',
      'Dezacord',
      'Neutru',
      'Acord',
      'Total Acord',
    ],
    errorUnanswered: 'Va rugam sa raspundeti la intrebarea {{n}}.',
    errorSaveFailed: 'Nu s-au putut salva raspunsurile. Va rugam incercati din nou.',
    continueToNasaTlx: 'Continua la NASA-TLX',
  },

  nasatlx: {
    heading: 'NASA Task Load Index (NASA-TLX)',
    instructions: 'Evaluati fiecare dimensiune pe o scara de la 1 (scazut) la 7 (ridicat).',
    dimensions: {
      mental: {
        label: 'Cerinta Mentala',
        description: 'Cat de solicitanta mental a fost sarcina?',
        lowEnd: 'Foarte Scazuta',
        highEnd: 'Foarte Ridicata',
      },
      physical: {
        label: 'Cerinta Fizica',
        description: 'Cat de solicitanta fizic a fost sarcina?',
        lowEnd: 'Foarte Scazuta',
        highEnd: 'Foarte Ridicata',
      },
      temporal: {
        label: 'Cerinta Temporala',
        description: 'Cat de grabit sau presant a fost ritmul sarcinii?',
        lowEnd: 'Foarte Scazuta',
        highEnd: 'Foarte Ridicata',
      },
      performance: {
        label: 'Performanta',
        description: 'Cat de reusit ati fost in realizarea a ceea ce vi s-a cerut?',
        lowEnd: 'Perfect',
        highEnd: 'Esec',
      },
      effort: {
        label: 'Efort',
        description: 'Cat de mult a trebuit sa munciti pentru a va atinge nivelul de performanta?',
        lowEnd: 'Foarte Scazut',
        highEnd: 'Foarte Ridicat',
      },
      frustration: {
        label: 'Frustrare',
        description: 'Cat de nesigur, descurajat, iritat, stresat si enervat v-ati simtit?',
        lowEnd: 'Foarte Scazuta',
        highEnd: 'Foarte Ridicata',
      },
    },
    errorUnanswered: 'Va rugam sa evaluati "{{dimension}}".',
    errorSaveFailed: 'Nu s-au putut salva raspunsurile. Va rugam incercati din nou.',
    continueToSummary: 'Continua la Sumar',
  },

  summary: {
    heading: 'Va Multumim!',
    description: 'Sesiunea dumneavoastra s-a incheiat. Iata un sumar al participarii.',
    condition: 'Conditie',
    tasksCompleted: 'Sarcini Finalizate',
    totalTaskTime: 'Timp Total Sarcini',
    totalErrors: 'Erori Totale',
    questionnaireScores: 'Scoruri Chestionare',
    susScore: 'Scor SUS',
    nasaTlxAvg: 'Media NASA-TLX',
    sessionInfo: 'ID Sesiune: {{sessionId}} | Participant: {{participantId}}',
    closeMessage: 'Puteti inchide aceasta fereastra sau notifica cercetator.',
  },

  interactionZone: {
    heading: 'Zona de Test Interactiune',
    instructions:
      'Faceti click pe butoanele de mai jos pentru a testa acuratetea atingerii. Sistemul va detecta atingerile ratate (click-uri in afara butoanelor) si poate mari butoanele daca este necesar.',
    button: 'Buton {{id}}',
    totalClicks: 'Total click-uri:',
    btnCount: 'Btn {{id}}: {{count}}',
  },

  monitor: {
    debugPanel: 'Panou Debug',
    title: 'Monitor Adaptare',
    session: 'Sesiune:',
    signals: 'Semnale:',
    uiState: 'Stare Interfata:',
    adaptations: 'Adaptari:',
    noAdaptations: 'Nicio adaptare declansata inca',
    font: 'Font: {{value}}px',
    padding: 'Padding: {{value}}px',
    contrast: 'Contrast: N{{value}}',
    lineHeight: 'Inaltime linie: {{value}}',
    anim: 'Anim: {{value}}',
    cursor: 'Cursor: {{value}}x',
    simplified: 'Simplificat: {{value}}',
    readGuide: 'Ghid citire: {{value}}',
    taps: 'Atingeri: {{taps}} | Derulari: {{scrolls}}',
    updated: 'Actualizat: {{time}}',
    signalLabels: {
      zoom: 'Zoom',
      missRate: 'Rata Ratare',
      dwell: 'Stationare',
      scrollRev: 'Derulare Inv.',
      tremor: 'Tremur',
      rageClick: 'Click Furios',
      hesitation: 'Ezitare',
      idle: 'Inactiv',
      readSpd: 'Vit. Citire',
    },
  },

  dashboard: {
    title: 'Panou Cercetator',
    enterPassphrase: 'Introduceti parola',
    sessions: 'Sesiuni',
    compare: 'Compara',
    summary: 'Sumar',
    sessionList: {
      heading: 'Sesiuni ({{count}})',
      filterPlaceholder: 'Filtreaza dupa ID participant...',
      allConditions: 'Toate conditiile',
      participant: 'Participant',
      condition: 'Conditie',
      started: 'Inceput',
      sus: 'SUS',
      nasaTlx: 'NASA-TLX',
      status: 'Status',
      noSessions: 'Nu s-au gasit sesiuni.',
    },
    sessionDetail: {
      backToSessions: 'Inapoi la sesiuni',
      sessionHeading: 'Sesiune: {{participant}} ({{condition}})',
      started: 'Inceput',
      duration: 'Durata',
      susScore: 'Scor SUS',
      adaptations: 'Adaptari',
      nasaTlxScores: 'Scoruri NASA-TLX',
      signalHistory: 'Istoric Semnale ({{count}} instantanee)',
      adaptationEvents: 'Evenimente Adaptare',
      rule: 'Regula',
      time: 'Timp',
      taskMetrics: 'Metrici Sarcini',
      task: 'Sarcina',
      errors: 'Erori',
      loadingSession: 'Se incarca datele sesiunii...',
      sessionNotFound: 'Sesiunea nu a fost gasita.',
      signalLabels: {
        zoomCount: 'Numar Zoom',
        missedTapRate: 'Rata Atingeri Ratate',
        avgDwellSeconds: 'Stationare Medie (s)',
        scrollReversalRate: 'Rata Derulare Inv.',
        tremorScore: 'Tremur (px)',
        rageClickCount: 'Click-uri Furioase',
        mouseHesitationScore: 'Ezitare',
        idleSeconds: 'Inactiv (s)',
        readingSpeed: 'Vit. Citire',
      },
    },
    comparison: {
      heading: 'Comparatie Conditii',
      noParticipants:
        'Nu s-au gasit participanti cu ambele sesiuni (adaptiv si control). Fiecare participant are nevoie de doua sesiuni (cate una pe conditie) pentru comparatie.',
      selectParticipant: 'Selectati Participant',
      adaptive: 'Adaptiv',
      control: 'Control',
      delta: 'Delta (Adaptiv - Control)',
    },
    summaryStats: {
      heading: 'Statistici Sumare',
      totalSessions: 'Total Sesiuni',
      completed: 'Finalizate',
      meanSusByCondition: 'Scor SUS Mediu pe Conditie',
      noSusScores: 'Niciun scor SUS inregistrat inca.',
      nasaTlxByDimension: 'NASA-TLX pe Dimensiune',
      noNasaTlxData: 'Nicio data NASA-TLX inregistrata inca.',
    },
  },

  rawView: {
    initializingSession: 'Se initializeaza sesiunea...',
    title: 'Sistem de Accesibilitate Adaptiva (Vizualizare Bruta)',
    condition: 'Conditie: ',
    session: 'Sesiune: ',
  },

  articles: {
    sets: [
      {
        id: 'adaptive-interfaces',
        title: 'Interfete Adaptive',
        sections: [
          {
            id: 'intro',
            heading: 'Introducere in Interfetele Adaptive',
            paragraphs: [
              'Interfetele adaptive ale utilizatorului reprezinta o schimbare de paradigma in modul in care proiectam experientele digitale. In loc sa forteze utilizatorii sa navigheze prin meniuri complexe de setari, aceste sisteme observa tiparele de comportament si ajusteaza silentios interfata pentru a raspunde mai bine nevoilor individuale.',
              'Aceasta abordare este deosebit de valoroasa pentru accesibilitate, unde utilizatorii pot sa nu fie constienti de adaptarile disponibile sau pot gasi procesul de configurare prea impovarator. Prin detectarea semnalelor precum frecventa zoom-ului, acuratetea atingerilor si tiparele de citire, sistemele adaptive pot elimina proactiv barierele de acces.',
            ],
          },
          {
            id: 'methodology',
            heading: 'Metodologia Cercetarii',
            paragraphs: [
              'Acest sistem foloseste o abordare de adaptare bazata pe reguli, unde semnale comportamentale specifice declanseaza transformari predefinite ale interfetei. Fiecare prag de regula este justificat de cercetari evaluate de colegi in interactiunea om-calculator, standarde de accesibilitate si studii de control motor.',
              'Designul studiului intra-subiecti permite fiecarui participant sa experimenteze atat conditia adaptiva, cat si cea de control, maximizand puterea statistica si controland diferentele individuale. Contrabalansarea previne ca efectele de ordine sa confunde rezultatele.',
              'Colectarea datelor se concentreaza pe masuri obiective (timp de finalizare a sarcinii, rata de eroare) alaturi de evaluari subiective (Scala de Utilizabilitate a Sistemului, NASA Task Load Index). Aceasta abordare cu metode mixte ofera o vedere cuprinzatoare asupra impactului utilizabilitatii.',
            ],
          },
          {
            id: 'signals',
            heading: 'Detectarea Semnalelor Comportamentale',
            paragraphs: [
              'Sistemul urmareste cinci tipuri distincte de semnale. Numarul de zoom masoara gesturile de ciupire si evenimentele Ctrl+Rotita, indicand probleme de lizibilitate. Rata atingerilor ratate compara click-urile reusita pe butoane cu atingerile pe zone non-interactive, relevand provocari de control motor.',
              'Timpul de stationare foloseste IntersectionObserver pentru a urmari cat timp sectiunile raman vizibile in viewport, combinat cu detectarea derularii inverse pentru a identifica tiparele de recitire care sugereaza dificultati de intelegere. Scorul de tremur calculeaza deviatia standard a coordonatelor pozitiei atingerilor, cuantificand precizia de indicare.',
              'Fiecare semnal opereaza pe o fereastra de timp glisanta adecvata caracteristicilor sale de masurare. Evenimentele de zoom sunt urmarite pe 60 de secunde, atingerile ratate pe 30 de secunde, timpul de stationare pe 90 de secunde, derul arile inverse pe 45 de secunde si tremurul pe 8 secunde pentru feedback granular.',
            ],
          },
          {
            id: 'adaptation',
            heading: 'Regulile de Adaptare',
            paragraphs: [
              'Cinci reguli de adaptare transforma semnalele detectate in modificari ale interfetei. Scalarea fontului creste dimensiunea textului cand apare zoom-ul repetat. Marirea butoanelor adauga padding cand acuratetea atingerilor se degradeaza. Cresterea contrastului progreseaza prin nivelurile WCAG cand se detecteaza dificultati de citire.',
              'Cresterea spatierilor ajusteaza inaltimea liniei pentru a compensa imprecizia de indicare. Reducerea miscarii dezactiveaza animatiile pentru utilizatorii care prezinta tremur sever, prevenind interferenta vizuala cu sarcinile motorii. Fiecare regula include perioade de racire pentru a preveni schimbarea excesiva a adaptarilor.',
              'Limitele maxime de aplicare asigura ca adaptarile nu escaleaza dincolo de limite utilizabile. Dimensiunea fontului este plafonata la 26 pixeli, padding-ul butoanelor la 36 pixeli, contrastul la nivelul WCAG AAA (raport 21:1), inaltimea liniei la 2.2, iar animatiile se dezactiveaza permanent odata declansate.',
            ],
          },
          {
            id: 'evaluation',
            heading: 'Evaluare si Rezultate Asteptate',
            paragraphs: [
              'Ipoteza principala prezice scoruri mai mari la Scala de Utilizabilitate a Sistemului in conditia adaptiva comparativ cu controlul. Masurile secundare includ timp redus de finalizare a sarcinilor, rate mai mici de eroare si evaluari scazute ale volumului de munca NASA-TLX.',
              'Analiza statistica foloseste teste Wilcoxon de rang cu semn, adecvate pentru designul intra-subiecti si dimensiunea mica a esantionului (n=12-15). Marimile efectului folosind d-ul lui Cohen completeaza testarea semnificatiei pentru a evalua importanta practica.',
              'Limitarile asteptate includ natura artificiala a sarcinilor de laborator, durata scurta a sesiunii fata de utilizarea in lumea reala si incapacitatea sistemelor bazate pe reguli de a distinge intre cauzele diferite ale tiparelor comportamentale similare. Acestea vor fi abordate candid in sectiunea de discutii.',
            ],
          },
        ],
      },
      {
        id: 'digital-accessibility',
        title: 'Istoria Accesibilitatii Digitale',
        sections: [
          {
            id: 'origins',
            heading: 'Originile Accesibilitatii Digitale',
            paragraphs: [
              'Istoria accesibilitatii digitale se intinde pana in primele zile ale informaticii, cand interfetele bazate pe text erau norma. Cititorii de ecran au aparut pentru prima data in anii 1980, traducand textul de pe ecran in vorbire sintetizata pentru utilizatorii cu deficiente de vedere.',
              'Adoptarea Actului Americanilor cu Dizabilitati in 1990 a marcat un punct de cotitura, stabilind cadre juridice care se vor extinde in cele din urma la spatiile digitale. Primele eforturi de accesibilitate web au fost in mare parte la nivel de baza, conduse de sustinatori care au recunoscut potentialul internetului de a include sau exclude.',
            ],
          },
          {
            id: 'standards',
            heading: 'Ghidurile de Accesibilitate a Continutului Web',
            paragraphs: [
              'Consor tiul World Wide Web a publicat primele Ghiduri de Accesibilitate a Continutului Web (WCAG 1.0) in 1999, stabilind 14 ghiduri organizate pe prioritate. WCAG 2.0 a urmat in 2008 cu un cadru mai testabil si agnostic tehnologic, construit in jurul a patru principii: Perceptibil, Operabil, Inteligibil si Robust.',
              'WCAG 2.1, lansat in 2018, a adaugat 17 noi criterii de succes care abordeaza accesibilitatea mobila, vederea slaba si dizabilitatile cognitive. Ghidurile au introdus cerinte pentru spatierea textului, redistribuirea continutului si dimensiunea tintei care informeaza direct designul interfetelor adaptive.',
              'Fiecare ghid include trei niveluri de conformitate: A (minim), AA (standard) si AAA (imbunatatit). Cele mai multe cerinte legale fac referire la conformitatea AA, care include rapoarte de contrast de 4.5:1 pentru text normal si 3:1 pentru text mare.',
            ],
          },
          {
            id: 'assistive-tech',
            heading: 'Evolutia Tehnologiei Asistive',
            paragraphs: [
              'Cititorii de ecran au evoluat de la motoare simple text-in-vorbire la instrumente sofisticate de navigare. Cititorii de ecran moderni precum JAWS, NVDA si VoiceOver interpreteaza HTML semantic, reperele ARIA si regiunile live pentru a oferi experiente interactive bogate utilizatorilor nevazatori si cu vedere slaba.',
              'Dispozitivele de acces prin comutator permit utilizatorilor cu deficiente motorii severe sa interactioneze cu computerele prin comutatoare simple sau duble. Sistemele de urmarire oculara s-au maturizat de la echipamente de laborator la produse de consum, deschizand noi modalitati de interactiune pentru utilizatorii cu control motor limitat.',
              'Software-ul de recunoastere vocala, exemplificat de Dragon NaturallySpeaking si dictarea integrata in sistemul de operare, permite operarea calculatorului fara maini. Aceste instrumente beneficiaza utilizatorii cu leziuni de efort repetitiv, dizabilitati motorii si accidentari temporare deopotriva.',
            ],
          },
          {
            id: 'legal-landscape',
            heading: 'Peisajul Legal si de Reglementare',
            paragraphs: [
              'Sectiunea 508 a Actului de Reabilitare din SUA cere agentiilor federale sa faca informatiile electronice accesibile. Actul European de Accesibilitate, in vigoare din 2025, impune accesibilitatea pentru o gama larga de produse si servicii in statele membre UE.',
              'Deciziile instantelor, in special Robles vs. Domino\'s Pizza (2019), au stabilit ca site-urile web si aplicatiile mobile intra sub incidenta Actului Americanilor cu Dizabilitati. Acest precedent a accelerat investitiile corporative in programele de accesibilitate.',
              'Corpul in crestere al legislatiei de accesibilitate la nivel mondial reflecta o trecere de la conformitatea voluntara la cerinte obligatorii, stimuland cererea de instrumente de testare automata, suprapuneri de accesibilitate si solutii de interfete adaptive.',
            ],
          },
          {
            id: 'future-directions',
            heading: 'Directii Viitoare in Accesibilitate',
            paragraphs: [
              'Invatarea automata ofera cai promitat oare pentru accesibilitate. Modelele de viziune computerizata pot genera descrieri de imagini, procesarea limbajului natural poate simplifica textul complex, iar modelele comportamentale pot prezice nevoile individuale de accesibilitate inainte ca utilizatorii sa solicite explicit adaptari.',
              'Conceptul de design inclusiv extinde principiile accesibilitatii pentru a beneficia toti utilizatorii, nu doar pe cei cu dizabilitati. Caracteristici proiectate initial pentru accesibilitate, precum rampele de bordura, subtitrarea si asistentii vocali, au devenit facilitati de uz comun.',
              'Tehnologiile emergente precum realitatea augmentata, interfetele creier-computer si sistemele de feedback haptic prezinta atat oportunitati, cat si provocari pentru accesibilitate. Asigurarea ca aceste tehnologii sunt accesibile de la inceput necesita colaborarea intre cercetatori, designeri si persoane cu dizabilitati.',
            ],
          },
        ],
      },
      {
        id: 'hci-methods',
        title: 'Metode de Interactiune Om-Calculator',
        sections: [
          {
            id: 'hci-foundations',
            heading: 'Fundamentele Cercetarii HCI',
            paragraphs: [
              'Interactiunea Om-Calculator a aparut ca un domeniu distinct la inceputul anilor 1980, adunand din psihologia cognitiva, informatica si design. Premisa fondatoare a domeniului este ca tehnologia ar trebui sa se adapteze capacitatilor si limitarilor umane, in loc sa ceara oamenilor sa se adapteze constrangerilor tehnologice.',
              'Cartea lui Card, Moran si Newell "Psihologia Interactiunii Om-Calculator" (1983) a stabilit modele fondatoare incluzand modelul la nivel de tastare si cadrul GOMS. Aceste modele predictive au permis designerilor sa estimeze timpii de finalizare a sarcinilor si sa identifice blocajele de interactiune inainte de implementare.',
            ],
          },
          {
            id: 'usability-testing',
            heading: 'Metode de Testare a Utilizabilitatii',
            paragraphs: [
              'Protocoalele de gandire cu voce tare, introduse de Ericsson si Simon (1980), raman o piatra de temelie a evaluarii utilizabilitatii. Participantii isi verbalizeaza procesele de gandire in timp ce completeaza sarcini, dezvaluind modele mentale, asteptari si puncte de confuzie pe care metricile cantitative singure nu le pot captura.',
              'Evaluarea euristica, formalizata de Nielsen si Molich (1990), ofera o metoda de inspectie rentabila. Evaluatorii analizeaza o interfata in raport cu principii de utilizabilitate stabilite, identificand probleme fara a necesita participanti utilizatori. Studiile arata ca 3-5 evaluatori gasesc de obicei 75% din problemele de utilizabilitate.',
              'Testarea A/B si experimentele controlate complementeaza metodele calitative furnizand dovezi statistice pentru deciziile de design. Designurile intra-subiecti, in care fiecare participant experimenteaza toate conditiile, maximizeaza puterea statistica cu esantioane mai mici, facandu-le ideale pentru mediile de cercetare academica.',
            ],
          },
          {
            id: 'measurement',
            heading: 'Masurarea Experientei Utilizatorului',
            paragraphs: [
              'Scala de Utilizabilitate a Sistemului, dezvoltata de Brooke (1996), ofera un chestionar fiabil cu 10 intrebari care produce scoruri de la 0 la 100. Simplitatea si fiabilitatea sa au facut-o cel mai utilizat chestionar standardizat de utilizabilitate, cu o baza de date de referinta care depaseste 10.000 de raspunsuri.',
              'NASA Task Load Index masoara sase dimensiuni ale volumului de munca: cerinta mentala, cerinta fizica, cerinta temporala, performanta, efortul si frustrarea. Dezvoltat initial pentru aplicatii aerospatiale, a fost adoptat pe scara larga in cercetarea HCI pentru a evalua costul cognitiv al interactiunilor cu interfata.',
              'Masurile fiziologice incluzand urmarirea oculara, raspunsul galvanic al pielii si analiza expresiilor faciale ofera indicatori obiectivi ai starii utilizatorului. Aceste masuri completeaza scalele auto-raportate prin captarea raspunsurilor inconstiente si a schimbarilor de la un moment la altul in implicare si frustrare.',
            ],
          },
          {
            id: 'interaction-models',
            heading: 'Modele si Paradigme de Interactiune',
            paragraphs: [
              'Legea lui Fitts, publicata in 1954, modeleaza timpul necesar pentru a indica o tinta ca functie a distantei si latimii tintei. Aceasta lege a fost validata pe dispozitive de intrare de la mouse la ecrane tactile si ramane fundamentala pentru optimizarea aspectului interfetei.',
              'Legea Hick-Hyman descrie relatia logaritmica intre numarul de optiuni si timpul de decizie. Acest principiu informeaza designul meniurilor, structura interfetelor de cautare si organizarea sistemelor de navigare pentru a minimiza supraincarcarea cognitiva.',
              'Modelul celor sapte etape ale actiunii al lui Norman descrie cum utilizatorii formeaza scopuri, le traduc in actiuni, executa acele actiuni si evalueaza rezultatele. Modelul identifica doua goluri cheie: golul de executie (maparea scopurilor la actiuni) si golul de evaluare (interpretarea feedback-ului sistemului).',
            ],
          },
          {
            id: 'modern-hci',
            heading: 'Provocari Moderne in HCI',
            paragraphs: [
              'Proliferarea dispozitivelor si factorilor de forma a facut designul responsive insuficient. Interfetele adaptive care raspund nu doar la dimensiunea ecranului, ci si la comportamentul utilizatorului, context si nivelul de abilitate reprezinta urmatoarea evolutie in designul personalizat al interactiunii.',
              'Preocuparile legate de confidentialitate in urmarirea comportamentala necesita o atenta considerare a minimizarii datelor, consimtamantului informat si limitarii scopului. Sistemele transparente care explica de ce apar adaptarile construiesc increderea utilizatorilor si respecta reglementari precum GDPR.',
              'Intersectia inteligentei artificiale si HCI ridica intrebari despre agentivitatea utilizatorului, prejudecata algoritmica si nivelul adecvat de autonomie a sistemului. Sistemele adaptive eficiente trebuie sa echilibreze asistenta proactiva cu controlul utilizatorului, evitand "factorul infricosator" care submineaza adoptia.',
            ],
          },
        ],
      },
    ],
  },

  taskData: {
    'adaptive-interfaces': [
      {
        id: 'ai-find',
        title: 'Gasiti Informatia',
        instruction:
          'In ce sectiune este discutata fereastra de timp glisanta pentru masurarea tremurului? Scrieti titlul sectiunii.',
      },
      {
        id: 'ai-form',
        title: 'Completati Formularul',
        instruction:
          'Pe baza articolului, completati urmatoarele detalii despre sistemul de adaptare.',
        fields: [
          { id: 'max_font', label: 'Dimensiunea maxima a fontului (px)' },
          { id: 'study_design', label: 'Tipul designului de studiu' },
          { id: 'sample_size', label: 'Dimensiunea tinta a esantionului' },
        ],
      },
      {
        id: 'ai-nav',
        title: 'Navigati si Interactionati',
        instruction:
          'Derulati la sectiunea "Evaluare si Rezultate Asteptate" si faceti click pe orice buton din zona de test interactiune.',
      },
    ],
    'digital-accessibility': [
      {
        id: 'da-find',
        title: 'Gasiti Informatia',
        instruction:
          'In ce sectiune este mentionat cazul Robles vs. Domino\'s Pizza? Scrieti titlul sectiunii.',
      },
      {
        id: 'da-form',
        title: 'Completati Formularul',
        instruction:
          'Pe baza articolului, completati urmatoarele detalii de accesibilitate.',
        fields: [
          { id: 'wcag_year', label: 'Anul publicarii WCAG 2.0' },
          { id: 'conformance', label: 'Nivelul de conformitate cel mai frecvent cerut' },
          { id: 'wcag21_criteria', label: 'Numarul de criterii noi in WCAG 2.1' },
        ],
      },
      {
        id: 'da-nav',
        title: 'Navigati si Interactionati',
        instruction:
          'Derulati la sectiunea "Directii Viitoare in Accesibilitate" si faceti click pe orice buton din zona de test interactiune.',
      },
    ],
    'hci-methods': [
      {
        id: 'hci-find',
        title: 'Gasiti Informatia',
        instruction:
          'In ce sectiune este discutata Legea Hick-Hyman? Scrieti titlul sectiunii.',
      },
      {
        id: 'hci-form',
        title: 'Completati Formularul',
        instruction:
          'Pe baza articolului, completati urmatoarele detalii HCI.',
        fields: [
          { id: 'sus_items', label: 'Numarul de intrebari din chestionarul SUS' },
          { id: 'nasa_dimensions', label: 'Numarul de dimensiuni NASA-TLX' },
          { id: 'evaluators', label: 'Evaluatori recomandati pentru evaluarea euristica (ex. "3-5")' },
        ],
      },
      {
        id: 'hci-nav',
        title: 'Navigati si Interactionati',
        instruction:
          'Derulati la sectiunea "Provocari Moderne in HCI" si faceti click pe orice buton din zona de test interactiune.',
      },
    ],
  },
};
