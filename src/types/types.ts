export type GridSizeType = {
  width: number;
  height: number;
};

export type GroupMemberType = {
  groupName: string; // nom du groupe
  groupColor: string; // couleur du groupe
  groupNb: number; // nombre de personnes dans le groupe
  nb: number; // numero dans le groupe
  constraint: ConstraintSeatsType | null; // contrainte spécifique de ce membre
}

export type GridType = Array<Array<GroupMemberType | null>>;

export type Seat = {
  line: number;
  col: number;
}

export type ConstraintSeatsType = {
  id: string;
  seats: Seat[];
}

export type GroupConstraintType = {
  nb: number;
  constraint: ConstraintSeatsType;
}
