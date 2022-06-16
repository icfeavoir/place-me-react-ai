import { Seat, GridSizeType, GridType, GroupMemberType } from "../types/types";
import { Group } from "./Group";

export class Plan {

  private _grid: GridType;
  private _gridSize: GridSizeType;
  private _groups: Group[];
  private _forbiddenSeats: Seat[];
  private _score: number;

  constructor(gridSize: GridSizeType, groups: Group[], forbiddenSeats: Seat[]) {
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

  get forbiddenSeats(): Seat[] {
    return this._forbiddenSeats;
  }

  getGroupMemberAt(seat: Seat): GroupMemberType | null {
    return this._grid?.[seat.line]?.[seat.col];
  }

  /**
   * Retourne tous les sièges occupés par un groupe
   * @param group 
   */
  private getGroupSeats(group: Group): Seat[] {
    const groupSeats: Seat[] = [];

    this._grid.forEach((line, lineIndex) => {
      line.forEach((groupMember, colIndex) => {
        if (groupMember?.groupName === group.name) {
          groupSeats.push({ line: lineIndex, col: colIndex });
        }
      });
    });

    return groupSeats;
  }

  isSeatAvailable(seat: Seat): boolean {
    return this.getGroupMemberAt(seat) === null;
  }

  isSeatTaken(seat: Seat): boolean {
    return !this.isSeatAvailable(seat);
  }

  setGroupMemberAt(seat: Seat, groupMember: GroupMemberType) {
    if (this.isForbiddenSeatAt(seat.line, seat.col)) {
      throw new Error(`Seat at line ${seat.line} col ${seat.col} is forbidden`);
    }
    
    const alreadyTaken = this.getGroupMemberAt(seat);
    if (alreadyTaken) {
      throw new Error(`Seat at line ${seat.line} col ${seat.col} is already taken by ${alreadyTaken.groupName}`);
    }

    this._grid[seat.line][seat.col] = groupMember;
  }

  /**
   * Affecte un groupe à une liste de sièges
   * @param { Group } group 
   * @param { Seat[] } seats
   */
  private setGroupSeats(group: Group, seats: Seat[]) {
    const groupMember: GroupMemberType = {
      groupName: group.name,
      groupColor: group.color,
    }
    seats.forEach((seat) => this.setGroupMemberAt(seat, groupMember));
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
    this.fillMissingGroups(this._groups);
    this.calculateScore();
  }
  
  /**
   * Place des groupe aléatoirement à des places libres
   * (les groupes sont placés ensemble)
   * @param missingGroups Les groupes qui doivent être placés
   */
  private fillMissingGroups(missingGroups: Group[]) {
    // random line and col
    let line = Math.floor(Math.random() * this._gridSize.height);
    let col = Math.floor(Math.random() * this._gridSize.width);

    missingGroups.forEach(group => {
      let remainingGroupMembers = group.nb;

      const groupMember: GroupMemberType = {
        groupName: group.name,
        groupColor: group.color,
      }

      let tries = 0;
      while (remainingGroupMembers > 0) {
        try {
          // On place la personne à la place aléatoire
          const seat = { line, col };
          this.setGroupMemberAt(seat, groupMember); 
          // On décrémente le nombre de personnes restantes
          remainingGroupMembers--;
          // On remet les essaies à 0
          tries = 0;
        } catch (e) {
          // si la place est interdite, on continue pour placer ensuite
          // Sauf si on a essayé toutes les places
          tries++;
          const nbSeats = this._gridSize.width * this._gridSize.height;
          if (tries > nbSeats) {
            throw new Error('too many tries: population bigger than Plan');
          }
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
  }

  /**
   * Calcule le score du plan
   */
  calculateScore() {
    let currentScore = 0;

    const LEFT_RIGHT = +10;
    const TOP_BOTTOM = +5;

    this._grid.forEach((line, lineIndex) => {
      line.forEach((groupMember, colIndex) => {
        if (groupMember) {
          const groupMemberRight = this.getGroupMemberAt({ line: lineIndex, col: colIndex + 1 });
          const groupMemberLeft = this.getGroupMemberAt({ line: lineIndex, col: colIndex - 1 });
          const groupMemberTop = this.getGroupMemberAt({ line: lineIndex + 1, col: colIndex });
          const groupMemberBottom = this.getGroupMemberAt({ line: lineIndex - 1, col: colIndex });

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

  clone(): Plan {
    const plan = new Plan(this._gridSize, this._groups, this._forbiddenSeats);
    plan._grid = this._grid.map(line => line.map(groupMember => groupMember));
    plan.calculateScore();

    return plan;
  }

  static createFromParents(father: Plan, mother: Plan): Plan {
    const gridSize = {
      width: father.width,
      height: father.height,
    }
    const childPlan = new Plan(gridSize, father._groups, father._forbiddenSeats);

    // On choisit qui va commencer (père ou mère)
    let isFatherTurn = Math.random() < 0.5;


    const groups = [...father._groups];
    let remainingGroups = [...groups];
    
    groups.forEach((group) => {
      // alterne père / mère
      let usedPlan: Plan = isFatherTurn ? father : mother;
      const seats: Seat[] = usedPlan.getGroupSeats(group);

      // check if all seats are available
      const canPlaceGroup = !seats.some((seat) => childPlan.isSeatTaken(seat));

      if (canPlaceGroup) {
        childPlan.setGroupSeats(group, seats);
        remainingGroups = remainingGroups.filter((g) => g !== group);
        // change parent turn if success
        isFatherTurn = !isFatherTurn;
      }

    })

    // put groups that have not been placed
    childPlan.fillMissingGroups(remainingGroups);

    childPlan.calculateScore();

    return childPlan;
  }

  static createFromOneParent(father: Plan): Plan {
    const gridSize = {
      width: father.width,
      height: father.height,
    }
    const childPlan = new Plan(gridSize, father._groups, father._forbiddenSeats);

    const groups = [...father._groups];
    let remainingGroups = [...groups];
    
    groups.forEach((group) => {
      // probabilité d'hériter du père (sinon aléatoire)
      const fatherInheritanceForGroup = Math.random() < 0.5;
      
      if (fatherInheritanceForGroup) {
        const seats: Seat[] = father.getGroupSeats(group);
        childPlan.setGroupSeats(group, seats);
        remainingGroups = remainingGroups.filter((g) => g !== group);
        // change parent turn if success
      }
    })

    // put groups that have not been placed
    childPlan.fillMissingGroups(remainingGroups);

    childPlan.calculateScore();

    return childPlan;
  }

  toString(): string {
    let text = '';
    this.grid.forEach((line, lineIndex) => {
      line.forEach((groupMember, colIndex) => {
        if (groupMember) {
          let name = groupMember.groupName
          while (name.length < 6) {
            name += ' ';
          }
          text += ` ${name} |`;
        } else {
          text += '        |';
        }
      });
      text += '\n';
    });

    return `SCORE ${this.score}\n${text}`;
  }
};