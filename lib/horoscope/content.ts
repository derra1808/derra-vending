import type { ZodiacSign, CoreNumber, Element } from "./types";

export const ZODIAC_PROFILES: Record<
  ZodiacSign,
  {
    essence: string;
    strengths: string[];
    shadows: string[];
    love: string;
    career: string;
    pastTheme: string;
    presentTheme: string;
    futureTheme: string;
  }
> = {
  belier: {
    essence: "Pionnier du zodiaque, le Bélier incarne l'élan vital, le courage et l'audace. Gouverné par Mars, il avance tête baissée, transformant chaque obstacle en tremplin.",
    strengths: ["Leadership naturel", "Énergie débordante", "Franchise rafraîchissante", "Capacité d'initiative"],
    shadows: ["Impulsivité", "Impatience", "Colères soudaines", "Difficulté à terminer"],
    love: "Passionné et direct, vous aimez conquérir et protéger. Vous recherchez un partenaire qui stimule votre feu sans l'étouffer.",
    career: "Entrepreneur, sportif, chef de projet, pompier, chirurgien — tout métier exigeant action et décision rapide.",
    pastTheme: "Vos premières années ont été marquées par des défis qui ont forgé votre indépendance. Vous avez appris très tôt à vous battre pour votre place.",
    presentTheme: "Une période d'affirmation personnelle s'ouvre. Mars vous pousse à prendre des initiatives audacieuses et à revendiquer votre territoire.",
    futureTheme: "Votre feu intérieur vous mènera vers des rôles de leader. Les prochaines années récompenseront votre audace et votre capacité à ouvrir de nouvelles voies.",
  },
  taureau: {
    essence: "Stable et sensuel, le Taureau cherche la sécurité, la beauté et le confort. Sous l'influence de Vénus, il construit patiemment un monde durable.",
    strengths: ["Fiabilité", "Patience", "Sens esthétique", "Loyauté profonde"],
    shadows: ["Entêtement", "Possessivité", "Résistance au changement", "Attachement matériel"],
    love: "Vous aimez avec constance et sensualité. La fidélité et la stabilité sont essentielles ; vous construisez l'amour comme un jardin.",
    career: "Finance, immobilier, gastronomie, arts, agriculture, design — tout ce qui crée de la valeur tangible et durable.",
    pastTheme: "L'enfance a pu alterner entre confort et insécurité matérielle, vous enseignant la valeur du travail et de l'épargne.",
    presentTheme: "Vénus favorise la consolidation : patrimoine, relations stables, projets créatifs qui prennent forme lentement mais sûrement.",
    futureTheme: "Votre persévérance portera ses fruits. Dans les années à venir, vous jouirez de la sécurité que vous avez patiemment bâtie.",
  },
  gemeaux: {
    essence: "Curieux et polyvalent, le Gémeaux est le messager du zodiaque. Mercure lui confère une intelligence vive, un humour pétillant et une soif insatiable de connexions.",
    strengths: ["Adaptabilité", "Éloquence", "Curiosité intellectuelle", "Polyvalence"],
    shadows: ["Dispersion", "Superficialité", "Nervosité", "Indécision"],
    love: "Vous avez besoin de stimulation mentale autant que physique. L'ennui est votre pire ennemi ; vous cherchez un partenaire complice et spirituel.",
    career: "Journalisme, enseignement, commerce, traduction, marketing digital, relations publiques.",
    pastTheme: "Une jeunesse mouvementée, peut-être marquée par des déménagements ou une double culture, a développé votre adaptabilité remarquable.",
    presentTheme: "Mercure active votre réseau. Communications, voyages courts, formations et projets multiples s'accélèrent.",
    futureTheme: "Votre capacité à relier les idées et les personnes fera de vous un acteur central dans un monde de plus en plus connecté.",
  },
  cancer: {
    essence: "Protecteur et intuitif, le Cancer est le gardien des émotions et de la mémoire. La Lune lui confère une sensibilité profonde et un instinct maternel/paternel puissant.",
    strengths: ["Empathie", "Intuition", "Loyauté familiale", "Mémoire émotionnelle"],
    shadows: ["Hypersensibilité", "Retrait", "Attachement au passé", "Humeurs changeantes"],
    love: "Vous cherchez la fusion émotionnelle et un foyer sécurisant. L'amour se vit dans la tendresse quotidienne et la protection mutuelle.",
    career: "Santé, restauration, immobilier, psychologie, garde d'enfants, histoire, hôtellerie.",
    pastTheme: "Votre passé est ancré dans des souvenirs familiaux intenses — joies et blessures qui ont sculpté votre coquille protectrice.",
    presentTheme: "La Lune met l'accent sur le foyer et les racines. C'est le moment de guérir les liens familiaux et de renforcer votre sanctuaire intérieur.",
    futureTheme: "Votre rôle de pilier émotionnel pour vos proches s'amplifiera. Vous créerez un héritage affectif durable.",
  },
  lion: {
    essence: "Rayonnant et généreux, le Lion est le roi du zodiaque. Le Soleil lui offre charisme, créativité et un besoin profond de briller et d'inspirer.",
    strengths: ["Charisme", "Générosité", "Créativité", "Loyauté noble"],
    shadows: ["Orgueil", "Besoin d'attention", "Dominance", "Dramatisation"],
    love: "Vous aimez avec grandeur et loyauté. Vous offrez protection et admiration, et attendez en retour reconnaissance et dévotion.",
    career: "Arts, spectacle, direction, luxe, politique, enseignement, entrepreneuriat créatif.",
    pastTheme: "Dès l'enfance, vous avez cherché la reconnaissance — parfois dans l'ombre d'une figure forte, parfois en tant qu'enfant prodige.",
    presentTheme: "Le Soleil vous place sous les projecteurs. Créativité, visibilité et leadership naturel sont au centre de cette période.",
    futureTheme: "Votre rayonnement attirera opportunités et alliés. Les prochaines années consacreront votre place de figure inspirante.",
  },
  vierge: {
    essence: "Analytique et dévoué, la Vierge cherche la perfection au service des autres. Mercure lui donne un esprit discriminant et un sens aigu du détail.",
    strengths: ["Précision", "Service", "Discernement", "Organisation"],
    shadows: ["Critique excessive", "Anxiété", "Perfectionnisme paralysant", "Difficulté à lâcher prise"],
    love: "Vous exprimez l'amour par les actes concrets : soin, écoute, amélioration du quotidien. Vous cherchez un partenaire authentique et fiable.",
    career: "Médecine, recherche, comptabilité, édition, nutrition, analyse de données, artisanat de précision.",
    pastTheme: "Une enfance où l'on attendait beaucoup de vous a cultivé votre sens du devoir, parfois au détriment de la spontanéité.",
    presentTheme: "Mercure favorise l'organisation, la santé et l'optimisation. C'est le moment de peaufiner vos méthodes et de servir avec excellence.",
    futureTheme: "Votre expertise reconnue vous positionnera comme référence dans votre domaine. La rigueur paiera sur le long terme.",
  },
  balance: {
    essence: "Harmonieux et diplomate, la Balance recherche l'équilibre et la beauté. Vénus lui confère charme, sens de la justice et quête de partenariat.",
    strengths: ["Diplomatie", "Esthétique", "Équité", "Charme social"],
    shadows: ["Indécision", "Évitement des conflits", "Dépendance au regard d'autrui", "Superficialité"],
    love: "Le couple est votre terrain d'expression. Vous recherchez l'harmonie, la complicité intellectuelle et la romance raffinée.",
    career: "Droit, médiation, mode, design, relations internationales, conseil, arts décoratifs.",
    pastTheme: "Votre passé a souvent impliqué des rôles de médiateur familial ou social, apprenant très tôt l'art du compromis.",
    presentTheme: "Vénus met les relations au premier plan. Partenariats, contrats et beauté environnementale sont favorisés.",
    futureTheme: "Votre talent pour créer des ponts et des alliances sera de plus en plus sollicité dans un monde polarisé.",
  },
  scorpion: {
    essence: "Intense et transformateur, le Scorpion plonge dans les profondeurs de l'âme. Pluton lui confère magnétisme, persévérance et pouvoir de renaissance.",
    strengths: ["Intensité", "Loyauté absolue", "Intuition psychique", "Résilience"],
    shadows: ["Jalousie", "Contrôle", "Rancune", "Obsession"],
    love: "Vous aimez tout ou rien. La passion, la loyauté et la transparence émotionnelle sont indispensables ; la trahison est impardonnable.",
    career: "Psychologie, investigation, finance, chirurgie, occultisme, recherche scientifique, criminologie.",
    pastTheme: "Des expériences de perte ou de trahison ont forgé votre force intérieure et votre capacité à renaître de vos cendres.",
    presentTheme: "Pluton active les transformations profondes. Fin de cycles, guérison des ombres et renouveau authentique sont à l'ordre du jour.",
    futureTheme: "Votre pouvoir de transformation vous mènera vers des rôles de guide ou de stratège. Les crises seront vos catalyseurs de grandeur.",
  },
  sagittaire: {
    essence: "Optimiste et explorateur, le Sagittaire vise l'horizon lointain. Jupiter lui offre expansion, sagesse philosophique et soif de liberté.",
    strengths: ["Optimisme", "Vision", "Générosité", "Esprit aventurier"],
    shadows: ["Excès", "Imprudence", "Manque de tact", "Engagement difficile"],
    love: "Vous aimez partager des aventures et des idéaux. Un partenaire doit respecter votre liberté tout en partageant votre quête de sens.",
    career: "Enseignement supérieur, tourisme, édition, droit international, sport, spiritualité, export.",
    pastTheme: "Une jeunesse marquée par l'ouverture au monde — voyages, études, rencontres — a élargi votre vision bien au-delà de votre environnement natal.",
    presentTheme: "Jupiter ouvre des portes : formation, voyages, publication, expansion professionnelle et rencontres inspirantes.",
    futureTheme: "Votre sagesse acquise fera de vous un mentor ou un pont entre cultures. L'horizon s'élargit sans cesse.",
  },
  capricorne: {
    essence: "Ambitieux et persévérant, le Capricorne gravit la montagne avec discipline. Saturne lui confère patience, responsabilité et sagesse mûrie par l'effort.",
    strengths: ["Ambition", "Discipline", "Fiabilité", "Vision long terme"],
    shadows: ["Froideur", "Workaholisme", "Pessimisme", "Rigidité"],
    love: "Vous abordez l'amour avec sérieux et loyauté. Vous cherchez un partenaire solide, avec qui construire un avenir concret et respecté.",
    career: "Management, architecture, politique, banque, administration, ingénierie, immobilier haut de gamme.",
    pastTheme: "Des responsabilités précoces — familiales ou professionnelles — ont mûri votre caractère bien avant vos pairs.",
    presentTheme: "Saturne récompense l'effort : promotions, reconnaissance, consolidation de votre statut et de votre réputation.",
    futureTheme: "Votre ascension méthodique vous placera parmi les figures respectées de votre domaine. Le sommet est à portée de main.",
  },
  verseau: {
    essence: "Visionnaire et indépendant, le Verseau porte l'avenir. Uranus lui confère originalité, humanisme et rébellion constructive contre l'ordre établi.",
    strengths: ["Innovation", "Humanisme", "Indépendance", "Intelligence collective"],
    shadows: ["Détachement émotionnel", "Excentricité", "Entêtement idéologique", "Imprévisibilité"],
    love: "Vous aimez d'abord l'esprit. L'amitié amoureuse, la liberté et les valeurs communes priment sur la passion conventionnelle.",
    career: "Technologie, sciences, ONG, astrologie, aéronautique, réseaux sociaux, recherche avant-gardiste.",
    pastTheme: "Sentir différent dès l'enfance — par l'intelligence, l'originalité ou l'isolement — a renforcé votre identité unique.",
    presentTheme: "Uranus provoque des percées : innovations, changements de groupe, révélations et engagement pour des causes humanitaires.",
    futureTheme: "Vous serez en avance sur votre temps. Les prochaines décennies valideront des idées que beauciez jugées utopiques.",
  },
  poissons: {
    essence: "Mystique et compatissant, les Poissons naviguent entre les mondes visible et invisible. Neptune leur confère imagination, spiritualité et empathie universelle.",
    strengths: ["Compassion", "Créativité", "Intuition", "Capacité de guérison"],
    shadows: ["Évasion", "Victimisation", "Confusion", "Frontières poreuses"],
    love: "Vous aimez avec une profondeur romantique et spirituelle. Vous cherchez une âme sœur, une fusion au-delà du physique.",
    career: "Arts, musique, thérapie, spiritualité, cinéma, pharmacie, travail social, océanographie.",
    pastTheme: "Une sensibilité précoce aux émotions d'autrui, parfois dans un environnement chaotique, a développé votre radar empathique.",
    presentTheme: "Neptune ouvre les portes de l'inspiration : rêves, créativité, méditation et connexions spirituelles s'intensifient.",
    futureTheme: "Votre don de compassion et de vision intérieure fera de vous un guide pour ceux qui cherchent sens et guérison.",
  },
};

