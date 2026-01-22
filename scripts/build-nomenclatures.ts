import { writeFileSync } from "node:fs";

const OUTPUT_FILE = "src/content/data/budget_nomenclatures.json";

// Extrait du Plan de comptes M57 (Natures) - Inchangé
const rawNatureText = `
10 DOTATIONS, FONDS DIVERS ET RÉSERVES
102 Dotations et fonds d’investissement
1021 Dotations
1022 Fonds d’investissement
10222 F.C.T.V.A.
10223 TICPE 2e part
10226 Taxe d’aménagement
10227 Versement pour sous densité
10228 Autres fonds d’investissement
10229 Reprise sur F.C.T.V.A. et autres fonds d’investissement
1068 Excédents de fonctionnement capitalisés
13 SUBVENTIONS D’INVESTISSEMENT
131 Subventions d’investissement rattachées aux actifs amortissables
1311 État et établissements nationaux
1312 Régions
1313 Départements
1314 Communes
13141 Communes membres du GFP
1318 Autres
132 Subventions d’investissement rattachées aux actifs non amortissables
1321 État et établissements nationaux
1322 Régions
1323 Départements
1324 Communes
1328 Autres
16 EMPRUNTS ET DETTES ASSIMILÉES
163 Emprunts obligataires
164 Emprunts auprès des établissements financiers
1641 Emprunts en euros
1643 Emprunts en devises
1644 Emprunts assortis d’une option de tirage sur ligne de trésorerie
165 Dépôts et cautionnements reçus
167 Emprunts et dettes assortis de conditions particulières
168 Autres emprunts et dettes assimilées
1681 Autres emprunts
1687 Autres dettes
1688 Intérêts courus
20 IMMOBILISATIONS INCORPORELLES
202 Frais d’études, d’élaboration, de modifications et de révisions des documents d’urbanisme
203 Frais d’études, de recherche et de développement et frais d’insertion
2031 Frais d’études
204 Subventions d’équipement versées
2041 Subventions d’équipement aux organismes publics
20411 État
20412 Régions
20413 Départements
20414 Communes
205 Concessions, brevets, licences, marques, procédés, logiciels, droits et valeurs similaires
21 IMMOBILISATIONS CORPORELLES
211 Terrains
2111 Terrains nus
2112 Terrains de voirie
2113 Terrains aménagés autres que voirie
2115 Terrains bâtis
212 Agencements et aménagements de terrains
2121 Plantations d’arbres et d’arbustes
2128 Autres agencements et aménagements
213 Constructions
2131 Bâtiments publics
21311 Bâtiments administratifs
21312 Bâtiments scolaires
21313 Bâtiments sociaux et médico-sociaux
21314 Bâtiments culturels et sportifs
21315 Centres d’incendie et de secours
21318 Autres bâtiments publics
2132 Bâtiments privés
2135 Installations générales, agencements, aménagements des constructions
2138 Autres constructions
214 Constructions sur sol d’autrui
215 Installations, matériel et outillage techniques
2151 Réseaux de voirie
2152 Installations de voirie
2153 Réseaux divers
21531 Réseaux d’adduction d’eau
21532 Réseaux d’assainissement
21533 Réseaux câblés
21534 Réseaux d’électrification
21538 Autres réseaux
2154 Voies navigables
2156 Matériel et outillage d’incendie et de défense civile
2157 Matériel et outillage technique
2158 Autres installations, matériel et outillage techniques
216 Biens historiques et culturels
218 Autres immobilisations corporelles
2181 Installations générales, agencements et aménagements divers
2182 Matériel de transport
2183 Matériel informatique
2184 Matériel de bureau et mobilier
2185 Matériel de téléphonie
2188 Autres
23 IMMOBILISATIONS EN COURS
231 Immobilisations corporelles en cours
2312 Agencements et aménagements de terrains
2313 Constructions
2314 Constructions sur sol d\'autrui
2315 Installations, matériel et outillage techniques
2318 Autres immobilisations corporelles
232 Immobilisations incorporelles en cours
237 Avances versées sur commandes d’immobilisations incorporelles
238 Avances versées sur commandes d’immobilisations corporelles
26 PARTICIPATIONS ET CRÉANCES RATTACHÉES A DES PARTICIPATIONS
27 AUTRES IMMOBILISATIONS FINANCIÈRES
271 Titres immobilisés (droits de propriété)
274 Prêts
275 Dépôts et cautionnements versés
276 Autres créances immobilisées
28 AMORTISSEMENTS DES IMMOBILISATIONS
60 ACHATS ET VARIATION DES STOCKS
601 Achats stockés - Matières premières (et fournitures)
602 Achats stockés - Autres approvisionnements
6021 Matières consommables
6022 Fournitures consommables
60221 Combustibles et carburants
60222 Produits d\'entretien
60223 Fournitures techniques
60224 Fournitures administratives
60225 Livres, disques, cassettes
60226 Habillement et vêtements de travail
60228 Autres fournitures consommables
6023 Fournitures de voirie
6026 Produits pharmaceutiques
6027 Alimentation
603 Variation des stocks
604 Achats d\'études, prestations de services
6042 Achats de prestations de services
605 Achats de matériel, équipements et travaux
606 Achats non stockés de matières et fournitures
6061 Fournitures non stockables
60611 Eau et assainissement
60612 Énergie - Électricité
60613 Chauffage urbain
60618 Autres fournitures
6062 Fournitures non stockées
60621 Combustibles
60622 Carburants
60623 Alimentation
60624 Produits de traitement
60628 Autres fournitures non stockées
6063 Fournitures d\'entretien et de petit équipement
60631 Fournitures d’entretien
60632 Fournitures de petit équipement
60633 Fournitures de voirie
6064 Fournitures administratives
6065 Livres, disques, cassettes
6066 Produits pharmaceutiques
6067 Fournitures scolaires
6068 Autres matières et fournitures
61 SERVICES EXTÉRIEURS
611 Contrats de prestations de services
612 Redevances de crédit-bail
613 Locations
6132 Locations immobilières
6135 Locations mobilières
614 Charges locatives et de copropriété
615 Entretien et réparations
6152 Entretien et réparations sur biens immobiliers
61521 Terrains
61522 Bâtiments
615221 Bâtiments publics
61523 Voies et réseaux
615231 Voiries
615232 Réseaux
6155 Entretien et réparations sur biens mobiliers
61551 Matériel roulant
61558 Autres biens mobiliers
6156 Maintenance
616 Primes d’assurances
617 Études et recherches
618 Divers
6182 Documentation générale et technique
6184 Versements à des organismes de formation
6188 Autres frais divers
62 AUTRES SERVICES EXTÉRIEURS
621 Personnel extérieur au service
622 Rémunérations d’intermédiaires et honoraires
6226 Honoraires
6227 Frais d’actes et de contentieux
6228 Divers
623 Publicité, publications, relations publiques
6231 Annonces et insertions
6232 Fêtes et cérémonies
6233 Foires et expositions
6236 Catalogues et imprimés
6237 Publications
624 Transports de biens et transports collectifs
625 Déplacements et missions
626 Frais postaux et frais de télécommunications
627 Services bancaires et assimilés
628 Divers
6281 Concours divers (cotisations...)
6282 Frais de gardiennage
6283 Frais de nettoyage des locaux
6284 Redevance pour services rendus
6287 Remboursements de frais
6288 Autres
63 IMPÔTS, TAXES ET VERSEMENTS ASSIMILÉS
631 Impôts, taxes et versements assimilés sur rémunérations (administration des impôts)
633 Impôts, taxes et versements assimilés sur rémunérations (autres organismes)
6331 Versement mobilité
6332 Cotisations versées au F.N.A.L.
6336 Cotisations au CNFPT et au centre de gestion
635 Autres impôts, taxes et versements assimilés (administration des impôts)
6351 Impôts directs
63512 Taxes foncières
63513 Autres impôts locaux
6353 Impôts indirects
6354 Droits d’enregistrement et de timbre
6355 Taxes et impôts sur les véhicules
637 Autres impôts, taxes et versements assimilés (autres organismes)
64 CHARGES DE PERSONNEL
641 Rémunérations du personnel
6411 Personnel titulaire
64111 Rémunération principale
64112 Supplément familial de traitement et indemnité de résidence
64118 Autres indemnités
6413 Personnel non titulaire
64131 Rémunérations
6414 Personnel rémunéré à la vacation
6415 Congés payés
6416 Emplois aidés
6417 Rémunérations des apprentis
645 Charges de sécurité sociale et de prévoyance
6451 Cotisations à l\'U.R.S.S.A.F.
6453 Cotisations aux caisses de retraite
6454 Cotisations à l’assurance chômage
6455 Cotisations pour assurance du personnel
6458 Cotisations aux autres organismes sociaux
647 Autres charges sociales
6471 Prestations versées pour le compte du F.N.A.L.
64731 Allocations chômage versées directement
6474 Versements aux œuvres sociales
6475 Médecine du travail, pharmacie
6478 Autres charges sociales diverses
648 Autres charges de personnel
65 AUTRES CHARGES DE GESTION COURANTE
651 Charges d’intervention pour compte propre – Aides à la personne
6511 Allocations
6512 Stagiaires de la formation professionnelle
6513 Bourses, prix et secours
6518 Divers
652 Frais de séjour, frais d’hébergement et frais d’inhumation
653 Indemnités
6531 Indemnités, frais de mission et de formation des élus
65311 Indemnités de fonction
65312 Frais de mission et de déplacement
65313 Cotisations de retraite
65314 Cotisations de sécurité sociale - part patronale
65315 Formation
654 Pertes sur créances irrécouvrables
655 Contributions obligatoires
6551 Dotation de fonctionnement des établissements d\'enseignement secondaire
6553 Service d\'incendie
6554 Dotation de compensation de charges transférées
6556 Contributions aux organismes de regroupement
6558 Autres contributions obligatoires
656 Participations
657 Charges d’intervention pour compte propre - Subventions
6573 Subventions de fonctionnement aux organismes publics
65734 Communes
65735 Groupements de collectivités
65736 Établissements et services rattachés
657362 Budgets annexes et régies
657363 CCAS/CIAS
657364 Caisse des écoles
65737 SNCF
65738 Autres établissements publics
6574 Subventions de fonctionnement aux personnes de droit privé
65741 Ménages
65742 Entreprises
65748 Autres personnes de droit privé
658 Charges diverses de gestion courante
6581 Redevances pour concessions, brevets, licences
6586 Frais de fonctionnement des groupes d’élus
6588 Autres charges diverses de gestion courante
66 CHARGES FINANCIÈRES
661 Charges d\'intérêts
6611 Intérêts des emprunts et dettes
66111 Intérêts réglés à l’échéance
66112 Intérêts - rattachement des ICNE
6615 Intérêts des comptes courants et de dépôts créditeurs
668 Autres charges financières
67 CHARGES SPECIFIQUES
673 Titres annulés (sur exercices antérieurs)
68 DOTATIONS AUX AMORTISSEMENTS, DÉPRÉCIATIONS ET PROVISIONS
681 Dotations aux amortissements et provisions - Charges de fonctionnement
6811 Dotations aux amortissements des immobilisations
686 Dotations aux amortissements et provisions - Charges financières
70 PRODUITS DES SERVICES DU DOMAINE ET VENTES DIVERSES
701 Ventes de produits finis
703 Redevances et recettes d\'utilisation du domaine
7031 Concessions et redevances funéraires
7032 Droits de stationnement et location
70321 Droits de stationnement et de location sur la voie publique
70323 Redevance d’occupation du domaine public
7038 Autres redevances et recettes
70388 Autres redevances et recettes diverses
706 Prestations de services
7061 Redevances d\'enlèvement des ordures et des déchets
7062 Redevances et droits des services à caractère culturel
7063 Redevances et droits des services à caractère sportif et de loisirs
7066 Redevances et droits des services à caractère social
7067 Redevances et droits des services périscolaires
7068 Autres redevances et droits
70681 Redevances d’assainissement
708 Autres produits
7084 Mise à disposition de personnel facturée
7087 Remboursements de frais
70878 Remboursements de frais par des tiers
7088 Autres produits d\'activités annexes
73 IMPÔTS ET TAXES
731 Fiscalité locale
7311 Contributions directes
73111 Impôts directs locaux
73112 CVAE
73113 Taxe sur les surfaces commerciales
73114 Imposition forfaitaire sur les entreprises de réseaux
7312 Publicité foncière et droit d’enregistrement
7313 Taxes liées à l’urbanisation, aux déchets et à l’environnement
73133 Taxe d’enlèvement des ordures ménagères (TEOM)
7314 Impôts et taxes liés à l\'énergie (TICPE)
7315 Taxes liées aux transports (Versement mobilité)
7317 Impôts et taxes spécifiques (Taxe de séjour)
732 Fiscalité reversée
7321 Fiscalité reversée entre collectivités locales
73211 Attribution de compensation
73212 Dotation de solidarité communautaire
7322 Fiscalité reversée par l’intermédiaire d\'un fonds
73221 FNGIR
739 Reversements et restitutions sur impôts et taxes
74 DOTATIONS ET PARTICIPATIONS
741 D.G.F.
7411 Dotation forfaitaire
7412 Dotation d\'intercommunalité
742 Dotations aux élus locaux
744 FCTVA
747 Participations
7471 État
7472 Régions
7473 Départements
7474 Communes
7475 Groupements de collectivités
7477 Fonds européens
7478 Autres organismes
748 Compensations et attributions
7483 Attributions de péréquation et de compensation
75 AUTRES PRODUITS DE GESTION COURANTE
752 Revenus des immeubles
757 Subventions de fonctionnement
758 Produits divers de gestion courante
76 PRODUITS FINANCIERS
77 PRODUITS SPÉCIFIQUES
775 Produits des cessions d\'immobilisations
`

