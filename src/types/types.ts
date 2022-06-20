export type GridSizeType = {
  width: number;
  height: number;
};

export type GroupMemberType = {
  groupName: string;
  groupColor: string;
  groupNb: number;
}

export type GridType = Array<Array<GroupMemberType | null>>;

export type Seat = {
  line: number;
  col: number;
}
