export type GridSizeType = {
  width: number;
  height: number;
};

export type GroupMemberType = {
  groupName: string;
  groupColor: string;
}

export type GridType = Array<Array<GroupMemberType | null>>;

export type Seat = {
  line: number;
  col: number;
}
