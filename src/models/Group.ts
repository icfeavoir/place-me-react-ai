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
  
  // TODO: export in file
  private getRandomColor(): string {
    const colors = [
      'antiquewhite',
      'aqua',
      'aquamarine',
      'azure',
      'beige',
      'bisque',
      'blanchedalmond',
      'brown',
      'burlywood',
      'chartreuse',
      'chocolate',
      'coral',
      'cornsilk',
      'crimson',
      'cyan',
      'deeppink',
      'dimgray',
      'dimgrey',
      'firebrick',
      'floralwhite',
      'forestgreen',
      'fuchsia',
      'gainsboro',
      'ghostwhite',
      'gold',
      'goldenrod',
      'gray',
      'green',
      'greenyellow',
      'grey',
      'honeydew',
      'hotpink',
      'indianred',
      'indigo',
      'ivory',
      'khaki',
      'lavender',
      'lavenderblush',
      'lawngreen',
      'lemonchiffon',
      'lightcoral',
      'lightcyan',
      'lightgoldenrodyellow',
      'lightgray',
      'lightgreen',
      'lightgrey',
      'lightpink',
      'lightsalmon',
      'lightseagreen',
      'lightslategray',
      'lightslategrey',
      'lightyellow',
      'lime',
      'limegreen',
      'linen',
      'magenta',
      'maroon',
      'mediumaquamarine',
      'mediumorchid',
      'mediumspringgreen',
      'mediumturquoise',
      'mintcream',
      'mistyrose',
      'moccasin',
      'navajowhite',
      'oldlace',
      'olive',
      'olivedrab',
      'orange',
      'orangered',
      'orchid',
      'palegoldenrod',
      'palegreen',
      'paleturquoise',
      'papayawhip',
      'peachpuff',
      'peru',
      'pink',
      'plum',
      'rosybrown',
      'saddlebrown',
      'salmon',
      'sandybrown',
      'seagreen',
      'seashell',
      'sienna',
      'silver',
      'slategray',
      'slategrey',
      'snow',
      'springgreen',
      'tan',
      'teal',
      'thistle',
      'tomato',
      'turquoise',
      'wheat',
      'white',
      'whitesmoke',
      'yellow',
      'yellowgreen',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}