// Codes fonctions enrichis (avec 90-xx et 93-xx)
const rawFunctionText = `
0 Services généraux
01 Services généraux
02 Administration générale
020 Administration générale de la collectivité
021 Personnel non ventilé
022 Mairie annexe
023 Information, communication, publicité
024 Fêtes et cérémonies
025 Cimetières et pompes funèbres
026 Administration générale de l'Etat
028 Autres moyens généraux
03 Conseils
031 Assemblée délibérante
032 Conseil éco.,social région./Conseil dév.
033 Conseil cult., éduc., env.
034 Conseil éco.,soc.,environ.,culture,éduc.
0341 Section éco., sociale et environnem.
0342 Section culture, éducation et sports
035 Conseil de territoire
038 Autres instances
04 Coopération décentralisée, actions interrégionales et européennes
041 Action relevant de la subvention globale
042 Actions interrégionales
043 Actions européennes
044 Aide publique au développement
045 Actions internationales
048 Autres actions
05 Gestion des fonds européens
051 FSE
052 FEDER
058 Autres
0580 FEADER
0581 FEAMP
1 Sécurité
10 Services communs
11 Police, sécurité, justice
12 Incendie et secours
13 Hygiène et salubrité publique
18 Autres interventions protection personnes et biens
2 Enseignement, formation professionnelle et apprentissage
20 Services communs
201 Services communs
21 Enseignement du premier degré
211 Ecoles maternelles
212 Ecoles primaires
213 Classes regroupées
22 Enseignement du second degré
221 Collèges
222 Lycées publics
223 Lycées privés
23 Enseignement supérieur
24 Cités scolaires
25 Formation professionnelle
251 Insertion sociale et professionnelle
252 Formation professionnalisante personnes
253 Formation certifiante des personnes
254 Formation des actifs occupés
255 Rémunération des stagiaires
256 CNFPT - Formation des actifs occupés
2561 Missions statutaires et règlementaires
2562 Développement des compétences
2563 Évolution et transition professionnelle
2564 Organisation des activités pédagogiques
2565 Autres
257 CFNPT et CDG - missions spécifiques
2571 Concours
2572 Missions administratives
258 Autres
26 Apprentissage
27 Formation sanitaire et sociale
28 Autres services périscolaires et annexes
281 Hébergement et restauration scolaires
282 Sport scolaire
283 Médecine scolaire
284 Classes de découverte
288 Autre service annexe de l\'enseignement
29 Sécurité
3 Culture, vie sociale, jeunesse, sports et loisirs
30 Services communs
31 Culture
311 Activités artistiques, actions et manifestations culturelles
312 Patrimoine
313 Bibliothèques, médiathèques
314 Musées
315 Services d\'archives
316 Théâtres et spectacles vivants
317 Cinémas et autres salles de spectacles
318 Archéologie préventive
32 Sports
321 Salles de sport, gymnases
322 Stades
323 Piscines
324 Centres de formation sportifs
325 Autres équipements sportifs ou loisirs
326 Manifestations sportives
327 Soutien aux sportifs
3271 Soutien aux sportifs de haut niveau
3272 Soutien aux clubs amateurs
3273 Autre soutien aux sportifs
33 Jeunesse et loisirs
331 Centres de loisirs
332 Colonies de vacances
338 Autres activités pour les jeunes
34 Vie sociale et citoyenne
341 Egalité entre les femmes et les hommes
348 Autres
39 Sécurité
4 Santé et action sociale
40 Services communs
41 Santé
410 Services communs
411 PMI et planification familiale
412 Prévention et éducation pour la santé
413 Sécurité alimentaire
414 Dispensaires et autres établissements sanitaires
418 Autres actions
42 Action sociale
420 Services communs
421 Famille et enfance
4211 Actions en faveur de la maternité
4212 Aides à la famille
4213 Aides sociales à l\'enfance
4214 Adolescence
422 Petite enfance
4221 Crèches et garderies
4222 Multi accueil
4228 Autres actions pour la petite enfance
423 Personnes âgées
4231 Forfait autonomie
4232 Autres actions de prévention
4238 Autres actions pour les personnes âgées
424 Personnes en difficulté
425 Personnes handicapées
428 Autres interventions sociales
43 APA
430 Services communs
431 APA à domicile
432 APA versée aux bénéf. en établissement
433 APA versée à l\'établissement
44 RSA
441 Insertion sociale
442 Santé
443 Logement
444 Insertion professionnelle
445 Evaluation des dépenses engagées
446 Dépenses de structure
447 RSA allocations
448 Autres dépenses au titre du RSA
5 Aménagement des territoires et habitat
50 Services communs
51 Aménagement et services urbains
510 Services communs
511 Espaces verts urbains
512 Eclairage public
513 Art public
514 Electrification
515 Opérations d\'aménagement
518 Autres actions d\'aménagement urbain
52 Politique de la ville
53 Agglomérations et villes moyennes
54 Espace rural et autres espaces de dév.
55 Habitat (Logement)
551 Parc privé de la collectivité
552 Aide au secteur locatif
553 Aide à l\'accession à la propriété
554 Aire d\'accueil des gens du voyage
555 Logement social
56 Actions en faveur du littoral
57 Technologies de l\'information et de la communication
58 Autres actions
581 Réserves foncières
588 Autres actions d\'aménagement
59 Sécurité
6 Action économique
60 Services communs
61 Interventions économiques transversales
62 Structure d\'animation et de dév. éco.
63 Actions sectorielles
631 Agriculture, pêche et agro-alimentaire
6311 Laboratoire
6312 Marchés alimentaires
6318 Autres
632 Industrie, commerce et artisanat
633 Développement touristique
64 Rayonnement, attractivité du territoire
65 Insertion éco. et éco.sociale, solidaire
66 Maintien et dév. des services publics
67 Recherche et innovation
68 Autres actions
7 Environnement
70 Services communs
71 Actions transversales
72 Actions déchets et propreté urbaine
720 Services communs collecte et propreté
721 Collecte et traitement des déchets
7211 Actions prévention et sensibilisation
7212 Collecte des déchets
7213 Tri, valorisation, traitement déchets
722 Propreté urbaine
7221 Actions prévention et sensibilisation
7222 Action propreté urbaine et nettoiement
73 Actions en matière de gestion des eaux
731 Politique de l\'eau
732 Eau potable
733 Assainissement
734 Eaux pluviales
735 Lutte contre les inondations
74 Politique de l\'air
75 Politique de l\'énergie
751 Réseaux de chaleur et de froid
752 Energie photovoltaïque
753 Energie éolienne
754 Energie hydraulique
758 Autres actions
76 Préserv. patrim. naturel, risques techno.
77 Environnement infrastructures transports
78 Autres actions
8 Transports
80 Services communs
81 Transports scolaires
82 Transports publics de voyageurs
820 Services communs
821 Transport sur route
822 Transport ferroviaire
823 Transport fluvial
824 Transport maritime
825 Transport aérien
828 Autres transports
83 Transports de marchandises
830 Services communs
831 Fret routier
832 Fret ferroviaire
833 Fret fluvial
834 Fret maritime
835 Fret aérien
838 Autres transports
84 Voirie
841 Voirie nationale
842 Voirie régionale
843 Voirie départementale
844 Voirie métropolitaine
845 Voirie communale
846 Viabilité hivernale et aléas climatiques
847 Equipements de voirie
848 Parkings
849 Sécurité routière
85 Infrastructures
851 Gares, autres infrastructures routières
852 Gares et autres infrastructures ferrov.
853 Haltes, autres infrastructures fluviales
854 Ports, autres infrastructures portuaires
855 Aéroports et autres infrastructures
86 Liaisons multimodales
87 Circulations douces
89 Sécurité
9 Fonction en réserve
900 Services généraux (Investissement)
900-5 Gestion des fonds européens (Investissement)
901 Sécurité (Investissement)
902 Enseignement, formation professionnelle et apprentissage (Investissement)
903 Culture, vie sociale, jeunesse, sports et loisirs (Investissement)
904 Santé et action sociale (Investissement)
904-4 RSA (Investissement)
905 Aménagement des territoires et habitat (Investissement)
906 Action économique (Investissement)
907 Environnement (Investissement)
908 Transports (Investissement)
909 Fonction en réserve (Investissement)
930 Services généraux (Fonctionnement)
930-5 Gestion des fonds européens (Fonctionnement)
931 Sécurité (Fonctionnement)
932 Enseignement, formation professionnelle et apprentissage (Fonctionnement)
933 Culture, vie sociale, jeunesse, sports et loisirs (Fonctionnement)
934 Santé et action sociale (Fonctionnement)
934-3 APA (Fonctionnement)
934-4 RSA / Régularisation de RMI (Fonctionnement)
935 Aménagement des territoires et habitat (Fonctionnement)
936 Action économique (Fonctionnement)
937 Environnement (Fonctionnement)
938 Transports (Fonctionnement)
939 Fonction en réserve (Fonctionnement)
`;

