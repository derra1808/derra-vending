/** 50 questions / réponses terrain — bonus membre */
export const QA50_TITLE = "50 questions / réponses terrain";
export const QA50_SUBTITLE =
  "Emplacement, entretien, autorisation, neuf ou occasion, chiffres. Réponses d’opérateur, pas de théorie.";

export const QA50_CATEGORIES = [
  {
    id: "spot",
    title: "Emplacement",
    items: [
      {
        q: "Comment je reconnais un bon emplacement ?",
        a: "Du passage régulier, des gens qui restent (chantier, atelier, bureau, commerce), un accès simple à la machine, et un responsable qui dit oui. Si les gens passent 10 secondes et repartent, la machine dort.",
      },
      {
        q: "Un chantier, c’est un bon spot ?",
        a: "Oui, souvent parmi les meilleurs. Les gars boivent du café toute la journée. Exemple chez nous : un chantier à Cynara, on y voit les vraies récoltes machine par machine. Attention : le chantier a une durée de vie — anticipe la fin du projet.",
      },
      {
        q: "École, hôpital, mairie : je peux y aller ?",
        a: "Oui, mais ce n’est pas le même jeu. Il y a souvent un appel d’offres, un prestataire déjà en place, ou une autorisation plus longue. Commence par commerces, entreprises et chantiers : plus rapide, moins de paperasse.",
      },
      {
        q: "Combien de machines sur un même site ?",
        a: "Une pour commencer. Si ça tourne fort (500–800 tasses), tu regardes un 2e point dans le bâtiment. Deux machines trop proches se cannibalisent.",
      },
      {
        q: "Le commerçant a déjà une machine. Je fais quoi ?",
        a: "Tu compares l’offre : la tienne est gratuite, entretenue, sans engagement. S’il a déjà un contrat exclusif, tu notes la date de fin et tu reviens. Si c’est une vieille machine à lui, tu proposes de la remplacer sans frais.",
      },
      {
        q: "Un petit commerce sans passage, ça vaut le coup ?",
        a: "Souvent non. Une machine faible (~250 tasses) se rembourse, mais lentement. Vise d’abord les spots moyens/forts. Un petit commerce peut servir de premier test si c’est un proche.",
      },
      {
        q: "Je dois payer un loyer d’emplacement ?",
        a: "Pas dans le modèle dépôt gratuit café. Tu poses la machine, lui vend, tu factures la tasse. Si on te demande un loyer, le spot doit vraiment tourner — sinon tu refuses.",
      },
      {
        q: "Comment je teste un spot avant d’acheter une machine chère ?",
        a: "Tu poses une occasion. 14 jours de vrais chiffres, pas un ressenti. Si ça ne part pas, tu déplaces. C’est pour ça qu’on ne démarre pas en neuf.",
      },
    ],
  },
  {
    id: "legal",
    title: "Autorisations & cadre",
    items: [
      {
        q: "Il me faut une autorisation spéciale ?",
        a: "Pour un commerce / entreprise qui accepte ta machine : en général un contrat entre vous suffit. Pour l’espace public, une école ou un bâtiment officiel : demande locale. Fais valider ton statut (indépendant, raison individuelle…) dans ton pays.",
      },
      {
        q: "Je dois créer une société tout de suite ?",
        a: "Non. Beaucoup commencent en parallèle d’un job, avec le statut le plus simple de leur pays. La société vient quand le parc tourne et que tu veux séparer les risques.",
      },
      {
        q: "Qui assure la machine ?",
        a: "Toi. Casse, vol, incendie : c’est dans le contrat. Le commerçant signale l’incident, tu gères. Sans assurance, un vol te remet à zéro.",
      },
      {
        q: "Et l’hygiène / les normes alimentaires ?",
        a: "Tu fournis des consommables propres, tu entretiens, tu rinces. Le commerçant vide marc et eaux usées. Renseigne-toi sur les règles locales si tu sers au public. Une machine sale, c’est la fin du spot.",
      },
      {
        q: "Le contrat, c’est obligatoire ?",
        a: "Oui, même simple. Sans papier, tu n’as rien le jour où ça se passe mal. Le modèle dépôt gratuit est dans tes bonus : préavis 1 mois, pas de minimum, pas d’exclusivité sauf accord.",
      },
    ],
  },
  {
    id: "machines",
    title: "Neuf ou occasion",
    items: [
      {
        q: "Je commence en neuf ou en occasion ?",
        a: "Occasion. Pour le prix d’une neuve, tu en as plusieurs d’occase. Tu apprends, tu limites le risque. Le neuf vient quand le parc encaisse déjà.",
      },
      {
        q: "Quelles machines pour démarrer ?",
        a: "Jura, Saeco, Necta / Gaggia d’occasion qui font café + chocolat + lait. Demande une vidéo qui marche et, si possible, le compteur. Teste chez toi avant de poser.",
      },
      {
        q: "C’est quoi les machines que tu utilises aujourd’hui ?",
        a: "Gaggia G100 (Necta). Fiables, complètes. Prix neuf fournisseur souvent 2 500–3 000 CHF. Les plus petites (type G50) sont à surveiller pour les spots modestes.",
      },
      {
        q: "Où j’achète l’occasion ?",
        a: "Facebook Marketplace partout. France : Leboncoin. Suisse : Anibis, Tutti, Ricardo. Cherche « machine professionnelle », Jura, Saeco, Necta, Gaggia.",
      },
      {
        q: "Une machine à 400 CHF sur Marketplace, je prends ?",
        a: "Seulement si elle fait le café devant toi, que les mixeurs ne sentent pas le brûlé, et que tu as un plan B si elle meurt dans 2 mois. Pas cher ≠ bon spot. Le spot compte plus que la machine.",
      },
      {
        q: "Snack et café, je mélange sur la même machine ?",
        a: "Non. Deux machines. La méthode (spot, dépôt, tournée) est la même — le détail snack est dans le plus du pack, pas dans une 2e formation.",
      },
      {
        q: "Si la machine tombe en panne, je fais quoi ?",
        a: "Tu as un spare ou tu déplaces une occasion. Un spot fort sans machine pendant 2 semaines, tu perds la confiance. D’où : commence occasion, apprends l’entretien, filtre à eau contre le tartre.",
      },
    ],
  },
  {
    id: "entretien",
    title: "Entretien & tournée",
    items: [
      {
        q: "Je dois passer tous les jours ?",
        a: "Non. Tu check les chiffres, pas la machine tous les jours. Rinçage auto du mixeur 2×/jour (ex. 7h et 23h). Tournée mensuelle pour stock + compteur. Entretien plus poussé toutes les 2 semaines.",
      },
      {
        q: "Le commerçant doit faire quoi ?",
        a: "Le minimum : vider le bac à marc et le bac à eau usée. S’il refuse ça, le spot va pourrir. Toi tu gères le reste.",
      },
      {
        q: "C’est quoi le rinçage automatique ?",
        a: "Le mixeur (boissons lactées) s’encrasse vite. Tu le programmes pour se rincer tout seul. C’est l’astuce qui évite 80 % des pannes bêtes.",
      },
      {
        q: "Combien de stock je laisse à chaque passage ?",
        a: "Ordre de grandeur : 3 sachets de café (4 si ça tire), 4 paquets de gobelets, 2 lait, 2 chocolat. 1 sachet café ≈ 150 tasses. 1 lait/chocolat ≈ 45 boissons.",
      },
      {
        q: "Le tartre, c’est grave ?",
        a: "C’est l’ennemi n°1. Filtre à eau + détartrage. Une machine filtrée dure des années. Une machine négligée te coûte une neuve.",
      },
      {
        q: "Je peux gérer 20 machines tout seul ?",
        a: "Oui si tu organises la tournée (un jour, un secteur) et que le rinçage auto est en place. Le travail n’est pas quotidien. Le piège, c’est les spots trop éloignés.",
      },
      {
        q: "Que faire si un commerçant n’entretient rien ?",
        a: "Tu lui rappelles le minimum une fois. Si ça continue, tu récupères la machine. Un mauvais hôte te coûte plus cher qu’un « non ».",
      },
    ],
  },
  {
    id: "chiffres",
    title: "Chiffres & récoltes",
    items: [
      {
        q: "Combien je facture la tasse ?",
        a: "Chez moi : 0,85 CHF. Pas un chiffre magique — c’est mon prix terrain. À 1,50 le commerçant ne poussait pas. À 0,85 il gagne, il pousse, il recommande. Adapte à tes coûts et à ton pays.",
      },
      {
        q: "C’est quoi ma marge réelle ?",
        a: "Coût tasse ≈ 0,11–0,12 CHF (café, lait, chocolat, gobelet). À 0,85 facturé → ~0,73 de marge brute. Le volume et l’emplacement font le reste.",
      },
      {
        q: "Combien de tasses par mois c’est réaliste ?",
        a: "Sur mon parc : 250 (faible) à 800 (fort). Même machine. Seul l’emplacement change. 300 tasses = exemple moyen pour calculer, pas une promesse.",
      },
      {
        q: "Quand la machine est remboursée ?",
        a: "Neuve ~2 750 CHF : ~15 mois si faible, ~7–8 mois si moyenne, ~5 mois si forte. En occasion, parfois 2–3 mois. Après, c’est du récurrent.",
      },
      {
        q: "Les récoltes, je les montre où ?",
        a: "Dans l’espace membre : vidéo Récolte & chiffres — chantier Cynara. C’est du terrain, pas un slide Instagram.",
      },
      {
        q: "Je me verse un salaire dès le 1er mois ?",
        a: "Non. Tu réinvestis. Première machine → preuve 14 jours → 2e spot. Le salaire vient quand le parc est stable, pas sur une récolte chanceuse.",
      },
      {
        q: "10 machines, ça fait combien ?",
        a: "10 × 400 tasses × 0,73 ≈ 2 920 CHF/mois de marge brute, si la moyenne tient. Ce n’est pas un revenu net (essence, pannes, stock). Mais tu vois le levier : le nombre de machines, pas le prix de la tasse.",
      },
      {
        q: "Un mois creux, je panique ?",
        a: "Regarde le compteur, pas ton feeling. Vacances, intempéries, fin de chantier : ça existe. Si c’est structurel (mauvais spot), tu bouges la machine.",
      },
    ],
  },
  {
    id: "prospection",
    title: "Prospection & contrat",
    items: [
      {
        q: "Par où je commence pour trouver des clients ?",
        a: "Liste d’entourage : barbers, restos, boîtes d’amis. 1–2 oui suffisent pour démarrer. Ensuite porte-à-porte + appels + réseaux. Les scripts sont dans tes bonus.",
      },
      {
        q: "Ils vont tous me dire non ?",
        a: "Oui, beaucoup. C’est le jeu. Tu pars en te disant que tu récoltes des « non ». Un oui paie des semaines de non. Ceux qui abandonent veulent tout tout de suite.",
      },
      {
        q: "Je parle au patron ou au contremaître ?",
        a: "À celui qui décide. Sur un chantier, le contremaître ouvre souvent la porte. En commerce, le gérant. Ne perds pas 3 rendez-vous avec quelqu’un qui ne signe pas.",
      },
      {
        q: "Je vends la machine ou je la dépose ?",
        a: "Tu la déposes. Vendre une machine = un coup. La déposer = chaque tasse, des années. C’est tout le modèle.",
      },
      {
        q: "Il veut de l’exclusivité. J’accepte ?",
        a: "Pas par défaut. Ça te bloque si le spot est moyen. Seulement si le volume est fort et que ça t’arrange. Écris-le.",
      },
      {
        q: "Préavis : combien ?",
        a: "Un mois, écrit (email OK). Assez court pour qu’il signe, assez long pour que tu bouges la machine.",
      },
      {
        q: "Il veut fixer le prix de vente au client ?",
        a: "Oui, c’est lui. Toi tu factures ta tasse (0,85 chez moi). Sa marge, c’est ce qui le fait pousser le café.",
      },
      {
        q: "Comment je relance sans être lourd ?",
        a: "Un message clair, une date, un « si c’est non je passe à un autre ». Les scripts WhatsApp / porte-à-porte sont déjà rédigés dans le bonus.",
      },
    ],
  },
  {
    id: "stock",
    title: "Consommables & stock",
    items: [
      {
        q: "Où j’achète café, lait, gobelets ?",
        a: "Au début : promos grandes surfaces (Profital en Suisse pour les prospectus). Ensuite : fournisseurs pro, meilleurs prix. Mes contacts négociés sont dans l’appel Q&R, pas en public.",
      },
      {
        q: "Quel grammage je mets ?",
        a: "Espresso : autour de 7 g. Si c’est trop léger, resserre la meule (mouture plus fine). Tu règles ça à l’installation, pas au feeling du commerçant.",
      },
      {
        q: "Je dois stocker où ?",
        a: "Chez toi ou un local simple. Pas besoin d’entrepôt au début. Tu charges la tournée du mois : assez pour ne pas revenir, pas assez pour pourrir.",
      },
      {
        q: "Le commerçant peut acheter le café lui-même ?",
        a: "Non, tu perds la marge et la qualité. Toi tu fournis. C’est dans le contrat. S’il insiste, le spot n’est pas le bon.",
      },
    ],
  },
  {
    id: "start",
    title: "Démarrage",
    items: [
      {
        q: "Combien il me faut pour démarrer ?",
        a: "Une occasion qui marche + un peu de stock + de l’essence pour prospecter. Pas 30 000 CHF. Les exemples de l’ebook sont en CHF ; tu convertis.",
      },
      {
        q: "Je quitte mon travail tout de suite ?",
        a: "Non. Ibrahim a commencé 6 mois en parallèle (maçon, 6 700 CHF brut). 1–2 machines le soir / week-end. Tu démissionnes quand le parc remplace le salaire, pas avant.",
      },
      {
        q: "Ça marche hors Suisse ?",
        a: "Oui. Le modèle (dépôt, tasse, prospection) marche en Europe. Tu adaptes prix, fournisseurs, contrat et statut. Genève c’est la preuve, pas la prison.",
      },
    ],
  },
] as const;

export const QA50_ITEMS = QA50_CATEGORIES.flatMap((c) =>
  c.items.map((item) => ({ ...item, category: c.title, categoryId: c.id }))
);

export const QA50_COUNT = QA50_ITEMS.length;

if (QA50_COUNT !== 50) {
  throw new Error(`QA50 doit contenir 50 questions (actuel: ${QA50_COUNT})`);
}
