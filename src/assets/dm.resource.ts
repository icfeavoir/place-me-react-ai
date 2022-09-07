import { Seat, GroupType } from "../types/types";

// NEW:
// CONTRAINTES DE PLACEMENTS (Premier rang)
// SIEGES INTERDITS

export const WIDTH = 9;
export const HEIGHT = 6;

export const GROUPS: GroupType[] = [
  { name: 'Seb', nb: 3, color: 'peru' },
  { name: 'Pierre', nb: 2, color: 'springgreen', constraint: { constraintName: 'PR', nb: 2 } },
  { name: 'Manon', nb: 3, color: 'aquamarine' },
  { name: 'Olivier', nb: 4, color: 'yellowgreen' },
  { name: 'Yousra', nb: 5, color: 'limegreen' },
  { name: 'Gwenolé', nb: 3, color: 'chocolate' },
  { name: 'Julien', nb: 2, color: 'lavender' },
  { name: 'Vincent', nb: 1, color: 'moccasin' },
  { name: 'Marc', nb: 4, color: 'saddlebrown' },
  { name: 'Simon', nb: 5, color: 'white' },
  { name: 'Thomas', nb: 6, color: 'palegoldenrod' },
  { name: 'Nicolas', nb: 3, color: 'floralwhite' },
  { name: 'Elise', nb: 3, color: 'salmon' },
  { name: 'Hugo', nb: 1, color: 'peachpuff' },
  { name: 'Fabien', nb: 4, color: 'forestgreen'}
];

export const FORBIDDEN_SEATS: Seat[] = [
  { line: 0, col: 4},
  { line: 0, col: 5},
  { line: 0, col: 6},
  { line: 5, col: 1},
  { line: 5, col: 2}, // PAS CONCLUANT ENCORE
]