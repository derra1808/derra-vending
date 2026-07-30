/** Textes sources des bonus PDF */
export const BONUS_CONTRAT = {
  title: "Contrat type — Café en dépôt gratuit",
  subtitle: "Modèle à adapter — Derra Vending · Suisse & Europe",
  sections: [
    {
      h: "1. Parties",
      body: `Entre :
L’OPÉRATEUR : _________________________________ (nom / raison sociale), domicilié(e) à _________________________________, ci-après « l’Opérateur ».

Et :
L’HÔTE : _________________________________ (commerce / entreprise), sis à _________________________________, représenté(e) par _________________________________, ci-après « l’Hôte ».`,
    },
    {
      h: "2. Objet",
      body: `L’Opérateur met à disposition de l’Hôte, à titre gratuit, une machine à café professionnelle (ci-après « la Machine »), installée à l’adresse : _________________________________.

L’Hôte autorise l’installation et l’exploitation de la Machine dans son établissement au profit de ses clients et/ou collaborateurs.`,
    },
    {
      h: "3. Propriété",
      body: `La Machine reste la propriété exclusive de l’Opérateur. L’Hôte ne peut ni la déplacer, ni la céder, ni la modifier sans accord écrit.`,
    },
    {
      h: "4. Prix et facturation",
      body: `L’Hôte vend les boissons au prix qu’il fixe librement.
Chaque mois, l’Opérateur relève le compteur de la Machine et facture à l’Hôte : _______ CHF par tasse consommée (prix indicatif terrain : 0,85 CHF — à adapter).
Paiement sous _______ jours dès réception de la facture.`,
    },
    {
      h: "5. Consommables & entretien",
      body: `L’Opérateur fournit les consommables nécessaires (café, lait, chocolat, gobelets, etc.) selon les modalités convenues.
L’Hôte assure le minimum quotidien : vider le bac à marc et le bac à eau usée.
L’Opérateur assure l’entretien technique périodique et le réapprovisionnement.`,
    },
    {
      h: "6. Électricité & accès",
      body: `L’Hôte met à disposition une prise électrique adaptée. Les frais d’électricité courants sont à la charge de l’Hôte, sauf accord contraire.
L’Opérateur a accès à la Machine pendant les heures d’ouverture pour entretien, relevé et réappro.`,
    },
    {
      h: "7. Assurance",
      body: `L’Opérateur assure la Machine contre casse, vol et incendie dans le cadre de son activité. L’Hôte signale immédiatement tout incident.`,
    },
    {
      h: "8. Durée & résiliation",
      body: `Contrat à durée indéterminée / déterminée : ______________.
Résiliation possible par chaque partie avec un préavis d’un (1) mois par écrit (email accepté).
Aucun minimum de consommation. Pas d’exclusivité sauf accord écrit.`,
    },
    {
      h: "9. Droit applicable",
      body: `Droit du pays où est installée la Machine (ex. Suisse, France, Belgique…). For : tribunaux du domicile de l’Hôte, sauf accord contraire.
Document type fourni à titre informatif — adapter les mentions légales à ton pays et faire valider par un professionnel si besoin.`,
    },
    {
      h: "10. Signatures",
      body: `Fait à _______________, le ___ / ___ / ______

L’Opérateur                          L’Hôte
________________                     ________________
Nom :                                Nom :
`,
    },
  ],
};

export const BONUS_SCRIPTS = {
  title: "Scripts prospection — Café en dépôt gratuit",
  sections: [
    {
      h: "Message WhatsApp / SMS (entourage)",
      body: `Salut [Prénom], c’est [Ton prénom].

Je place des machines à café professionnelles en dépôt gratuit chez les commerces / entreprises de [ta ville / ta région].

Toi tu n’as rien à payer : j’installe, je fournis le café, j’entretiens. Tu vends le café à tes clients au prix que tu veux. Une fois par mois je relève le compteur et je te facture seulement les tasses consommées.

Tu aurais 2 minutes cette semaine pour que je te montre comment ça marche ?`,
    },
    {
      h: "Porte-à-porte (30 secondes)",
      body: `Bonjour, je suis [Prénom], Derra Vending.

Je place des machines à café en dépôt gratuit — zéro frais pour vous, zéro engagement long. Vos clients / équipes ont un café sur place, je m’occupe de tout.

Qui gère les services / l’accueil ici ? Je peux laisser mon numéro ou passer 5 minutes quand ça vous arrange.`,
    },
    {
      h: "Appel téléphonique",
      body: `Bonjour [Prénom / Société], [Ton prénom] de Derra Vending.

Je vous appelle parce que j’installe des machines à café professionnelles sans loyer ni achat de machine de votre côté. Vous facturez le café comme vous voulez ; moi je facture uniquement la consommation.

Est-ce que vous avez déjà une solution café pour vos clients / collaborateurs ?
→ Si non : je passe 10 minutes avec une photo de la machine et un exemple de facture.
→ Si oui : pas de souci — si un jour vous voulez comparer, je reste dispo.`,
    },
    {
      h: "Objections fréquentes",
      body: `« On a déjà une machine »
Parfait. La mienne est en dépôt gratuit, entretien inclus. Si un jour la vôtre tombe en panne ou le contrat se termine, gardez mon contact.

« Pas de place »
Il faut souvent moins d’1 m² + une prise. Je viens voir sur place, sans engagement.

« On verra plus tard »
Ok. Je vous envoie un résumé en 5 lignes par WhatsApp. Je rappelle dans 10 jours — ça vous va ?

« C’est combien pour nous ? »
Zéro à l’installation. Vous payez seulement les tasses consommées, une fois par mois. S’il y a peu de ventes, vous payez peu.`,
    },
    {
      h: "Après le « oui »",
      body: `1. Envoyer le contrat type rempli
2. Fixer date d’installation
3. Photo de l’emplacement + prise
4. Confirmer prix/tasse et horaires d’accès
5. Installer + 3 ventes test avec l’hôte
6. Noter dans ton tableur : adresse, contact, date, compteur départ`,
    },
  ],
};