export const NUMBER_PROFILES: Record<
  CoreNumber,
  {
    title: string;
    essence: string;
    strengths: string[];
    challenges: string[];
    lifeMission: string;
    personalYearMeaning: string;
  }
> = {
  1: {
    title: "Le Leader",
    essence: "Le 1 est l'origine, l'étincelle créatrice, l'individualité affirmée. Vous êtes né pour initier, diriger et tracer de nouvelles voies.",
    strengths: ["Autonomie", "Courage", "Originalité", "Détermination"],
    challenges: ["Égoïsme", "Autoritarisme", "Impatience", "Isolement"],
    lifeMission: "Développer la confiance en soi et montrer la voie aux autres par l'exemple.",
    personalYearMeaning: "Année de nouveaux départs, d'initiatives personnelles et de prise de pouvoir sur votre destinée.",
  },
  2: {
    title: "Le Diplomate",
    essence: "Le 2 est la dualité harmonisée, la coopération et la sensibilité relationnelle. Vous êtes le médiateur, l'artisan de la paix et du lien.",
    strengths: ["Patience", "Écoute", "Diplomatie", "Intuition relationnelle"],
    challenges: ["Dépendance", "Indécision", "Hypersensibilité", "Passivité"],
    lifeMission: "Créer l'harmonie dans vos relations et apprendre la force de la douceur.",
    personalYearMeaning: "Année de partenariats, de patience et de collaborations. Les alliances sont favorisées.",
  },
  3: {
    title: "Le Créateur",
    essence: "Le 3 est l'expression, la joie et la communication. Vous êtes un canal de créativité, d'optimisme et d'inspiration pour autrui.",
    strengths: ["Créativité", "Charisme", "Optimisme", "Expression artistique"],
    challenges: ["Dispersion", "Superficialité", "Gaspillage d'énergie", "Dramatisation"],
    lifeMission: "Partager votre lumière et votre joie à travers l'art, la parole ou l'écriture.",
    personalYearMeaning: "Année d'expression, de créativité et de sociabilité. Votre charisme est magnifié.",
  },
  4: {
    title: "Le Bâtisseur",
    essence: "Le 4 est la fondation, le travail méthodique et la stabilité. Vous êtes l'architecte du concret, celui qui transforme les rêves en structures durables.",
    strengths: ["Discipline", "Fiabilité", "Organisation", "Persévérance"],
    challenges: ["Rigidité", "Workaholisme", "Peur du changement", "Narrow-mindedness"],
    lifeMission: "Construire des bases solides — matérielles, familiales ou professionnelles — qui résistent à l'épreuve du temps.",
    personalYearMeaning: "Année de travail, d'organisation et de fondations. La discipline porte ses fruits.",
  },
  5: {
    title: "Le Voyager",
    essence: "Le 5 est le changement, la liberté et l'expérience sensorielle. Vous êtes attiré par l'aventure, la diversité et la transformation constante.",
    strengths: ["Adaptabilité", "Curiosité", "Charisme", "Ouverture d'esprit"],
    challenges: ["Instabilité", "Excès", "Engagement difficile", "Impulsivité"],
    lifeMission: "Embrasser le changement et transmettre la sagesse acquise par l'expérience.",
    personalYearMeaning: "Année de changements, de voyages et de liberté. L'imprévu devient votre allié.",
  },
  6: {
    title: "Le Nourricier",
    essence: "Le 6 est l'amour, la responsabilité et le service. Vous êtes le pilier familial, le guérisseur et le protecteur de l'harmonie.",
    strengths: ["Responsabilité", "Amour inconditionnel", "Esthétique", "Sens du devoir"],
    challenges: ["Sacrifice excessif", "Contrôle", "Perfectionnisme domestique", "Culpabilité"],
    lifeMission: "Créer l'harmonie autour de vous et assumer le rôle de gardien des valeurs familiales et communautaires.",
    personalYearMeaning: "Année de famille, de responsabilités et d'amour. Le foyer est au centre.",
  },
  7: {
    title: "Le Chercheur",
    essence: "Le 7 est l'introspection, la sagesse et la quête spirituelle. Vous êtes attiré par les mystères de l'existence et la connaissance profonde.",
    strengths: ["Analyse", "Intuition", "Sagesse", "Profondeur intellectuelle"],
    challenges: ["Isolement", "Méfiance", "Froideur", "Perfectionnisme mental"],
    lifeMission: "Développer la sagesse intérieure et partager vos découvertes spirituelles ou intellectuelles.",
    personalYearMeaning: "Année d'introspection, d'étude et de développement spirituel. Le silence est fertile.",
  },
  8: {
    title: "Le Magnat",
    essence: "Le 8 est le pouvoir, l'abondance et l'équilibre karmique entre le matériel et le spirituel. Vous êtes fait pour gérer, diriger et manifester la prospérité.",
    strengths: ["Ambition", "Autorité", "Efficacité", "Vision business"],
    challenges: ["Matérialisme", "Domination", "Workaholisme", "Intolérance à l'échec"],
    lifeMission: "Maîtriser le pouvoir avec intégrité et utiliser l'abondance au service du bien commun.",
    personalYearMeaning: "Année de réussite matérielle, de reconnaissance et de pouvoir. Les finances sont mises en lumière.",
  },
  9: {
    title: "L'Humaniste",
    essence: "Le 9 est la sagesse universelle, la compassion et l'achèvement des cycles. Vous portez une vision globale et un cœur ouvert à l'humanité.",
    strengths: ["Compassion", "Générosité", "Vision globale", "Sagesse"],
    challenges: ["Sacrifice", "Idéalisme", "Difficulté à lâcher prise", "Émotions intenses"],
    lifeMission: "Servir l'humanité avec compassion et clore les cycles avec grâce pour en ouvrir de nouveaux.",
    personalYearMeaning: "Année de conclusion, de lâcher-prise et de service. Un cycle se termine pour laisser place au renouveau.",
  },
  11: {
    title: "Le Maître Intuitif",
    essence: "Le 11 est un nombre maître d'inspiration, d'intuition et de révélation. Vous êtes un canal entre le visible et l'invisible, un porteur de lumière.",
    strengths: ["Intuition puissante", "Inspiration", "Charisme spirituel", "Vision"],
    challenges: ["Nervosité", "Anxiété", "Déséquilibre émotionnel", "Pression intérieure"],
    lifeMission: "Élever la conscience collective par votre intuition et votre exemple inspirant.",
    personalYearMeaning: "Année de révélations, d'intuition accrue et de missions spirituelles. Écoutez votre voix intérieure.",
  },
  22: {
    title: "Le Maître Bâtisseur",
    essence: "Le 22 combine la vision du 11 et la capacité du 4 à manifester. Vous êtes capable de projets d'envergure qui transforment le monde matériel.",
    strengths: ["Vision grandiose", "Pragmatisme", "Leadership", "Impact durable"],
    challenges: ["Pression écrasante", "Perfectionnisme", "Stress", "Peur de l'échec"],
    lifeMission: "Construire des structures — entreprises, institutions, œuvres — qui servent l'humanité à grande échelle.",
    personalYearMeaning: "Année de grands projets et de manifestation concrète de visions ambitieuses.",
  },
  33: {
    title: "Le Maître Enseignant",
    essence: "Le 33 est le nombre du service élevé, de la guérison et de l'amour universel incarné. Vous êtes un guide spirituel par excellence.",
    strengths: ["Compassion profonde", "Guérison", "Enseignement", "Amour inconditionnel"],
    challenges: ["Sacrifice total", "Épuisement", "Attentes irréalistes", "Martyr"],
    lifeMission: "Guérir et enseigner par l'amour, devenir un phare pour ceux qui souffrent.",
    personalYearMeaning: "Année de service élevé, de guérison et d'impact profond sur la vie d'autrui.",
  },
};

