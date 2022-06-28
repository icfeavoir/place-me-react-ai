import { Seat, GroupType } from "../types/types";

export const WIDTH = 8;
export const HEIGHT = 6;

export const GROUPS: GroupType[] = [
  { name: 'Seb', nb: 3 },
  { name: 'Pierre', nb: 2, constraint: { constraintName: 'PR', nb: 2 } },
  { name: 'Manon', nb: 3 },
  { name: 'Olivier', nb: 4 },
  { name: 'Yousra', nb: 5 },
  { name: 'Gwenolé', nb: 3 },
  { name: 'Julien', nb: 2 },
  { name: 'Vincent', nb: 1 },
  { name: 'Marc', nb: 4 },
  { name: 'Simon', nb: 5 },
  { name: 'Thomas', nb: 6 },
  { name: 'Nicolas', nb: 3 },
  { name: 'Elise', nb: 1 },
  { name: 'Hugo', nb: 1 },
];

export const FORBIDDEN_SEATS: Seat[] = [
  { line: 0, col: 4},
  { line: 0, col: 5},
  { line: 0, col: 6},
  { line: 0, col: 7},
  { line: 0, col: 8},
  { line: 5, col: 8},
]