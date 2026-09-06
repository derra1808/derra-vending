/** Plus snack — même méthode, autre métier. Dans le pack café, pas une 2e formation. */
export const SNACK_PLUS_TITLE = "Le plus — Snack";
export const SNACK_PLUS_SUBTITLE =
  "La méthode café marche aussi pour le snack. Le spot, la prospection, le contrat, la tournée : c’est le même jeu. Ce qui change, c’est la machine, le stock et les marges.";

export const SNACK_PLUS_SAME = [
  "Tu cherches un spot avec du passage qui reste (chantier, atelier, bureau).",
  "Tu déposes, tu ne vends pas la machine. L’hôte ne paie pas l’installation.",
  "Tu prospectes pareil : entourage, porte-à-porte, réseaux.",
  "Tu signes un contrat simple, préavis 1 mois.",
  "Tu gagnes sur la récurrence, pas sur un coup.",
];

export const SNACK_PLUS_DIFF = [
  "Machine différente : un distributeur snack / boissons, pas une Gaggia.",
  "Tu ne factures pas à la tasse : tu vis sur la marge produit (achat vs prix de vente).",
  "Le stock tourne plus vite, et ça se péreme. Tu gères DLC, pas un sachet de café.",
  "Tu passes plus souvent qu’une fois par mois si ça tire.",
  "Le vol et le mauvais assortiment tuent un spot plus vite que sur le café.",
];

export const SNACK_PLUS_ITEMS = [
  {
    q: "Je commence par le café ou par le snack ?",
    a: "Café d’abord. Plus simple à poser, moins de stock, moins de DLC. Quand un spot café tourne 14 jours, tu peux ajouter un snack à côté — pas l’inverse.",
  },
  {
    q: "C’est vraiment la même méthode ?",
    a: "70 % oui : spot, oui du décideur, dépôt, tournée, chiffres. Les 30 % restants, c’est le métier produit. Si tu copies l’assortiment d’une station-service, tu perds de l’argent.",
  },
  {
    q: "Je mets snack et café dans la même machine ?",
    a: "Non. Deux machines, deux métiers. Un combo trop chargé se bloque, se vide mal, et tu ne sais plus ce qui marche.",
  },
  {
    q: "Où le snack marche le mieux ?",
    a: "Là où les gens restent et ont faim : chantier, atelier, entrepôt, bureau sans cantine. Un commerce de passage, souvent trop faible. Même logique que le café, parfois le même site.",
  },
  {
    q: "Comment je gagne, si ce n’est pas 0,85 la tasse ?",
    a: "Tu achètes le produit, tu le vends plus cher dans la machine. La marge, c’est l’écart. Un produit qui ne part pas, c’est du cash mort + une DLC. Moins de références qui tournent > un grand choix qui dort.",
  },
  {
    q: "Quoi mettre dedans ?",
    a: "Le minimum qui part : eau, soda, encas sucré, salé, un ou deux « faim du midi ». Tu regardes ce qui se vide en 7–14 jours. Ce qui reste, tu le sors. Pas de 40 références au début.",
  },
  {
    q: "Je passe aussi souvent que pour le café ?",
    a: "Souvent plus. Le café tient avec une tournée mensuelle + rinçage auto. Le snack, si ça tire, tu reviens dès que les bonnes lignes sont vides. Un snack vide = l’hôte te rappelle, puis il te vire.",
  },
  {
    q: "Le vol, c’est grave ?",
    a: "Plus que sur le café. Machine mal calée, spot ouvert la nuit, pas de regard : ça part. Pose là où quelqu’un voit la machine. Si ça vole, tu bouges, tu ne « testes » pas 3 mois.",
  },
  {
    q: "Occasion ou neuf pour le snack ?",
    a: "Même règle que le café : occasion pour démarrer, tu limites le risque. Tu testes le spot. Le neuf, quand ça encaisse.",
  },
  {
    q: "J’ai déjà un bon spot café. J’ajoute un snack ?",
    a: "Oui, c’est le meilleur plus. Le décideur te connaît, le passage est prouvé. Une 2e machine sur un spot mort, ça double le problème. Une 2e machine sur un spot vivant, ça double le ticket.",
  },
] as const;