export const BONUS_CHECKLIST = {
  title: "Checklist — De zéro à la 1ère machine",
  intro:
    "Coche chaque case quand c’est fait. Les mêmes étapes qu’avant, avec une explication simple sous chaque point.",
  items: [
    {
      title: "Budget machine + stock (occasion possible) noté",
      why: "Écris combien tu peux mettre : machine (même d’occasion) + un peu de café, lait, gobelets. Comme ça tu sais ce que tu peux te permettre avant de te lancer.",
    },
    {
      title: "Liste de 20 cibles (entourage + commerces / entreprises)",
      why: "Note 20 endroits où poser une machine : amis commerçants, salons, restos, bureaux… Plus ta liste est longue, plus tu as de chances d’avoir un « oui ».",
    },
    {
      title: "Message WhatsApp prêt (script)",
      why: "Prépare ton message une fois (voir le PDF Scripts). Ensuite tu n’as plus qu’à l’envoyer — tu ne bloques plus sur « quoi écrire ».",
    },
    {
      title: "Pitch porte-à-porte appris (30 sec)",
      why: "Apprends par cœur 4–5 phrases : qui tu es, dépôt gratuit, zéro frais pour eux. Devant le commerçant, tu n’improvises plus sous le stress.",
    },
    {
      title: "Contrat type imprimé / PDF prêt à remplir",
      why: "Quand quelqu’un dit oui, tu sors le contrat tout de suite. Pas de « je te le renvoie plus tard » — tu transformes le oui en engagement.",
    },
    {
      title: "Fournisseur café / lait / gobelets identifié (ou liste de critères)",
      why: "Savoir où tu achètes (magasin, cash & carry, fournisseur) avant la pose. Sinon tu poses la machine et tu galères pour la remplir.",
    },
    {
      title: "App Profital installée pour les promos",
      why: "Profital montre les promos des grandes surfaces. Tu achètes le café et le lait moins cher → ta marge par tasse augmente.",
    },
    {
      title: "Tableur ouvert : emplacement | contact | tasses | CA | marge",
      why: "Un simple Excel / Google Sheet pour suivre chaque machine : où, qui, combien de tasses, combien tu gagnes. Sans ça, tu pilotes à l’aveugle.",
    },
    {
      title: "10 messages / visites faits cette semaine",
      why: "Objectif concret : 10 contacts cette semaine (WhatsApp ou porte-à-porte). Le business démarre quand tu agis, pas quand tu attends le client parfait.",
    },
    {
      title: "1er « oui » obtenu (même petit commerce)",
      why: "Le premier oui compte plus que le « commerce parfait ». Un petit salon ou une petite boîte = ton terrain d’essai pour apprendre.",
    },
    {
      title: "Date d’installation fixée",
      why: "Un oui sans date = souvent un oui qui s’évapore. Fixe jour et heure tout de suite avec le commerçant.",
    },
    {
      title: "Machine testée 20 cycles avant pose",
      why: "Fais ~20 cafés chez toi avant d’installer. Tu vérifies que tout marche (eau, gobelets, goût) — zéro galère le jour J chez le client.",
    },
    {
      title: "Prix/tasse et facturation expliqués à l’hôte",
      why: "Dis clairement : « Je te facture X par tasse, une fois par mois, selon le compteur. » Comme ça pas de surprise ni de dispute plus tard.",
    },
    {
      title: "Rinçage auto programmé (ex. 7h et 23h)",
      why: "La machine se nettoie seule 2× par jour. Ça évite que le mixeur s’encrasse et que la machine tombe en panne.",
    },
    {
      title: "1ère tournée + 1ère facture planifiées (J+30)",
      why: "Dans ton agenda : dans 30 jours, tu repasses, tu releves le compteur, tu fais la facture. C’est comme ça que tu encaisses vraiment.",
    },
  ],
};
