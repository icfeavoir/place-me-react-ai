import { ForbiddenSeat, GridSizeType, GridType, GroupMemberType } from "../types/types";
import { Group } from "./Group";

export class Plan {

  private _grid: GridType;
  private _gridSize: GridSizeType;
  private _groups: Group[];
  private _forbiddenSeats: ForbiddenSeat[];
  private _score: number;

  constructor(gridSize: GridSizeType, groups: Group[], forbiddenSeats: ForbiddenSeat[]) {
    this._groups = groups;
    this._gridSize = gridSize;
    this._forbiddenSeats = forbiddenSeats;

    this._grid = [];
    this._score = 0;

    this._initGrid();

    this.calculateScore();
  }

  get width(): number {
    return this._gridSize.width;
  }

  get height(): number {
    return this._gridSize.height;
  }

  get grid(): GridType {
    return this._grid;
  }

  get score(): number {
    return this._score;
  }

  get forbiddenSeats(): ForbiddenSeat[] {
    return this._forbiddenSeats;
  }

  getGroupMemberAt(line: number, col: number): GroupMemberType | null {
    return this._grid?.[line]?.[col];
  }

  setGroupMemberAt(line: number, col: number, groupMember: GroupMemberType) {
    if (this.isForbiddenSeatAt(line, col)) {
      throw new Error(`Seat at line ${line} col ${col} is forbidden`);
    }
    
    const alreadyTaken = this.getGroupMemberAt(line, col);
    if (alreadyTaken) {
      throw new Error(`Seat at line ${line} col ${col} is already taken by ${alreadyTaken.groupName}`);
    }

    this._grid[line][col] = groupMember;
  }

  /**
   * Initialize un plan vide
   */
  private _initGrid() {
    const lines = Array.from({length: this._gridSize.width }, () => null);
    // desctructuring array to prevent copy obj
    this._grid = Array.from({ length: this._gridSize.height }, () => [...lines]);
  }

  /**
   * Retourne si la place est interdite
   * @param line
   * @param col 
   * @returns {boolean}
   */
  isForbiddenSeatAt(line: number, col: number): boolean {
    return this._forbiddenSeats.some(({ line: forbiddenLine, col: forbiddenCol }) => {
      return line === forbiddenLine && col === forbiddenCol;
    });
  }

  /**
   * Place aléatoirement les groupes
   */
  public generateRandomPlan() {
    // random line and col
    let line = Math.floor(Math.random() * this._gridSize.height);
    let col = Math.floor(Math.random() * this._gridSize.width);

    this._groups.forEach(group => {
      let remainingGroupMembers = group.nb;

      const groupMember: GroupMemberType = {
        groupName: group.name,
        groupColor: group.color,
      }

      while (remainingGroupMembers > 0) {
        try {
          // On place la personne à la place aléatoire
          this.setGroupMemberAt(line, col, groupMember); 
          // On décrémente le nombre de personnes restantes
          remainingGroupMembers--;
        } catch(e) {
          // si la place est interdite, on continue pour placer ensuite
        }

        // On décale la colonne
        col++;
        // si on dépasse, on décale la ligne
        if (col >= this._gridSize.width) {
          col = 0;
          line++;
        }

        // si on dépasse la hauteur, on recommence
        if (line >= this._gridSize.height) {
          line = 0;
        }
      }
    });

    this.calculateScore();
  }

  /**
   * Calcule le score du plan
   */
  calculateScore() {
    let currentScore = 0;
    // currentScore -= Infinity;

    const LEFT_RIGHT = +10;
    const TOP_BOTTOM = +5;

    this._grid.forEach((line, lineIndex) => {
      line.forEach((groupMember, colIndex) => {
        if (groupMember) {
          const groupMemberRight = this.getGroupMemberAt(lineIndex, colIndex + 1);
          const groupMemberLeft = this.getGroupMemberAt(lineIndex, colIndex - 1);
          const groupMemberTop = this.getGroupMemberAt(lineIndex + 1, colIndex);
          const groupMemberBottom = this.getGroupMemberAt(lineIndex - 1, colIndex);

          if (groupMemberRight?.groupName === groupMember.groupName) {
            currentScore += LEFT_RIGHT;
          }

          if (groupMemberLeft?.groupName === groupMember.groupName) {
            currentScore += LEFT_RIGHT;
          }

          if (groupMemberTop?.groupName === groupMember.groupName) {
            currentScore += TOP_BOTTOM;
          }

          if (groupMemberBottom?.groupName === groupMember.groupName) {
            currentScore += TOP_BOTTOM;
          }
        }
      });
    });

    this._score = currentScore;
  }

  static createFromParents(father: Plan, mother: Plan): Plan {
    const gridSize = {
      width: father.width,
      height: father.height,
    }

    const plan = new Plan(gridSize, father._groups, father._forbiddenSeats);

    // on place les groupes aléatoirement
    const chooseFromFather = true;
    const continuePlacing = true;


    // while (continuePlacing) {
    //   continuePlacing = false;
    // }

    return plan;
  }
};