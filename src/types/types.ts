export type GridSizeType = {
  width: number;
  height: number;
};

export type Seat = {
  line: number;
  col: number;
}

export type GroupType = {
  name: string;
  nb: number;
  color: string;
  constraint?: GroupConstraintType;
}

export type GroupConstraintType = {
  constraintName: string;
  nb: number;
}

export type ConstraintSeatsType = {
  name: string;
  seats: Seat[];
}

export type GADTO = {
  groups: GroupType[];
  gridSize: GridSizeType;
  forbiddenSeats: Seat[];
  constraints: ConstraintSeatsType[];
  nbPlans: number;
  survivorProportion: number;
  nbReproductions: number;
  probaMutation: number;
  nbGenerations: number;
  scores: {
    leftRightScore: number;
    topBottomScore: number;
    malusScore: number;
  };
}

export type GAResponseDTO = {
  averageScore: number;
  bestPlan: PlanType;
  bestScore: number;
  time: number;
  genOfBestPlan: GenScoreType;
  error?: string;
}

export type PlanType = {
  gridSize: GridSizeType;
  placement: PlacementType[];
  forbiddenSeats?: Seat[];
  score: number;
}

// placement from server
export type PlacementType = {
  groupName: string;
  groupColor: string;
  constraintName: string;
  groupNb: number;
  nb: number;
  seat: Seat;
}

// loading sent socket
export type LoadingType = {
  current: number;
  total: number;
}

export type GenScoreType = {
  generation: number;
  score: number;
}