export const PERSONAL_YEAR_FORECASTS: Record<
  CoreNumber,
  { theme: string; love: string; career: string; health: string; advice: string }
> = {
  1: {
    theme: "Nouveaux départs et prise d'initiative",
    love: "Possibilité de nouvelle relation ou de renouveau dans le couple. Affirmez vos besoins.",
    career: "Lancez des projets, changez de poste ou créez votre activité. L'audace est récompensée.",
    health: "Énergie élevée — canalisez-la dans le sport et évitez le surmenage.",
    advice: "Plantez des graines : ce que vous initiez cette année définira la décennie à venir.",
  },
  2: {
    theme: "Patience, partenariats et sensibilité",
    love: "Relations approfondies, fiançailles ou renforcement des liens. Écoutez plus que vous ne parlez.",
    career: "Collaborations fructueuses. Évitez les décisions impulsives ; la diplomatie ouvre des portes.",
    health: "Gérez le stress et les émotions. Yoga, méditation et nature sont vos alliés.",
    advice: "Cultivez la patience : les graines plantées l'an passé germent en silence.",
  },
  3: {
    theme: "Créativité, joie et expression sociale",
    love: "Romance, légèreté et moments mémorables. Exprimez vos sentiments avec créativité.",
    career: "Visibilité accrue, projets créatifs, communication. Votre charisme attire les opportunités.",
    health: "Attention aux excès. Équilibrez fête et repos.",
    advice: "Exprimez-vous sans retenue — votre voix a le pouvoir d'inspirer.",
  },
  4: {
    theme: "Travail, structure et fondations",
    love: "Consolidation du couple, projets communs concrets (maison, famille). La stabilité prime.",
    career: "Efforts soutenus récompensés. Organisez, planifiez, construisez méthodiquement.",
    health: "Routine santé essentielle. Attention au dos et aux articulations.",
    advice: "Bâtissez solide : les efforts de cette année porteront leurs fruits pendant des années.",
  },
  5: {
    theme: "Changement, liberté et aventure",
    love: "Surprises amoureuses, rencontres inattendues ou besoin de renouveau. Restez ouvert.",
    career: "Changements professionnels, voyages, reconversion possible. L'adaptabilité est clé.",
    health: "Vitalité fluctuante. Évitez les excès et les risques inutiles.",
    advice: "Accueillez le changement comme un allié, même s'il déstabilise temporairement.",
  },
  6: {
    theme: "Famille, responsabilité et amour",
    love: "Mariage, naissance, réconciliation familiale. L'amour et le devoir se mêlent harmonieusement.",
    career: "Service aux autres valorisé. Métiers du soin, de l'enseignement ou du conseil favorisés.",
    health: "Prenez soin de vous autant que des autres. Le surmenage émotionnel est un piège.",
    advice: "Honorez vos responsabilités sans vous oublier. L'équilibre est votre mantra.",
  },
  7: {
    theme: "Introspection, étude et spiritualité",
    love: "Période plus solitaire ou relation profonde et spirituelle. Qualité plutôt que quantité.",
    career: "Recherche, formation, spécialisation. Les projets solitaires ou intellectuels prospèrent.",
    health: "Écoutez votre corps et votre esprit. Repos et méditation essentiels.",
    advice: "Retirez-vous du bruit du monde pour entendre votre sagesse intérieure.",
  },
  8: {
    theme: "Pouvoir, finances et reconnaissance",
    love: "Équilibre entre vie professionnelle et personnelle crucial. Ne négligez pas votre moitié.",
    career: "Promotions, augmentations, succès commercial. Votre autorité naturelle s'affiliate.",
    health: "Gestion du stress lié à l'ambition. Exercice régulier recommandé.",
    advice: "Utilisez votre pouvoir avec intégrité. L'abondance est un outil, pas une fin en soi.",
  },
  9: {
    theme: "Achèvement, lâcher-prise et service",
    love: "Fin de cycle possible — séparation ou transformation profonde du couple. Grâce dans la clôture.",
    career: "Clôture de projets, retraite, changement de cap. Libérez-vous de ce qui ne vous sert plus.",
    health: "Détox physique et émotionnelle. Purifiez corps et esprit.",
    advice: "Lâchez prise avec gratitude. Chaque fin prépare une renaissance.",
  },
  11: {
    theme: "Inspiration, intuition et révélations",
    love: "Connexion spirituelle intense. Relations karmiques ou rencontres significatives.",
    career: "Missions inspirées, projets visionnaires. Suivez votre intuition professionnelle.",
    health: "Sensibilité nerveuse accrue. Protégez votre énergie et limitez les stimuli.",
    advice: "Vous êtes un canal — accueillez les insights sans les analyser excessivement.",
  },
  22: {
    theme: "Grands projets et impact durable",
    love: "Partenaire qui partage votre vision. Construisez ensemble quelque chose de grand.",
    career: "Projets d'envergure, création d'entreprise, impact social. Le ciel est la limite.",
    health: "Attention à l'épuisement par surmenage. Déléguez et reposez-vous.",
    advice: "Vous portez une vision collective — manifestez-la étape par étape.",
  },
  33: {
    theme: "Service élevé et guérison",
    love: "Amour universel et compassion. Relations de guérison mutuelle.",
    career: "Enseignement, thérapie, actions humanitaires. Votre impact touche des vies profondément.",
    health: "Épuisement émotionnel possible. Protégez votre énergie vitale.",
    advice: "Servez avec amour mais fixez des limites saines. Vous ne pouvez pas sauver tout le monde.",
  },
};

export const ELEMENT_DESCRIPTIONS: Record<Element, string> = {
  feu: "L'élément Feu vous confère passion, enthousiasme et un élan créateur. Vous brûlez de désir d'action et d'expression.",
  terre: "L'élément Terre vous ancre dans le concret, la patience et la fiabilité. Vous manifestez vos rêves par le travail.",
  air: "L'élément Air nourrit votre intellect, votre communication et votre soif de connexions et d'idées nouvelles.",
  eau: "L'élément Eau amplifie votre sensibilité, votre intuition et votre profondeur émotionnelle.",
};

export const DECAN_DESCRIPTIONS: Record<1 | 2 | 3, string> = {
  1: "Premier décan : vous exprimez les qualités pures de votre signe avec intensité.",
  2: "Deuxième décan : une influence du signe suivant adoucit et enrichit votre personnalité.",
  3: "Troisième décan : une touche du signe précédent ajoute profondeur et nuance à votre caractère.",
};