function parseLines(text: string): Record<string, string> {
  const map: Record<string, string> = {};
  const lines = text.trim().split("\n");
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^([0-9A-Z\-]+)\s+(.*)$/);
    if (match) {
      const code = match[1].replace(/-/g, ""); // On nettoie les tirets (ex: 90-02 -> 9002)
      const label = match[2];
      map[code] = label;
    }
  }
  return map;
}

function generate() {
  const natureMap = parseLines(rawNatureText);
  const functionMap = parseLines(rawFunctionText);

  // Génération automatique des codes investissement (90xx) et fonctionnement (93xx) 
  // si non explicitement présents (pour la compatibilité)
  const enrichedFunctionMap = { ...functionMap };
  
  Object.entries(functionMap).forEach(([code, label]) => {
    // Si c'est un code principal (ex: 0, 1, 2)
    if (code.length === 1 && !isNaN(parseInt(code))) {
        if (!enrichedFunctionMap["90" + code + "0"]) enrichedFunctionMap["90" + code + "0"] = label; // 0 -> 900
        if (!enrichedFunctionMap["93" + code + "0"]) enrichedFunctionMap["93" + code + "0"] = label; // 0 -> 930
    }
    // Si c'est un code détaillé (ex: 02, 11)
    else if (!isNaN(parseInt(code))) {
       if (!enrichedFunctionMap["90" + code]) enrichedFunctionMap["90" + code] = label;
       if (!enrichedFunctionMap["93" + code]) enrichedFunctionMap["93" + code] = label;
    }
  });

  const output = {
    natures: natureMap,
    fonctions: enrichedFunctionMap
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Generated nomenclatures in ${OUTPUT_FILE}`);
}

generate();