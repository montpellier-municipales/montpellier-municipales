export type QuizOption = {
  candidateId: "michael-delafosse" | "la-france-insoumise";
  title: string;
  content: string;
  measureSlug: string;
};

export type QuizQuestion = {
  question: string;
  options: [QuizOption, QuizOption];
};

export const QUESTIONS: QuizQuestion[] = [
  // 1. sécurité Q1
  {
    question:
      "La sûreté de nos concitoyen·nes est un droit fondamental qui exige des politiques sérieuses. Par quels moyens ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Construire une police municipale de proximité",
        content:
          "Refonder la police municipale autour de la tranquillité publique, de la médiation et du lien avec les habitant·es. Mettre fin à la vidéoverbalisation, au harcèlement répressif et à l'armement létal des policiers municipaux. Donner la priorité aux patrouilles à pied, à l'écoute et à la résolution non violente des conflits.",
        measureSlug: "construire-une-police-municipale-de-proximite",
      },
      {
        candidateId: "michael-delafosse",
        title:
          "+100 agents recrutés pour votre sécurité et doublement du nombre de caméras",
        content:
          "Votre sécurité sera renforcée par le recrutement de 100 agents supplémentaires sur le mandat, affectés à la Police municipale, à la Police métropolitaine des transports et à la Brigade du logement social. En parallèle, le nombre de caméras de vidéoprotection sera doublé sur tout le territoire.",
        measureSlug: "100-agents-securite-cameras",
      },
    ],
  },
  // 2. transport et mobilités
  {
    question:
      "Pour des déplacements plus écologiques à Montpellier : quelle priorité ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Renforcer massivement l’offre de transports collectifs",
        content:
          "Renforcer la desserte et la densité du réseau de tramway, de bus et de bus en site propre, notamment aux heures de forte affluence, afin de réduire les temps d’attente, améliorer la régularité et absorber l’augmentation de la fréquentation liée à la gratuité. Investir dans l’acquisition de nouvelles rames de tramway et dans le développement des infrastructures nécessaires pour augmenter durablement la capacité du réseau et améliorer le confort des usager·es.",
        measureSlug: "renforcer-massivement-l-offre-de-transports-collectifs",
      },
      {
        candidateId: "michael-delafosse",
        title: "Étendre le Bustram à tous les quartiers",
        content:
          "Après la mise en service de la 1re ligne de bustram en 2025, le maillage du territoire se finalisera grâce à 5 nouvelles lignes programmées sur le prochain mandat, pour connecter tous les quartiers de la métropole à un service de transport rapide et fréquent.",
        measureSlug: "bustram-tous-quartiers",
      },
    ],
  },
  // 3. logement (existing)
  {
    question:
      "Dormir dehors n'est pas une fatalité : nous voulons éradiquer le sans-abrisme ! Comment ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Réquisitionner les logements durablement vacants pour répondre à l'urgence sociale",
        content:
          "S'appuyer sur le guichet unique du droit au logement pour identifier ces logements, accompagner les procédures et sécuriser juridiquement les réquisitions. Remettre rapidement ces logements à disposition des personnes mal logées.",
        measureSlug:
          "mettre-en-oeuvre-la-requisition-des-logements-durablement-vacants-pour-repondre",
      },
      {
        candidateId: "michael-delafosse",
        title: "Mobiliser les bâtiments vacants pour l'habitat intercalaire",
        content:
          "Nous travaillerons à l'identification et à la mobilisation des bâtiments vacants afin de soutenir les dispositifs d'habitat intercalaire. Cette démarche apportera des réponses temporaires et adaptées aux besoins urgents de logement, tout en évitant la dégradation du bâti inoccupé.",
        measureSlug: "dignite-contre-exclusions",
      },
    ],
  },
  // 4. alimentation
  {
    question:
      "Pour une alimentation saine et locale accessible à toutes et tous : quelle stratégie ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Protéger les terres agricoles et construire une ceinture nourricière autour de Montpellier",
        content:
          "Face à l'artificialisation des sols, à la spéculation foncière et au vieillissement du monde agricole, nous faisons de l'agriculture périurbaine un pilier de la transition écologique, alimentaire et sociale du territoire. Sanctuariser les terres agricoles et naturelles pour préserver durablement les terres nourricières. Créer une foncière agricole, outil public de portage foncier pour sortir les terres de la spéculation.",
        measureSlug:
          "proteger-les-terres-agricoles-et-construire-une-ceinture-nourriciere-autour-de-m",
      },
      {
        candidateId: "michael-delafosse",
        title: "Agir pour une alimentation solidaire et durable",
        content:
          "Aménager huit Maisons de l'alimentation solidaire (MAS) dans tous les quartiers pour lutter contre la précarité alimentaire. Viser 100 % de bio, local et labellisé dans les cantines, avec un matériel réutilisable en inox. Ouvrir la Cité de l'alimentation dans le quartier Montpellier Sud en 2028, lieu unique en France dédié à l'alimentation durable et solidaire.",
        measureSlug: "alimentation-solidaire-durable",
      },
    ],
  },
  // 5. enfance et éducation
  {
    question:
      "L'école doit réduire les inégalités entre les enfants. Quelle est la priorité ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Fournir des fournitures scolaires gratuites",
        content:
          "Allouer à tous les élèves une dotation standard de fournitures scolaires gratuites afin de garantir l'égalité entre enfants et de soulager les familles des dépenses de la rentrée scolaire.",
        measureSlug: "fournir-des-fournitures-scolaires-gratuites",
      },
      {
        candidateId: "michael-delafosse",
        title: "École dehors, droit aux loisirs et ouverture sur le monde",
        content:
          "En soutien aux professeurs, nous ferons du droit aux loisirs, de l'éducation dehors et de l'ouverture sur le monde des priorités éducatives à part entière, en offrant à chaque enfant des espaces d'apprentissage en plein air, accessibles dans tous les quartiers.",
        measureSlug: "ecole-dehors-loisirs",
      },
    ],
  },
  // 6. santé
  {
    question:
      "L'accès aux soins est un droit fondamental : comment mettre fin aux déserts médicaux ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Créer des centres de santé municipaux",
        content:
          "Créer des centres de santé municipaux pour mettre fin aux déserts médicaux, en particulier dans les quartiers populaires, avec des médecins salarié·es, sans paiement à l'acte ni dépassement d'honoraire. Les généralistes côtoieront les spécialistes en pénurie : ophtalmologues, gynécologues, rhumatologues, infirmiers, kinésithérapeutes, psychologues.",
        measureSlug: "creation-de-centres-de-sante-municipaux",
      },
      {
        candidateId: "michael-delafosse",
        title: "Faire de Montpellier une ville santé",
        content:
          "Dans le prochain mandat, nous soutiendrons l'implantation d'une antenne du CHU de Montpellier à la Mosson, sur le site de l'ancienne tour d'Assas. Cet équipement de proximité permettra d'améliorer l'accès aux soins dans ce quartier et de renforcer la présence médicale là où elle est la plus attendue.",
        measureSlug: "ville-sante",
      },
    ],
  },
  // 7. démocratie
  {
    question:
      "Les citoyen·nes doivent avoir leur mot à dire dans les décisions municipales. Comment ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Créer une assemblée citoyenne montpelliéraine",
        content:
          "Convoquer une assemblée citoyenne chargée de rédiger la charte d'engagement des élu·es du conseil municipal, précisant les droits des Montpelliérain·es sur leur commune (RIC, droit de pétition, révocation…). Cette charte sera soumise à une votation citoyenne avant d'être portée à la signature de chaque membre du conseil municipal.",
        measureSlug:
          "creer-une-assemblee-citoyenne-montpellieraine-pour-preparer-la-6e-republique-a-l",
      },
      {
        candidateId: "michael-delafosse",
        title: "Chaque citoyen partie prenante",
        content:
          "Nous mettrons en place plusieurs conventions citoyennes afin d'associer directement les habitants à la réflexion et à la décision sur des sujets structurants. Elles reposeront sur des principes exigeants : transparence des travaux, composition réellement représentative, neutralité de l'animation et restitution publique des conclusions.",
        measureSlug: "citoyen-partie-prenante",
      },
    ],
  },
  // 8. solidarité
  {
    question:
      "Comment soutenir les Montpelliérain·es en difficulté économique ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Plan métropolitain « 10 000 emplois non-délocalisables pour une économie qui répond aux besoins »",
        content:
          "Réorienter l'agence de développement économique pour financer les secteurs d'avenir du territoire : mobilités douces, énergie solaire, alimentation locale, rénovation du bâti, économie circulaire. Favoriser un écosystème public d'appui à l'emploi local et à l'économie sociale et solidaire (ESS), en mobilisant l'investissement et la commande publique.",
        measureSlug:
          "plan-metropolitain-10-000-emplois-non-delocalisables-pour-une-economie-qui-repon",
      },
      {
        candidateId: "michael-delafosse",
        title: "Créer un Office du pouvoir d'achat pour agir concrètement",
        content:
          "À l'image de la mutuelle communale, nous créerons un Office du pouvoir d'achat pour permettre aux Montpelliéraines et Montpelliérains de réduire leurs dépenses du quotidien grâce à la force du collectif : achats groupés, négociations tarifaires, accès à des offres préférentielles.",
        measureSlug: "office-pouvoir-achat",
      },
    ],
  },
  // 9. environnement
  {
    question:
      "Nous devons adapter notre ville au changement climatique. Comment ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Désimperméabiliser la ville et anticiper les risques d'inondations",
        content:
          "Lancer un plan de désimperméabilisation des sols. Généraliser l'utilisation de matériaux perméables et novateurs lors des nouveaux projets de voirie. Revoir le plan de prévention des risques d'inondation afin de l'adapter aux risques actuels de crue sur la commune.",
        measureSlug:
          "desimpermeabiliser-la-ville-et-anticiper-les-risques-inondations",
      },
      {
        candidateId: "michael-delafosse",
        title: "Végétaliser toujours davantage la ville",
        content:
          "Pour faire de Montpellier une véritable « Ville Parc », nous changeons d'échelle en matière d'agriculture urbaine et de proximité. Dans le prochain mandat, nous nous fixons l'objectif ambitieux de créer 1 000 nouvelles parcelles de jardins familiaux et de tripler le nombre d'arbres plantés dans l'espace public.",
        measureSlug: "vegetaliser-la-ville",
      },
    ],
  },
  // 10. changement climatique
  {
    question:
      "Montpellier peut être à la pointe de la transition énergétique. Par quels moyens ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Créer une régie publique de l'énergie : Énergie de Montpellier (EDM)",
        content:
          "Énergie de Montpellier est un opérateur public local de l'énergie au service de l'intérêt général. Il fournit une électricité 100 % renouvelable, à prix stables, lisibles et solidaires, sans logique de profit. Il investit et planifie le développement des énergies renouvelables locales, en priorité le solaire et les réseaux de chaleur.",
        measureSlug:
          "engager-la-bifurcation-energetique-communale-grace-a-la-creation-d-une-regie-de",
      },
      {
        candidateId: "michael-delafosse",
        title: "Se mobiliser pour une énergie verte et accessible",
        content:
          "Nous mettrons en place un fonds de garantie à taux 0 % pour soutenir les projets d'autoconsommation collective, associant habitants, acteurs économiques et collectivités. Forts d'un patrimoine municipal et métropolitain d'environ un million de mètres carrés, nous exploiterons les toitures de nos bâtiments pour produire de l'énergie solaire.",
        measureSlug: "energie-verte-accessible",
      },
    ],
  },
  // 11. gestion de l'eau
  {
    question:
      "L'eau est un bien commun précieux : comment assurer sa gestion durable ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Favoriser la captation et la réutilisation des eaux de pluie",
        content:
          "Développer des infrastructures de réutilisation des eaux de pluie, ralentir l'écoulement de l'eau pour réhydrater les sols et limiter les risques liés aux sécheresses et aux inondations. Généraliser l'usage de matériaux et espaces favorisant l'infiltration dans tous les projets d'aménagement urbain.",
        measureSlug:
          "favoriser-la-captation-et-la-reutilisation-des-eaux-de-pluie",
      },
      {
        candidateId: "michael-delafosse",
        title: "Chemin de l'Aqueduc",
        content:
          "Nous aménagerons près de 5 km de parcours continu, végétalisé et balisé le long de l'Aqueduc Saint-Clément, des Arceaux à Alco, afin de permettre à toutes et tous de se réapproprier cet espace emblématique de leur patrimoine, en lien avec la gestion de l'eau et l'histoire de la ville.",
        measureSlug: "chemin-aqueduc",
      },
    ],
  },
  // 12. déchets
  {
    question: "Une ville sobre en déchets : quelle stratégie ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Mener une Convention populaire sur la stratégie « zéro déchets »",
        content:
          "Organiser une Convention populaire des déchets, associant largement les habitants avec une partie de tirage au sort, chargée de porter un regard global sur la politique déchets. Les scénarios étudiés devront inclure obligatoirement des solutions locales aux exutoires, et les conclusions seront soumises à une votation citoyenne.",
        measureSlug:
          "mener-une-convention-populaire-sur-la-strategie-zero-dechets",
      },
      {
        candidateId: "michael-delafosse",
        title:
          "Mettre en place une unité de valorisation énergétique des déchets (CSR)",
        content:
          "Mettre en place à Montpellier une unité de production de combustible solide de récupération (CSR) sur le site de Usine Amétyst afin de valoriser les déchets non recyclables. Cette installation permettra de transformer une partie des déchets résiduels en énergie, plutôt que de les enfouir ou de les exporter.",
        measureSlug: "unite-valorisation-energetique-dechets-csr",
      },
    ],
  },
  // 13. culture
  {
    question: "La culture doit rayonner dans toute la ville. Quelle priorité ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Démocratiser la programmation culturelle municipale",
        content:
          "Développer des dispositifs d'implication citoyenne dans la programmation culturelle municipale, notamment dans les domaines du cinéma, du théâtre et des musées, en soutenant la vie associative, les ciné-clubs et les démarches d'éducation populaire.",
        measureSlug: "democratiser-la-programmation-culturelle-municipale",
      },
      {
        candidateId: "michael-delafosse",
        title: "Faire rayonner la ville par nos institutions culturelles",
        content:
          "L'extension du musée Fabre permettra d'accompagner son bicentenaire en lui donnant les moyens d'accueillir davantage d'œuvres, d'expositions et de publics. Ce projet renforcera son rayonnement national et international et fera de Montpellier une destination culturelle de premier plan.",
        measureSlug: "rayonner-institutions-culturelles",
      },
    ],
  },
  // 14. bien être animal
  {
    question:
      "Le bien être animal est un impératif éthique : il exige des politiques ambitieuses. Lesquelles ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Intégrer le bien-être animal dans la commande publique",
        content:
          "Intégrer systématiquement des critères de bien-être animal dans la commande publique alimentaire. Bannir les produits impliquant nécessairement la souffrance animale lors des réceptions municipales. Instaurer une option végétarienne quotidienne à la cantine ne comportant ni viande ni poisson, et une journée végétalienne hebdomadaire.",
        measureSlug: "integrer-le-bien-etre-animal-dans-la-commande-publique",
      },
      {
        candidateId: "michael-delafosse",
        title: "S'engager pour le bien-être animal",
        content:
          "L'ouverture d'un centre de soin de la faune sauvage permettra de recueillir, soigner et réhabiliter les animaux blessés ou fragilisés, tout en sensibilisant le public à la protection de la biodiversité. Cet équipement contribuera à renforcer la prise en compte du vivant dans la ville.",
        measureSlug: "bien-etre-animal",
      },
    ],
  },
  // 15. sport
  {
    question:
      "Le sport doit être accessible à toutes et tous dans notre ville. Comment ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Mettre fin à l'usage de la charte de la laïcité comme outil d'exclusion",
        content:
          "Mettre fin à l'utilisation de la charte municipale de la laïcité comme condition d'accès aux salles, aux subventions ou aux partenariats municipaux. La remplacer par une charte de lutte contre les discriminations, le racisme et les violences sexistes et sexuelles au sein des associations montpelliéraines.",
        measureSlug:
          "mettre-fin-a-l-usage-de-la-charte-de-la-laicite-comme-outil-d-exclusion",
      },
      {
        candidateId: "michael-delafosse",
        title: "Incarner l'esprit des Jeux Olympiques",
        content:
          "Un Plan Sports 2035 fixera une feuille de route ambitieuse pour développer les infrastructures sportives, avec la construction de nouveaux gymnases. Montpellier doit tenir son rang de ville la plus sportive de France en investissant dans les équipements, en soutenant les clubs et en développant la pratique à tous les niveaux.",
        measureSlug: "esprit-jeux-olympiques",
      },
    ],
  },
  // 16. sécurité Q2
  {
    question:
      "Notre priorité : lutter contre les VSS dans l'espace public comme au sein des foyers. Comment ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title: "Mettre en place un dispositif municipal d'accueil des victimes",
        content:
          "Nous renforcerons la Maison des femmes pour en faire un centre municipal féministe, lieu identifié et accessible, dédié à la prévention, à l'autonomie et à la protection des femmes. Ce centre proposera un guichet unique d'accompagnement des femmes victimes de violences, avec une permanence juridique gratuite, en non-mixité, et un numéro municipal dédié.",
        measureSlug:
          "mettre-en-place-un-dispositif-municipal-d-accueil-des-victimes",
      },
      {
        candidateId: "michael-delafosse",
        title: "Affirmer une politique de prévention",
        content:
          "Pour garantir à chaque Montpelliéraine le droit de circuler sereinement, nous ferons de la sécurité des femmes dans l'espace public une priorité transversale. Nous poursuivrons et généraliserons les arrêts de bus à la demande le soir, et mènerons des actions de sensibilisation ciblées contre les violences sexistes et sexuelles.",
        measureSlug: "politique-prevention",
      },
    ],
  },
  // 17. handicap et accessibilité
  {
    question:
      "Rendre Montpellier pleinement accessible aux personnes en situation de handicap : comment ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Mettre en œuvre un plan pluriannuel d'accessibilité des locaux et infrastructures publiques",
        content:
          "Mettre en place dès la première année du mandat un plan pluriannuel d'accessibilité couvrant l'ensemble des locaux et infrastructures publics, en intégrant tous les types de handicaps, y compris sensoriels, psychiques et cognitifs.",
        measureSlug:
          "mettre-en-oeuvre-un-plan-pluriannuel-d-accessibilite-des-locaux-et-infrastructur",
      },
      {
        candidateId: "michael-delafosse",
        title:
          "Travailler à l'amélioration du service de transport des personnes en situation de handicap",
        content:
          "Nous travaillerons à l'amélioration du service de transport des personnes en situation de handicap, en partenariat notamment avec le GIHP qui, chaque matin, permet déjà à près de 200 enfants en situation de handicap d'être conduits à l'école.",
        measureSlug: "accessibilite-universelle",
      },
    ],
  },
  // 18. relations internationales et paix
  {
    question:
      "Quelle doit être la politique internationale de Montpellier ?",
    options: [
      {
        candidateId: "la-france-insoumise",
        title:
          "Faire de Montpellier une ville de paix, engagée pour le respect du droit international",
        content:
          "Suspendre le jumelage avec la ville de Tibériade tant que le droit international ne sera pas respecté, en solidarité avec le peuple palestinien. Adopter une charte municipale des relations internationales exigeant que tout jumelage ou partenariat respecte strictement le droit international et les droits humains. Affirmer une politique municipale clairement engagée en faveur de la paix, du dialogue entre les peuples et de la solidarité internationale, en refusant toute complaisance avec les politiques de guerre, de colonisation ou d'oppression.",
        measureSlug:
          "rompre-le-jumelage-avec-tiberiade-et-conditionner-les-jumelages-au-respect-du-dr",
      },
      {
        candidateId: "michael-delafosse",
        title: "Soutien inconditionnel à Israël",
        content:
          "Faire de la ville un soutien politique clair et constant à l'État d'Israël dans ses relations internationales et ses partenariats.",
        measureSlug: "soutien-inconditionnel-israel",
      },
    ],
  },
];
