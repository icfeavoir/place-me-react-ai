export class Group {
  private _name: string;
  private _nb: number;
  private _color: string;

  constructor(name: string, nb: number) {
    this._name = name;
    this._nb = nb;
    this._color = this.getRandomColor();
  }

  get name(): string {
    return this._name;
  }

  get nb(): number {
    return this._nb;
  }

  get color(): string {
    return this._color;
  }

  private getRandomColor(): string {
    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}