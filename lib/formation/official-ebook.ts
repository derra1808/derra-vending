/** Contenu officiel — Derra_Vending_Ebook_Cafe_1.pdf */
export const OFFICIAL_EBOOK = {
  title: "Le Café en Dépôt Gratuit",
  subtitle: "Le business de la distribution automatique, expliqué de A à Z par un opérateur du terrain",
  author: "par Ibrahim — Derra Vending",
  tagline: "Guide pratique • Méthode Genève · Applicable en Europe",
} as const;

export type EbookBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "bullet"; text: string }
  | { type: "tip"; title: string; text: string }
  | { type: "spacer" };

export const OFFICIAL_PARTS: {
  id: number;
  title: string;
  image: string;
  blocks: EbookBlock[];
}[] = [
  {
    id: 1,
    title: "Le business model : le café en dépôt gratuit",
    image: "part1.png",
    blocks: [
      { type: "h3", text: "Le principe en une phrase" },
      {
        type: "p",
        text: "Tu installes une machine à café professionnelle gratuitement chez un commerçant. Lui vend le café à ses clients au prix qu'il veut. Toi, chaque mois, tu relèves le compteur de la machine et tu lui factures 0,85 CHF par tasse consommée. C'est tout.",
      },
      {
        type: "p",
        text: "Pas de vente de machine. Pas de gros investissement pour le commerçant. Il n'a aucune raison de dire non — tu lui apportes un service en plus, sans risque pour lui.",
      },
      { type: "h3", text: "Pourquoi ce modèle est puissant" },
      {
        type: "p",
        text: "La plupart des gens pensent qu'il faut vendre des machines pour gagner de l'argent dans le café. C'est faux. La vraie mine d'or, c'est la consommation récurrente. Une machine bien placée tourne des centaines de tasses par mois, chaque mois, pendant des années.",
      },
      {
        type: "p",
        text: "Tu ne gagnes pas une fois. Tu gagnes à chaque tasse, tout le temps.",
      },
      { type: "h3", text: "Les chiffres réels" },
      { type: "p", text: "Ton coût par tasse : 11 à 12 centimes" },
      { type: "bullet", text: "Café en grain : environ 10 CHF le kilo" },
      { type: "bullet", text: "Lait en poudre : 3 CHF les 500 g" },
      { type: "bullet", text: "Chocolat en poudre : 4 CHF le kilo" },
      { type: "bullet", text: "Plus le gobelet et le sucre" },
      {
        type: "p",
        text: "Ce que tu factures : 85 centimes par tasse. Tu encaisses 0,85 CHF, ça te coûte 0,12 CHF. Ta marge brute est d'environ 73 centimes par tasse.",
      },
      { type: "h3", text: "Exemple — machine à 300 tasses/mois" },
      { type: "bullet", text: "Chiffre : 300 × 0,85 = 255 CHF/mois" },
      { type: "bullet", text: "Coût consommables : 300 × 0,12 = 36 CHF" },
      {
        type: "p",
        text: "Marge : ~219 CHF/mois, sur une seule machine. Multiplie par 10, 20, 30 machines et tu comprends où est le business.",
      },
      { type: "h3", text: "L'investissement de départ" },
      {
        type: "p",
        text: "La machine que j'utilise, une Gaggia Milano G100, coûte entre 2 500 et 3 000 CHF au prix fournisseur. C'est ton seul vrai investissement par point de vente. Avec une marge de ~219 CHF/mois, une machine est remboursée en 12 à 14 mois environ. Après ça, tout ce qu'elle produit est du bénéfice net (hors entretien).",
      },
      { type: "h3", text: "Comment l'argent circule concrètement" },
      { type: "bullet", text: "Tu installes la machine gratuitement chez le commerçant." },
      { type: "bullet", text: "Le commerçant vend le café à ses clients (au prix qu'il fixe lui-même)." },
      { type: "bullet", text: "Un mois plus tard, tu passes relever le compteur de la machine." },
      { type: "bullet", text: "Tu multiplies le nombre de tasses par 0,85 CHF." },
      { type: "bullet", text: "Tu établis une facture, tu la remets au commerçant, il te paie." },
      { type: "h3", text: "Les conditions du contrat" },
      {
        type: "p",
        text: "Ton offre est imbattable parce qu'elle enlève tous les freins du commerçant :",
      },
      { type: "bullet", text: "Sans engagement de durée — il peut arrêter quand il veut." },
      { type: "bullet", text: "Préavis d'un mois seulement." },
      { type: "bullet", text: "Aucun minimum de consommation — s'il vend peu, il paie peu." },
      { type: "bullet", text: "Pas d'exclusivité — il reste libre." },
      { type: "bullet", text: "Consommables fournis par toi (café, lait, gobelets)." },
      { type: "bullet", text: "Machine assurée par toi contre casse, vol et incendie." },
      {
        type: "p",
        text: "Le commerçant ne prend aucun risque. C'est exactement ce qui fait signer.",
      },
      { type: "h3", text: "La leçon de prix : pourquoi je facture 0,85 et pas plus" },
      {
        type: "p",
        text: "Le 0,85 CHF n'est pas un prix magique. C'est mon prix, celui que j'ai choisi après l'avoir testé sur le terrain. Toi, tu fixeras le tien selon tes coûts fournisseurs. Mais l'histoire derrière mérite d'être racontée, parce qu'elle t'évitera une grosse erreur.",
      },
      {
        type: "p",
        text: "Au début, je facturais 1,50 CHF la tasse. Sur le papier c'est logique : plus le prix est haut, plus je gagne. Sauf que non. En négociant mes fournisseurs, j'ai fait baisser mon coût de revient, ce qui m'a permis de descendre à 0,85. Et là, tout a changé — dans le bon sens.",
      },
      {
        type: "p",
        text: "À 1,50 la tasse, le commerçant regardait sa marge et se disait qu'il ne gagnait pas assez. Il ne poussait pas le café, la relation s'essoufflait. À 0,85, sa marge explose. Il est content, il pousse le café, la machine tourne plus. Et moi je gagne sur le volume et sur la durée.",
      },
      {
        type: "tip",
        title: "Le principe à retenir",
        text: "Dans le business, ton client doit avoir l'impression de gagner. Toujours. Un client qui sent qu'il fait une bonne affaire reste des années. Vaut mieux gagner un peu, longtemps, que beaucoup, une fois.",
      },
      {
        type: "p",
        text: "Et le meilleur pour la fin : depuis que je suis à 0,85, mes commerçants me recommandent d'autres commerçants. Mon prix bas est devenu mon meilleur commercial — il ne me coûte rien et il me ramène des clients tout seul. C'est ça, le vrai calcul : prix juste → commerçant content → volume + fidélité + recommandations.",
      },
    ],
  },
  {
    id: 2,
    title: "Trouver et convaincre les commerçants",
    image: "part2.png",
    blocks: [
      {
        type: "p",
        text: "Trouver tes premiers clients, c'est là que la plupart des gens bloquent. Ils attendent le client parfait au lieu d'aller le chercher. Voici la méthode exacte que j'ai suivie, étape par étape.",
      },
      { type: "h3", text: "Étape 1 — Commence par ton entourage" },
      {
        type: "p",
        text: "Avant d'aller voir des inconnus, fais une liste. Note toutes les connaissances autour de toi qui ont un commerce ou une entreprise : les barbers, les restaurants, les proches qui ont une boîte, les amis d'amis. Tout le monde. Ensuite, envoie-leur un message et présente ton offre, simplement.",
      },
      {
        type: "p",
        text: "Sur toute ta liste, tu auras un ou deux « oui ». Et c'est un excellent début — ces premiers clients sont ton terrain d'expérimentation, dans un cadre où la confiance est déjà là.",
      },
      { type: "h3", text: "Étape 2 — Le porte-à-porte et les appels" },
      {
        type: "p",
        text: "Une fois que t'as expérimenté avec tes proches, tu passes au terrain : porte-à-porte et appels. C'est là que tu apprends vraiment, bien plus que dans n'importe quel livre. Tu vas prendre beaucoup de « non » — c'est le jeu. Mais chaque « oui » te fait gagner en confiance.",
      },
      {
        type: "tip",
        title: "L'astuce mentale",
        text: "Pars du principe que tu vas récolter des « non ». Si tu t'y attends dès le départ, ils ne te font plus mal, et tout devient plus simple. Avec le temps, sans t'en rendre compte, tu deviens naturellement doué.",
      },
      { type: "h3", text: "Étape 3 — Les réseaux et l'effet boule de neige" },
      {
        type: "p",
        text: "En parallèle des appels, mets-toi sur les réseaux sociaux, partout. Le but c'est de toucher tout le monde, d'être visible sur un maximum de canaux. Là, l'effet boule de neige se met en place : tes clients satisfaits te recommandent, ta présence en ligne te ramène des contacts, chaque machine installée en amène une autre.",
      },
      { type: "h3", text: "La vraie clé : laisse le temps faire le travail" },
      {
        type: "p",
        text: "Tu fais les listes, tu envoies les messages, tu passes les appels, tu postes sur les réseaux. Ta part du travail. Et le temps s'occupe du reste — la confiance se construit, la réputation grandit, les recommandations arrivent. Beaucoup abandonnent trop tôt parce qu'ils veulent tout, tout de suite. Ceux qui réussissent font le travail, régulièrement, et laissent le temps transformer les efforts en résultats.",
      },
    ],
  },
  {
    id: 3,
    title: "Le matériel : machines, fournisseurs, installation",
    image: "part3.png",
    blocks: [
      { type: "h3", text: "Ne commence pas avec du neuf" },
      {
        type: "p",
        text: "L'erreur classique du débutant : vouloir démarrer avec des machines neuves. Une machine neuve, c'est beaucoup d'argent pour gagner peu au début — donc beaucoup de risque.",
      },
      {
        type: "p",
        text: "Moi, j'ai commencé avec des machines d'occasion : des Jura, des Saeco. L'avantage est énorme : pour le prix d'une seule machine neuve, tu peux en avoir plusieurs d'occasion. Tu multiplies tes points de vente sans exploser ton budget, et tu limites la casse si un emplacement ne marche pas.",
      },
      {
        type: "p",
        text: "Tu montes en gamme après, une fois que t'as un bon parc qui tourne. À ce moment-là, tu as les revenus pour te le permettre, et le risque n'est plus le même.",
      },
      {
        type: "tip",
        title: "La règle",
        text: "D'abord le volume et l'expérience avec de l'occasion, ensuite la montée en gamme avec du neuf.",
      },
      { type: "h3", text: "Les machines que j'utilise aujourd'hui" },
      {
        type: "p",
        text: "Aujourd'hui je travaille avec des Gaggia G100. C'est du Necta, le numéro 1 du secteur — des machines très complètes et fiables. Bientôt les G50 vont sortir : plus petites, moins chères. Un bon plan à surveiller pour les emplacements plus modestes ou pour démarrer.",
      },
      { type: "h3", text: "Où acheter" },
      {
        type: "p",
        text: "Pour les machines et les consommables, l'important c'est de te construire un réseau de fournisseurs de confiance. C'est justement le cœur de mon accompagnement complet : je te donne mes contacts directs, ceux avec qui j'ai négocié mes prix, pour que tu partes avec des années d'avance.",
      },
      { type: "h3", text: "Les boissons : achète malin" },
      {
        type: "p",
        text: "Ta marge dépend directement du prix auquel tu achètes tes consommables. La meilleure manière de payer moins cher : être à l'affût des actions (promotions) dans les grandes surfaces.",
      },
      {
        type: "tip",
        title: "L'astuce Profital",
        text: "Utilise l'application Profital : elle regroupe tous les prospectus et promos des magasins. Tu ne loupes plus une seule action, et tu achètes ton café, ton lait et ton chocolat au meilleur prix. Chaque centime gratté sur l'achat, c'est un centime de marge en plus sur chaque tasse.",
      },
    ],
  },
  {
    id: 4,
    title: "La gestion au quotidien",
    image: "part4.png",
    blocks: [
      {
        type: "p",
        text: "Une fois tes machines installées, le business tourne presque tout seul. Presque. Voici comment je gère mon parc au quotidien pour que tout roule sans mauvaise surprise.",
      },
      { type: "h3", text: "Le rinçage automatique : ton assurance-vie" },
      {
        type: "p",
        text: "Le point le plus important de toute la machine, c'est le mixeur. C'est lui qui prépare les boissons lactées, et c'est lui qui s'encrasse le plus vite.",
      },
      {
        type: "tip",
        title: "L'astuce qui change tout",
        text: "Programme tes machines pour faire un rinçage automatique du mixeur deux fois par jour, à 7h et à 23h par exemple. Les horaires se règlent avec le commerçant selon ce qui l'arrange. Le nettoyage le plus critique se fait tout seul, tous les jours, sans que tu aies à passer.",
      },
      { type: "h3", text: "La tournée mensuelle" },
      {
        type: "p",
        text: "Une fois par mois, je fais ma tournée en voiture, tranquillement. Je passe chez tout le monde pour remettre les compteurs à zéro (la base de la facturation). Et j'en profite pour laisser du stock à chaque machine :",
      },
      { type: "bullet", text: "3 sachets de café (4 si ça consomme beaucoup)" },
      { type: "bullet", text: "4 paquets de gobelets" },
      { type: "bullet", text: "2 sachets de chocolat" },
      { type: "bullet", text: "2 sachets de lait" },
      {
        type: "tip",
        title: "Rendement des sachets",
        text: "1 sachet de lait ou de chocolat ≈ 45 boissons. 1 sachet de café ≈ 150 tasses. Le nombre dépend du grammage : pour un espresso, mets 7 grammes. Si besoin, resserre la meule pour affiner la mouture — plus fin = meilleure extraction.",
      },
      { type: "h3", text: "L'entretien : qui fait quoi" },
      {
        type: "p",
        text: "Toutes les deux semaines, je passe pour l'entretien. Mais le gros du nettoyage quotidien est déjà géré par le rinçage automatique du mixeur.",
      },
      { type: "p", text: "Ce que le commerçant fait (le strict minimum) :" },
      { type: "bullet", text: "Vider et nettoyer le bac à marc" },
      { type: "bullet", text: "Vider le bac à eau usée" },
      { type: "p", text: "Ce que toi tu gères :" },
      { type: "bullet", text: "L'entretien plus poussé toutes les deux semaines" },
      { type: "bullet", text: "Le réglage de la meule et du grammage" },
      { type: "bullet", text: "Ajouter un filtre à eau — essentiel contre le tartre" },
      {
        type: "p",
        text: "Le filtre évite l'accumulation de tartre, l'ennemi numéro 1 des machines à café. Une machine détartrée et filtrée dure des années. Une machine négligée tombe en panne et te coûte cher.",
      },
    ],
  },
  {
    id: 5,
    title: "Les chiffres réels",
    image: "part5.png",
    blocks: [
      {
        type: "p",
        text: "Maintenant, on met tout ensemble. Pas de chiffres gonflés, pas de promesses en l'air — juste les vrais chiffres de mon activité, pour que tu voies le potentiel réel avant de te lancer.",
      },
      { type: "h3", text: "Rappel des données de base" },
      { type: "bullet", text: "Prix d'une machine (Gaggia G100) : 2 500 à 3 000 CHF (neuf, fournisseur)" },
      { type: "bullet", text: "Ton coût par tasse : environ 12 centimes" },
      { type: "bullet", text: "Ce que tu factures : 0,85 CHF par tasse (ton prix, à ajuster)" },
      { type: "bullet", text: "Ta marge par tasse : environ 73 centimes" },
      { type: "h3", text: "Le vrai volume : tout dépend de l'emplacement" },
      {
        type: "p",
        text: "Voici la vérité que personne ne te dit : le même modèle de machine peut faire du simple au triple selon où tu la poses. Sur mon parc, une machine fait de 250 tasses/mois au minimum à 800 tasses/mois au maximum. Même machine. La différence, c'est uniquement l'emplacement.",
      },
      { type: "bullet", text: "Faible — 250 tasses → ~182 CHF/mois de marge" },
      { type: "bullet", text: "Moyen — 500 tasses → ~365 CHF/mois de marge" },
      { type: "bullet", text: "Fort — 800 tasses → ~584 CHF/mois de marge" },
      { type: "h3", text: "Le point mort : quand la machine est remboursée" },
      { type: "p", text: "Sur une machine à 2 750 CHF (prix moyen) :" },
      { type: "bullet", text: "Machine faible (~182 CHF/mois) : remboursée en ~15 mois" },
      { type: "bullet", text: "Machine moyenne (~365 CHF/mois) : remboursée en ~7-8 mois" },
      { type: "bullet", text: "Machine forte (~584 CHF/mois) : remboursée en ~5 mois" },
      {
        type: "p",
        text: "Et rappelle-toi : avec de l'occasion au démarrage, ton point mort tombe encore plus vite, parfois en 2-3 mois.",
      },
      { type: "h3", text: "La vraie puissance : le parc de machines" },
      {
        type: "p",
        text: "Une machine, c'est bien. Mais le business se révèle quand tu multiplies les machines. Comme le travail par machine est léger (une tournée mensuelle), tu peux en gérer beaucoup.",
      },
      {
        type: "tip",
        title: "Projection sur un parc",
        text: "10 machines × 400 tasses/mois = 4 000 tasses → ~2 920 CHF/mois de marge. 20 machines à la même moyenne → ~5 840 CHF/mois de marge. Le tout pour, en gros, une tournée mensuelle bien organisée.",
      },
      { type: "h3", text: "Ce qu'il faut retenir" },
      { type: "bullet", text: "Tu investis une fois par machine, tu gagnes chaque mois pendant des années." },
      { type: "bullet", text: "L'emplacement fait toute la différence — vise les bons spots." },
      { type: "bullet", text: "Commence en occasion pour limiter le risque, monte en gamme ensuite." },
      { type: "bullet", text: "Le vrai levier, c'est le nombre de machines, pas le prix par tasse." },
      {
        type: "p",
        text: "Le café en dépôt gratuit, c'est un des rares business où tu peux partir petit, avec peu de risque, et construire quelque chose de solide et récurrent. À toi de jouer.",
      },
    ],
  },
];
