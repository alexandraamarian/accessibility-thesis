export const ro = {
  common: {
    loading: 'Se încarcă...',
    saving: 'Se salvează...',
    error: 'Eroare',
    submit: 'Trimite',
    continue: 'Continuă',
    back: 'Înapoi',
    close: 'Închide',
    yes: 'Da',
    no: 'Nu',
    on: 'Activat',
    off: 'Dezactivat',
    none: 'Niciunul',
    select: 'Selectează...',
    view: 'Vizualizează',
    refresh: 'Reîncarcă',
    enter: 'Intră',
    adaptive: 'Adaptiv',
    control: 'Control',
    complete: 'Finalizat',
    active: 'Activ',
    condition: 'Condiție',
    session: 'Sesiune',
    participant: 'Participant',
    exportCsv: 'Exportă CSV',
    language: 'Limbă',
  },

  study: {
    title: 'Studiu de Accesibilitate Adaptivă',
    steps: {
      consent: 'Consimțământ',
      demographics: 'Profil',
      warmup: 'Încălzire',
      tasks: 'Sarcini',
      sus: 'SUS',
      nasatlx: 'NASA-TLX',
      feedback: 'Feedback',
      summary: 'Rezumat',
    },
  },

  consent: {
    heading: 'Consimțământ și Configurare',
    participantInfo: 'Informații Participant',
    email: 'Adresă de Email',
    emailPlaceholder: 'ex., participant@exemplu.ro',
    informedConsent: 'Consimțământ Informat',
    consentText1:
      'Acest studiu investighează dacă adaptarea interfeței bazată pe comportament poate îmbunătăți utilizabilitatea. În timpul sesiunii, sistemul va colecta date despre interacțiunile dumneavoastră (click-uri, derulări, gesturi de zoom) pentru a evalua mecanismul de adaptare.',
    consentText2:
      'Participarea dumneavoastră este voluntară. Vă puteți retrage în orice moment fără consecințe. Email-ul dumneavoastră este folosit doar pentru a lega cele două sesiuni și nu este folosit în alte scopuri.',
    consentText3:
      'Sesiunea va dura aproximativ 15–20 de minute și include: o fază de încălzire, sarcini de citire și interacțiune, și două chestionare scurte.',
    consentCheckbox:
      'Am citit și înțeles informațiile de mai sus. Consimt să particip la acest studiu și la colectarea datelor despre interacțiunile mele.',
    errorNoEmail: 'Vă rugăm să introduceți adresa de email.',
    errorInvalidEmail: 'Vă rugăm să introduceți o adresă de email validă.',
    errorNoConsent: 'Vă rugăm să vă dați consimțământul pentru a continua.',
    errorDuplicateEmail:
      'Acest email a completat deja ambele sesiuni ale studiului. Fiecare participant poate participa de cel mult două ori (o dată pe condiție).',
    errorSessionFailed: 'Sesiunea nu a putut fi creată. Asigurați-vă că serverul este pornit.',
    creatingSession: 'Se creează sesiunea...',
    beginStudy: 'Începe Studiul',
  },

  demographics: {
    heading: 'Profilul Participantului',
    instructions:
      'Vă rugăm să furnizați câteva informații de fond. Acestea ne ajută să analizăm rezultatele în funcție de diferite grupuri de utilizatori.',
    ageRange: 'Grupa de Vârstă',
    gender: 'Gen',
    genderMale: 'Masculin',
    genderFemale: 'Feminin',
    genderPreferNot: 'Prefer să nu răspund',
    disability: 'Aveți vreo dizabilitate care afectează utilizarea calculatorului?',
    disabilityNone: 'Niciuna',
    disabilityVisual: 'Deficiență vizuală',
    disabilityMotor: 'Deficiență motorie',
    disabilityCognitive: 'Dizabilitate cognitivă',
    disabilityOther: 'Alta',
    assistiveTech: 'Folosiți tehnologie asistivă?',
    assistiveNone: 'Niciuna',
    assistiveScreenReader: 'Cititor de ecran',
    assistiveMagnifier: 'Lupă de ecran',
    assistiveVoice: 'Control vocal',
    assistiveOther: 'Alta',
    computerProficiency: 'Nivel de Competență Digitală',
    proficiencyBeginner: 'Începător',
    proficiencyIntermediate: 'Intermediar',
    proficiencyAdvanced: 'Avansat',
    proficiencyExpert: 'Expert',
    continue: 'Continuă la Încălzire',
    errorRequired: 'Vă rugăm completați toate câmpurile obligatorii.',
    errorSaveFailed: 'Nu s-au putut salva datele. Vă rugăm încercați din nou.',
  },

  warmup: {
    heading: 'Faza de Încălzire',
    timeRemaining: '{{time}}s rămase',
    readyToContinue: 'Sunt gata să continui',
    practiceHeading: 'Practică: Familiarizare',
    practiceText1:
      'Aceasta este o scurtă fază de încălzire pentru a vă ajuta să vă obișnuiți cu interfața. Nu ezitați să derulați, să faceți click pe butoane și să citiți textul de mai jos.',
    practiceText2:
      'Sistemul vă monitorizează acum interacțiunile. În condiția adaptivă, interfața se poate ajusta în funcție de tiparele comportamentului dumneavoastră. Acest lucru este normal și face parte din designul studiului.',
    instructions:
      'Aveți {{duration}} secunde să explorați interfața. Derulați prin conținut, faceți click pe butoane și încercați zoom-ul (Ctrl+Rotiță).',
    continueToTasks: 'Continuă la Sarcini',
    pleaseWait: 'Vă rugăm așteptați {{time}}s...',
  },

  tasks: {
    heading: 'Sarcina {{current}} din {{total}}',
    article: 'Articol: {{title}}',
    yourAnswer: 'Răspunsul Dumneavoastră',
    answerPlaceholder: 'Scrieți răspunsul aici...',
    navigationHint:
      'Derulați în jos pentru a găsi secțiunea menționată, apoi interacționați cu zona de test.',
    submitContinue: 'Trimite și Continuă',
    submitted: 'Trimis',
    errors: 'eroare/erori',
  },

  sus: {
    heading: 'Scala de Utilizabilitate a Sistemului (SUS)',
    instructions:
      'Vă rugăm să evaluați acordul dumneavoastră cu fiecare afirmație despre sistemul pe care tocmai l-ați folosit.',
    questions: [
      'Cred că mi-ar plăcea să folosesc acest sistem frecvent.',
      'Mi s-a părut că sistemul este inutil de complex.',
      'Am considerat că sistemul este ușor de utilizat.',
      'Cred că aș avea nevoie de ajutorul unei persoane tehnice pentru a putea folosi acest sistem.',
      'Consider că diversele funcții ale sistemului sunt bine integrate.',
      'Am considerat că există prea multă inconsistență în acest sistem.',
      'Cred că majoritatea oamenilor ar învăța să folosească acest sistem foarte repede.',
      'Am găsit sistemul foarte greu de utilizat.',
      'M-am simțit foarte încrezător folosind sistemul.',
      'A trebuit să învăț multe lucruri înainte de a putea folosi acest sistem.',
    ],
    likert: ['Total Dezacord', 'Dezacord', 'Neutru', 'Acord', 'Total Acord'],
    errorUnanswered: 'Vă rugăm să răspundeți la întrebarea {{n}}.',
    errorSaveFailed: 'Nu s-au putut salva răspunsurile. Vă rugăm încercați din nou.',
    continueToNasaTlx: 'Continuă la NASA-TLX',
  },

  nasatlx: {
    heading: 'NASA Task Load Index (NASA-TLX)',
    instructions:
      'Evaluați fiecare dimensiune pe o scară de la 0 (scăzut) la 100 (ridicat). Trageți cursorul pentru a indica evaluarea.',
    dimensions: {
      mental: {
        label: 'Cerință Mentală',
        description: 'Cât de solicitantă mental a fost sarcina?',
        lowEnd: 'Foarte Scăzută',
        highEnd: 'Foarte Ridicată',
      },
      physical: {
        label: 'Cerință Fizică',
        description: 'Cât de solicitantă fizic a fost sarcina?',
        lowEnd: 'Foarte Scăzută',
        highEnd: 'Foarte Ridicată',
      },
      temporal: {
        label: 'Cerință Temporală',
        description: 'Cât de mult v-ați simțit presat de timp în realizarea sarcinii?',
        lowEnd: 'Foarte Scăzută',
        highEnd: 'Foarte Ridicată',
      },
      performance: {
        label: 'Performanță',
        description: 'Cât de bine considerați că ați îndeplinit ceea ce vi s-a cerut?',
        lowEnd: 'Eșec',
        highEnd: 'Perfect',
      },
      effort: {
        label: 'Efort',
        description:
          'Cât de mult a trebuit să vă străduiți pentru a atinge acest nivel de performanță?',
        lowEnd: 'Foarte Scăzut',
        highEnd: 'Foarte Ridicat',
      },
      frustration: {
        label: 'Frustrare',
        description: 'Cât de frustrat, descurajat, iritat sau stresat v-ați simțit?',
        lowEnd: 'Foarte Scăzută',
        highEnd: 'Foarte Ridicată',
      },
    },
    errorUnanswered: 'Vă rugăm să evaluați „{{dimension}}".',
    errorSaveFailed: 'Nu s-au putut salva răspunsurile. Vă rugăm încercați din nou.',
    continueToSummary: 'Continuă la Feedback',
  },

  feedback: {
    heading: 'Experiența Dumneavoastră',
    instructions: 'O ultimă întrebare înainte de final. Nu există răspunsuri corecte sau greșite.',
    question: 'Ați observat vreo schimbare în interfață? Dacă da, cum v-ați simțit în legătură cu aceste schimbări?',
    placeholder: 'Scrieți gândurile dumneavoastră aici... (opțional)',
    continue: 'Continuă la Rezumat',
  },

  summary: {
    heading: 'Vă Mulțumim!',
    description:
      'Sesiunea dumneavoastră s-a încheiat. Iată un rezumat al participării.',
    condition: 'Condiție',
    tasksCompleted: 'Sarcini Finalizate',
    totalTaskTime: 'Timp Total Sarcini',
    totalErrors: 'Erori Totale',
    questionnaireScores: 'Scoruri Chestionare',
    susScore: 'Scor SUS',
    nasaTlxAvg: 'Media NASA-TLX',
    sessionInfo: 'ID Sesiune: {{sessionId}} | Participant: {{participantId}}',
    nextSessionPrompt: 'Ați finalizat prima condiție. Puteți continua acum cu a doua condiție pentru a finaliza studiul.',
    startNextSession: 'Începe A Doua Sesiune',
    closeMessage:
      'Puteți închide această fereastră sau îl puteți notifica pe cercetător.',
  },

  interactionZone: {
    heading: 'Zona de Test',
    instructions:
      'Faceți click pe butoanele de mai jos pentru a testa acuratețea atingerii. Sistemul va detecta atingerile ratate (click-uri în afara butoanelor) și poate mări butoanele dacă este necesar.',
    button: 'Buton {{id}}',
    totalClicks: 'Total click-uri:',
    btnCount: 'Btn {{id}}: {{count}}',
  },

  monitor: {
    debugPanel: 'Monitor',
    title: 'Monitor Adaptare',
    session: 'Sesiune:',
    signals: 'Semnale:',
    uiState: 'Stare Interfață:',
    adaptations: 'Adaptări:',
    noAdaptations: 'Nicio adaptare declanșată încă',
    font: 'Font: {{value}}px',
    padding: 'Padding: {{value}}px',
    contrast: 'Contrast: L{{value}}',
    lineHeight: 'Înălțime linie: {{value}}',
    anim: 'Anim: {{value}}',
    cursor: 'Cursor: {{value}}x',
    simplified: 'Simplificat: {{value}}',
    readGuide: 'Ghid citire: {{value}}',
    taps: 'Atingeri: {{taps}} | Derulări: {{scrolls}}',
    updated: 'Actualizat: {{time}}',
    signalLabels: {
      zoom: 'Nr. Zoom-uri',
      missRate: 'Atingeri Ratate',
      dwell: 'Timp Citire Secțiune',
      scrollRev: 'Recitire (derulare sus)',
      tremor: 'Tremur Cursor',
      rageClick: 'Click-uri Repetate',
      hesitation: 'Ezitare pe Butoane',
      idle: 'Timp Inactiv',
      readSpd: 'Viteză de Citire',
    },
  },

  dashboard: {
    title: 'Panou Cercetător',
    enterPassphrase: 'Introduceți parola',
    sessions: 'Sesiuni',
    compare: 'Compară',
    summary: 'Rezumat',
    sessionList: {
      heading: 'Sesiuni ({{count}})',
      filterPlaceholder: 'Filtrează după email participant...',
      allConditions: 'Toate condițiile',
      participant: 'Participant',
      condition: 'Condiție',
      started: 'Început',
      sus: 'SUS',
      nasaTlx: 'NASA-TLX',
      status: 'Status',
      noSessions: 'Nu s-au găsit sesiuni.',
    },
    sessionDetail: {
      backToSessions: 'Înapoi la sesiuni',
      sessionHeading: 'Sesiune: {{participant}} ({{condition}})',
      started: 'Început',
      duration: 'Durată',
      susScore: 'Scor SUS',
      adaptations: 'Adaptări',
      nasaTlxScores: 'Scoruri NASA-TLX',
      signalHistory: 'Istoric Semnale ({{count}} instantanee)',
      adaptationEvents: 'Evenimente Adaptare',
      rule: 'Regulă',
      time: 'Timp',
      taskMetrics: 'Metrici Sarcini',
      task: 'Sarcină',
      taskType: 'Tip',
      completed: 'Gata',
      taskTypes: {
        findAnswer: 'Găsire Răspuns',
        formCompletion: 'Formular',
        navigation: 'Navigare',
      },
      errors: 'Erori',
      answer: 'Răspuns',
      loadingSession: 'Se încarcă datele sesiunii...',
      sessionNotFound: 'Sesiunea nu a fost găsită.',
      signalLabels: {
        zoomCount: 'Număr Zoom-uri',
        missedTapRate: 'Rată Atingeri Ratate',
        avgDwellSeconds: 'Timp Citire Secțiune',
        scrollReversalRate: 'Rată Recitire',
        tremorScore: 'Tremur Cursor',
        rageClickCount: 'Click-uri Repetate',
        mouseHesitationScore: 'Ezitare pe Butoane',
        idleSeconds: 'Timp Inactiv',
        readingSpeed: 'Viteză de Citire',
      },
      signalTooltips: {
        zoomCount: 'Numărul de evenimente Ctrl+Scroll sau zoom cu degetele în ultimele 60s. Valorile mari sugerează că utilizatorul are dificultăți în a citi textul la dimensiunea curentă.',
        missedTapRate: 'Raportul click-urilor care au ratat elementele interactive (butoane, link-uri) vs. total click-uri în apropierea lor în ultimele 30s. Valorile mari sugerează dificultăți motorii.',
        avgDwellSeconds: 'Timpul mediu (secunde) cât fiecare secțiune de articol a rămas vizibilă în viewport în ultimele 90s. Valorile mari sugerează citire lentă sau dificultăți.',
        scrollReversalRate: 'Fracțiunea schimbărilor de direcție la derulare care merg în sus (recitire) în ultimele 45s. Valorile mari sugerează dificultăți de înțelegere.',
        tremorScore: 'Deviația standard (px) a pozițiilor click-urilor în ultimele 8s. Măsoară precizia indicării — valorile mari indică tremur sau dificultăți motorii.',
        rageClickCount: 'Grupuri de 3+ click-uri rapide în aceeași zonă în ultimele 5s. Indică frustrare cu elemente care nu răspund sau greu de apăsat.',
        mouseHesitationScore: 'De câte ori cursorul a staționat 3+ secunde pe un element interactiv în ultimele 10s. Sugerează incertitudine sau dificultăți de decizie.',
        idleSeconds: 'Secunde de la ultima interacțiune (mouse, tastatură sau derulare). Valorile mari înseamnă că utilizatorul a încetat să interacționeze.',
        readingSpeed: 'Estimare de cuvinte pe minut bazată pe timpul de vizibilitate al secțiunilor și numărul de caractere în ultimele 90s. Valorile scăzute pot indica dificultăți de citire.',
      },
    },
    comparison: {
      heading: 'Comparație Condiții',
      noParticipants:
        'Nu s-au găsit participanți cu ambele sesiuni (adaptiv și control). Fiecare participant are nevoie de două sesiuni (câte una pe condiție) pentru comparație.',
      selectParticipant: 'Selectați Participant',
      adaptive: 'Adaptiv',
      control: 'Control',
      delta: 'Delta (Adaptiv – Control)',
    },
    summaryStats: {
      heading: 'Statistici Generale',
      totalSessions: 'Total Sesiuni',
      completed: 'Finalizate',
      meanSusByCondition: 'Scor SUS Mediu pe Condiție',
      noSusScores: 'Niciun scor SUS înregistrat încă.',
      nasaTlxByDimension: 'NASA-TLX pe Dimensiune',
      noNasaTlxData: 'Nicio dată NASA-TLX înregistrată încă.',
    },
  },

  rawView: {
    initializingSession: 'Se inițializează sesiunea...',
    title: 'Sistem de Accesibilitate Adaptivă (Vizualizare Brută)',
    condition: 'Condiție: ',
    session: 'Sesiune: ',
  },

  articles: {
    sets: [
      {
        id: 'climate-technology',
        title: 'Schimbările Climatice și Tehnologia',
        sections: [
          {
            id: 'intro',
            heading: 'Peisajul Tehnologiei Climatice',
            paragraphs: [
              'Intersecția dintre știința climatică și tehnologie a produs unele dintre cele mai importante inovații ale secolului XXI. De la sisteme de monitorizare prin satelit care urmăresc defrișarea în timp real, până la modele de învățare automată care optimizează amplasarea turbinelor eoliene, tehnologia redefinește modul în care omenirea răspunde provocărilor de mediu.',
              'Concentrațiile globale de dioxid de carbon au depășit 420 de părți pe milion în 2024, un nivel care nu a mai fost atins de cel puțin 800.000 de ani, conform înregistrărilor din carotele de gheață. Urgența acestei traiectorii a accelerat investițiile în tehnologia climatică, cheltuielile globale pentru energie curată ajungând la 1,8 trilioane de dolari în 2023, depășind pentru prima dată investițiile în combustibili fosili.',
            ],
          },
          {
            id: 'renewable-energy',
            heading: 'Sisteme de Energie Regenerabilă',
            paragraphs: [
              'Tehnologia fotovoltaică solară a cunoscut o reducere dramatică a costurilor de peste 90% din 2010, devenind cea mai ieftină sursă de generare a energiei electrice noi pe majoritatea piețelor din lume. Panourile solare moderne ating eficiențe de conversie de peste 22% pentru modulele comerciale, în timp ce celulele de laborator au depășit 47% folosind designuri cu concentrator multi-joncțiune.',
              'Energia eoliană a urmat o traiectorie similară. Turbinele eoliene offshore ating acum înălțimi de peste 260 de metri cu capacități individuale de 15 megawați, suficiente pentru a alimenta aproximativ 13.000 de locuințe fiecare. Consiliul Global pentru Energie Eoliană a raportat 117 gigawați de capacitate nouă instalată doar în 2023.',
              'Tehnologia de stocare a energiei în baterii, în special celulele litiu-ion, a înregistrat o scădere a costurilor de 97% din 1991. Proiectele de stocare la scară de rețea depășesc acum în mod regulat 100 de megawatt-ore, abordând provocarea intermitenței care a limitat istoric adoptarea energiei regenerabile. Alternativele emergente, inclusiv bateriile sodiu-ion, solid-state și fier-aer, promit îmbunătățiri suplimentare.',
            ],
          },
          {
            id: 'carbon-capture',
            heading: 'Captarea și Eliminarea Carbonului',
            paragraphs: [
              'Tehnologia de captare directă din aer (DAC) extrage dioxidul de carbon direct din aerul ambiental folosind sorbenți sau solvenți chimici. Instalația Orca din Islanda, operată de Climeworks, captează aproximativ 4.000 de tone de CO2 anual, stocându-l sub formă de carbonați minerali adânc în subteran printr-un proces numit mineralizare.',
              'Abordările de eliminare a carbonului bazate pe natură includ reîmpădurirea, sechestrarea carbonului în sol și creșterea alcalinității oceanelor. O pădure tropicală matură poate sechestra între 6 și 30 de tone de CO2 pe hectar pe an, deși provocările legate de permanență și măsurare complică includerea lor pe piețele de credite de carbon.',
              'Grupul Interguvernamental privind Schimbările Climatice (IPCC) estimează că limitarea încălzirii la 1,5 grade Celsius va necesita eliminarea a 6 până la 10 gigatone de CO2 pe an până în 2050. Capacitatea actuală de eliminare este de aproximativ 2 gigatone anual, aproape în totalitate din silvicultură convențională și gestionarea terenurilor.',
            ],
          },
          {
            id: 'smart-cities',
            heading: 'Orașe Inteligente și Sustenabilitate Urbană',
            paragraphs: [
              'Sistemele inteligente de clădiri care utilizează senzori IoT și controale bazate pe inteligență artificială pot reduce consumul de energie cu 20 până la 30 de procente comparativ cu clădirile convenționale. Copenhaga își propune să devină prima capitală neutră din punct de vedere al carbonului până în 2025, implementând rețele de senzori pentru optimizarea traficului, colectarea deșeurilor și încălzirea centralizată.',
              'Adoptarea vehiculelor electrice s-a accelerat puternic în 2023, cu vânzări globale care au depășit 14 milioane de unități, reprezentând 18% din totalul vânzărilor de mașini noi. China a condus cu 8,1 milioane de unități, urmată de Europa cu 3,2 milioane. Agenția Internațională a Energiei proiectează că vehiculele electrice vor reprezenta peste 60% din vânzările noi la nivel global până în 2030.',
              'Insulele urbane de căldură, unde orașele înregistrează temperaturi cu 3 până la 5 grade Celsius mai mari decât zonele rurale înconjurătoare, reprezintă o provocare tot mai mare pe măsură ce schimbările climatice se intensifică. Instalațiile de acoperișuri verzi, materialele de construcție reflectorizante și extinderea coronamentului arborilor urbani sunt printre strategiile pe care orașele le implementează pentru a atenua acest efect.',
            ],
          },
          {
            id: 'future-outlook',
            heading: 'Perspective și Provocări Viitoare',
            paragraphs: [
              'Cercetarea fuziunii nucleare a atins un reper în decembrie 2022 când Facilitatea Națională de Igniție a realizat câștig net de energie pentru prima dată. Deși energia comercială din fuziune rămâne la decenii distanță, investițiile private în startup-uri de fuziune au depășit 6 miliarde de dolari până în 2024, reflectând un optimism crescând cu privire la această tehnologie.',
              'Lanțul de aprovizionare cu minerale critice prezintă un blocaj semnificativ pentru tranziția către energie curată. Cererea de litiu este proiectată să crească de 40 de ori până în 2040, în timp ce cobaltul, nichelul și elementele pământurilor rare se confruntă cu presiuni similare. Infrastructura de reciclare și chimiile alternative ale bateriilor sunt esențiale pentru a evita simpla înlocuire a unei dependențe de resurse cu alta.',
              'Tehnologia de adaptare climatică, inclusiv sistemele de avertizare timpurie, varietățile de culturi rezistente la secetă și infrastructura de apărare costieră, primește mult mai puține fonduri decât atenuarea, în ciuda realității că o încălzire semnificativă este deja inevitabilă. Națiunile Unite estimează că țările în curs de dezvoltare singure vor avea nevoie de 300 de miliarde de dolari anual pentru adaptare până în 2030.',
            ],
          },
        ],
      },
      {
        id: 'digital-accessibility',
        title: 'Istoria Accesibilității Digitale',
        sections: [
          {
            id: 'origins',
            heading: 'Originile Accesibilității Digitale',
            paragraphs: [
              'Istoria accesibilității digitale se întinde până în primele zile ale informaticii, când interfețele bazate pe text erau norma. Cititoarele de ecran au apărut pentru prima dată în anii 1980, traducând textul de pe ecran în vorbire sintetizată pentru utilizatorii cu deficiențe de vedere.',
              'Adoptarea Actului Americanilor cu Dizabilități în 1990 a reprezentat un moment de cotitură, stabilind cadre juridice care se vor extinde în cele din urmă la spațiile digitale. Primele eforturi de accesibilitate web au fost în mare parte comunitare, conduse de activiști care au recunoscut potențialul internetului de a include sau exclude.',
            ],
          },
          {
            id: 'standards',
            heading: 'Ghidurile de Accesibilitate a Conținutului Web',
            paragraphs: [
              'Consorțiul World Wide Web a publicat primele Ghiduri de Accesibilitate a Conținutului Web (WCAG 1.0) în 1999, stabilind 14 ghiduri organizate pe prioritate. WCAG 2.0 a urmat în 2008 cu un cadru mai testabil și agnostic tehnologic, construit în jurul a patru principii: Perceptibil, Operabil, Inteligibil și Robust.',
              'WCAG 2.1, lansat în 2018, a adăugat 17 noi criterii de succes care abordează accesibilitatea mobilă, vederea slabă și dizabilitățile cognitive. Ghidurile au introdus cerințe pentru spațierea textului, redistribuirea conținutului și dimensiunea țintei care informează direct designul interfețelor adaptive.',
              'Fiecare ghid include trei niveluri de conformitate: A (minim), AA (standard) și AAA (îmbunătățit). Cele mai multe cerințe legale fac referire la conformitatea AA, care include rapoarte de contrast de 4,5:1 pentru text normal și 3:1 pentru text mare.',
            ],
          },
          {
            id: 'assistive-tech',
            heading: 'Evoluția Tehnologiei Asistive',
            paragraphs: [
              'Cititoarele de ecran au evoluat de la motoare simple text-în-vorbire la instrumente sofisticate de navigare. Cititoarele de ecran moderne precum JAWS, NVDA și VoiceOver interpretează HTML semantic, reperele ARIA și regiunile live pentru a oferi experiențe interactive bogate utilizatorilor nevăzători și cu vedere slabă.',
              'Dispozitivele de acces prin comutator permit utilizatorilor cu deficiențe motorii severe să interacționeze cu calculatoarele prin comutatoare simple sau duble. Sistemele de urmărire oculară s-au maturizat de la echipamente de laborator la produse de consum, oferind noi modalități de interacțiune pentru utilizatorii cu control motor limitat.',
              'Software-ul de recunoaștere vocală, exemplificat de Dragon NaturallySpeaking și dictarea integrată în sistemul de operare, permite operarea calculatorului fără mâini. Aceste instrumente beneficiază utilizatorii cu leziuni de efort repetitiv, dizabilități motorii și accidentări temporare deopotrivă.',
            ],
          },
          {
            id: 'legal-landscape',
            heading: 'Peisajul Legal și de Reglementare',
            paragraphs: [
              'Secțiunea 508 a Actului de Reabilitare din SUA cere agențiilor federale să facă informațiile electronice accesibile. Actul European de Accesibilitate, în vigoare din 2025, impune accesibilitatea pentru o gamă largă de produse și servicii în statele membre UE.',
              "Deciziile instanțelor, în special Robles vs. Domino's Pizza (2019), au stabilit că site-urile web și aplicațiile mobile intră sub incidența Actului Americanilor cu Dizabilități. Acest precedent a accelerat investițiile corporative în programele de accesibilitate.",
              'Numărul tot mai mare de legi de accesibilitate la nivel mondial reflectă trecerea de la respectarea voluntară la cerințe obligatorii, crescând cererea pentru instrumente de testare automată, suprapuneri de accesibilitate și soluții de interfețe adaptive.',
            ],
          },
          {
            id: 'future-directions',
            heading: 'Direcții Viitoare în Accesibilitate',
            paragraphs: [
              'Învățarea automată oferă căi promițătoare pentru accesibilitate. Modelele de viziune computerizată pot genera descrieri de imagini, procesarea limbajului natural poate simplifica textul complex, iar modelele comportamentale pot prezice nevoile individuale de accesibilitate înainte ca utilizatorii să solicite explicit adaptări.',
              'Conceptul de design inclusiv extinde principiile accesibilității pentru a beneficia toți utilizatorii, nu doar pe cei cu dizabilități. Caracteristici proiectate inițial pentru accesibilitate, precum rampele de acces, subtitrarea și asistenții vocali, au devenit funcționalități folosite de toată lumea.',
              'Tehnologiile emergente precum realitatea augmentată, interfețele creier-calculator și sistemele de feedback haptic prezintă atât oportunități, cât și provocări pentru accesibilitate. Asigurarea că aceste tehnologii sunt accesibile de la început necesită colaborarea între cercetători, designeri și persoane cu dizabilități.',
            ],
          },
        ],
      },
      {
        id: 'hci-methods',
        title: 'Metode de Interacțiune Om-Calculator',
        sections: [
          {
            id: 'hci-foundations',
            heading: 'Fundamentele Cercetării HCI',
            paragraphs: [
              'Interacțiunea Om-Calculator a apărut ca un domeniu distinct la începutul anilor 1980, reunind cunoștințe din psihologia cognitivă, informatică și design. Premisa fondatoare a domeniului este că tehnologia ar trebui să se adapteze capacităților și limitărilor umane, nu oamenii să se adapteze limitărilor tehnologice.',
              'Cartea lui Card, Moran și Newell „Psihologia Interacțiunii Om-Calculator" (1983) a stabilit modele fondatoare incluzând modelul la nivel de tastare și cadrul GOMS. Aceste modele predictive au permis designerilor să estimeze timpii de finalizare a sarcinilor și să identifice blocajele de interacțiune înainte de implementare.',
            ],
          },
          {
            id: 'usability-testing',
            heading: 'Metode de Testare a Utilizabilității',
            paragraphs: [
              'Protocoalele de gândire cu voce tare, introduse de Ericsson și Simon (1980), rămân o piatră de temelie a evaluării utilizabilității. Participanții își verbalizează procesele de gândire în timp ce completează sarcini, dezvăluind modele mentale, așteptări și puncte de confuzie pe care metricile cantitative singure nu le pot captura.',
              'Evaluarea euristică, formalizată de Nielsen și Molich (1990), oferă o metodă de inspecție eficientă din punct de vedere al costurilor. Evaluatorii analizează o interfață în raport cu principii de utilizabilitate stabilite, identificând probleme fără a necesita participanți utilizatori. Studiile arată că 3–5 evaluatori găsesc de obicei 75% din problemele de utilizabilitate.',
              'Testarea A/B și experimentele controlate complementează metodele calitative furnizând dovezi statistice pentru deciziile de design. Designurile intra-subiecți, în care fiecare participant experimentează toate condițiile, maximizează puterea statistică cu eșantioane mai mici, fiind astfel potrivite pentru cercetarea academică.',
            ],
          },
          {
            id: 'measurement',
            heading: 'Măsurarea Experienței Utilizatorului',
            paragraphs: [
              'Scala de Utilizabilitate a Sistemului, dezvoltată de Brooke (1996), oferă un chestionar fiabil cu 10 întrebări care produce scoruri de la 0 la 100. Simplitatea și fiabilitatea sa au făcut-o cel mai utilizat chestionar standardizat de utilizabilitate, cu o bază de date de referință care depășește 10.000 de răspunsuri.',
              'NASA Task Load Index măsoară șase dimensiuni ale volumului de muncă: cerința mentală, cerința fizică, cerința temporală, performanța, efortul și frustrarea. Dezvoltat inițial pentru aplicații aerospațiale, a fost adoptat pe larg în cercetarea HCI pentru a evalua costul cognitiv al interacțiunilor cu interfața.',
              'Măsurile fiziologice incluzând urmărirea oculară, răspunsul galvanic al pielii și analiza expresiilor faciale oferă indicatori obiectivi ai stării utilizatorului. Aceste măsuri completează scalele auto-raportate prin captarea răspunsurilor inconștiente și a schimbărilor de la un moment la altul în implicare și frustrare.',
            ],
          },
          {
            id: 'interaction-models',
            heading: 'Modele și Paradigme de Interacțiune',
            paragraphs: [
              'Legea lui Fitts, publicată în 1954, modelează timpul necesar pentru a indica o țintă ca funcție a distanței și lățimii țintei. Această lege a fost validată pe dispozitive de intrare de la mouse la ecrane tactile și rămâne fundamentală pentru optimizarea aspectului interfeței.',
              'Legea Hick-Hyman descrie relația logaritmică între numărul de opțiuni și timpul de decizie. Acest principiu informează designul meniurilor, structura interfețelor de căutare și organizarea sistemelor de navigare pentru a minimiza supraîncărcarea cognitivă.',
              'Modelul celor șapte etape ale acțiunii al lui Norman descrie cum utilizatorii formează scopuri, le traduc în acțiuni, execută acele acțiuni și evaluează rezultatele. Modelul identifică două goluri cheie: golul de execuție (maparea scopurilor la acțiuni) și golul de evaluare (interpretarea feedback-ului sistemului).',
            ],
          },
          {
            id: 'modern-hci',
            heading: 'Provocări Moderne în HCI',
            paragraphs: [
              'Multitudinea de dispozitive și formate de ecran a făcut ca designul responsive să nu mai fie suficient. Interfețele adaptive care răspund nu doar la dimensiunea ecranului, ci și la comportamentul utilizatorului, context și nivelul de abilitate reprezintă următoarea evoluție în designul personalizat al interacțiunii.',
              'Preocupările legate de confidențialitate în urmărirea comportamentală necesită atenție sporită la minimizarea datelor, consimțământului informat și limitării scopului. Sistemele transparente care explică de ce apar adaptările construiesc încrederea utilizatorilor și respectă reglementări precum GDPR.',
              'Intersecția inteligenței artificiale și HCI ridică întrebări despre agentivitatea utilizatorului, prejudecata algoritmică și nivelul adecvat de autonomie a sistemului. Sistemele adaptive eficiente trebuie să echilibreze asistența proactivă cu controlul utilizatorului, evitând senzația de disconfort care descurajează adopția.',
            ],
          },
        ],
      },
    ],
  },

  taskData: {
    'climate-technology': [
      {
        id: 'ct-find',
        title: 'Găsiți Informația',
        instruction:
          'În ce secțiune este discutată instalația Orca din Islanda? Scrieți titlul secțiunii.',
      },
      {
        id: 'ct-form',
        title: 'Completați Formularul',
        instruction:
          'Pe baza articolului, completați următoarele detalii despre tehnologia climatică.',
        fields: [
          { id: 'solar_reduction', label: 'Reducerea costurilor fotovoltaice solare din 2010 (%)' },
          { id: 'ev_sales', label: 'Vânzări globale de vehicule electrice în 2023 (milioane)' },
          {
            id: 'co2_removal',
            label: 'Eliminarea CO2 necesară până în 2050 (gigatone/an, ex. „6-10")',
          },
        ],
      },
      {
        id: 'ct-nav',
        title: 'Navigați și Interacționați',
        instruction:
          'Derulați la secțiunea „Perspective și Provocări Viitoare" și faceți click pe orice buton din zona de test.',
      },
    ],
    'digital-accessibility': [
      {
        id: 'da-find',
        title: 'Găsiți Informația',
        instruction:
          "În ce secțiune este menționat cazul Robles vs. Domino's Pizza? Scrieți titlul secțiunii.",
      },
      {
        id: 'da-form',
        title: 'Completați Formularul',
        instruction:
          'Pe baza articolului, completați următoarele detalii de accesibilitate.',
        fields: [
          { id: 'wcag_year', label: 'Anul publicării WCAG 2.0' },
          { id: 'conformance', label: 'Nivelul de conformitate cel mai frecvent cerut' },
          { id: 'wcag21_criteria', label: 'Numărul de criterii noi în WCAG 2.1' },
        ],
      },
      {
        id: 'da-nav',
        title: 'Navigați și Interacționați',
        instruction:
          'Derulați la secțiunea „Direcții Viitoare în Accesibilitate" și faceți click pe orice buton din zona de test.',
      },
    ],
    'hci-methods': [
      {
        id: 'hci-find',
        title: 'Găsiți Informația',
        instruction:
          'În ce secțiune este discutată Legea Hick-Hyman? Scrieți titlul secțiunii.',
      },
      {
        id: 'hci-form',
        title: 'Completați Formularul',
        instruction: 'Pe baza articolului, completați următoarele detalii HCI.',
        fields: [
          { id: 'sus_items', label: 'Numărul de întrebări din chestionarul SUS' },
          { id: 'nasa_dimensions', label: 'Numărul de dimensiuni NASA-TLX' },
          {
            id: 'evaluators',
            label: 'Evaluatori recomandați pentru evaluarea euristică (ex. „3-5")',
          },
        ],
      },
      {
        id: 'hci-nav',
        title: 'Navigați și Interacționați',
        instruction:
          'Derulați la secțiunea „Provocări Moderne în HCI" și faceți click pe orice buton din zona de test.',
      },
    ],
  },
};
