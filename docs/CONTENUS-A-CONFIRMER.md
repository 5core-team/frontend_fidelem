# Contenus du site à valider par FIDELEM

Ces informations sont affichées sur fidelem.pro mais ne figurent dans aucun
document transmis par FIDELEM. Pour chacune, merci d'indiquer « validé » ou la
bonne valeur. Les modifications se font ensuite dans `src/donnees/fidelem.ts`.

## 1. Coordonnées de FIDELEM

Affichées sur la page Contact, dans le pied de page et dans les messages d'erreur.

| Information | Valeur affichée aujourd'hui | À valider |
| --- | --- | --- |
| Téléphone | 01 66 11 11 64 | ☐ |
| E-mail de contact | contact@fidelem.pro | ☐ |
| Adresse de l'agence | « Adresse de l'agence à confirmer » (texte visible en ligne) | ☐ **à fournir** |
| Horaires | Du lundi au vendredi, 8 h – 18 h | ☐ |
| Numéro WhatsApp | aucun | ☐ à fournir si besoin |

L'e-mail de contact reçoit aussi les messages du formulaire Contact et les
candidatures de conseillers : l'adresse doit exister et être relevée.

## 2. Taux du simulateur de financement

Pages Services et pages de chaque financement. Les taux sont repris de l'ancien site.

| Libellé | Taux affiché | À valider |
| --- | --- | --- |
| Taux standard | 5 % | ☐ |
| Taux majoré | 7 % | ☐ |

Bornes du simulateur, par financement :

| Financement | Montant minimum | Montant maximum | Durée |
| --- | --- | --- | --- |
| Immobilier | 1 000 000 FCFA | 100 000 000 FCFA | 12 à 240 mois |
| Transport | 300 000 FCFA | 40 000 000 FCFA | 6 à 60 mois |
| Affaires | 500 000 FCFA | 150 000 000 FCFA | 6 à 84 mois |

☐ Bornes validées

## 3. Contenu des trois financements

Pour l'immobilier, le transport et les affaires, le site présente les projets
couverts, les profils concernés et les pièces à fournir. Ces listes ont été
rédigées à partir des usages courants : merci de les relire sur les pages
Services › Immobilier, Transport et Affaires.

☐ Immobilier relu  ☐ Transport relu  ☐ Affaires relu

La FAQ annonce aussi « 48 à 72 heures une fois le dossier complet » pour la
décision : ☐ délai validé.

## 4. Formation des conseillers

Page Conseiller Financier.

| Information | Valeur affichée | À valider |
| --- | --- | --- |
| Date limite d'inscription | 20 septembre (sans année) | ☐ date et année de la prochaine session |
| Frais d'inscription | 5 000 FCFA, non remboursables | ☐ |

## 5. Zones de gestion

Les demandes envoyées depuis le site arrivent au conseiller de la commune choisie
par l'usager. La liste actuelle compte 23 communes :

Cotonou, Abomey-Calavi, Porto-Novo, Sèmè-Podji, Ouidah, Allada, Bohicon, Abomey,
Lokossa, Comè, Grand-Popo, Pobè, Kétou, Savè, Dassa-Zoumè, Savalou, Parakou,
Djougou, Natitingou, Kandi, Malanville, Nikki, Bembèrèkè.

☐ Liste validée, ou découpage à transmettre (par commune, par département, par
quartier pour Cotonou…).

Une modification des zones doit être faite à la fois dans le site
(`src/donnees/fidelem.ts`) et dans l'API (`config/fidelem.php`).
