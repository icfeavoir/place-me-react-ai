import './App.css';
import React from 'react';
import { Group } from './models/Group';
import { Plan } from './models/Plan';
import { Seat, GridSizeType, ConstraintSeatsType, GADTO, GAResponseDTO, PlanType } from './types/types';
import { PlanDisplay } from './views/PlanDisplay';
import { GAService } from './services/ga.service';
import { Tools } from './views/Tools';
import { callGA } from './services/ai.service';

type ReproduceDataType = {
  reproducing: boolean;
  nbReproduction: number;
}

type AppData = {
  bestPlan: PlanType | null;
  reproduceData: ReproduceDataType;
};

const WIDTH = 10;
const HEIGHT = 10;

const LEFT_RIGHT_SCORE = 10;
const TOP_BOTTOM_SCORE = 5;
const MALUS_SCORE = -100;

// nombre initial de plans
const NB_PLANS = 1;
// % de survivants par génération
const SURVIVOR_PERCENT = 50;
// nombre de nouveaux plan à chaque génération (tjr avoir le même nb de plan)
const NB_REPRODUCTIONS = 50;  // 0.5 * NB_PLANS;
// proba mutation (%)
const PROBA_MUTATION_PERCENT = 80;
// nombre de générations
const NB_GENERATIONS = 10;

// const CONSTRAINT_PREMIER_RANG: ConstraintSeatsType = {
//   id: 'PR',
//   seats: Array.from({ length: this.gridSize.width }, (_, i) => ({ line: this.gridSize.height - 1, col: i }))
// }

// const CONSTRAINT_SEATS = [this.CONSTRAINT_PREMIER_RANG];


const FORBIDDEN_SEATS: Seat[] = [
  { line: 0, col: 4},
  { line: 0, col: 5},
  { line: 5, col: 8},
]

const GROUPS = [
  new Group("Madi.L", 5),
  new Group("Leco.A", 6),
  // new Group("Leco.A", 6, { constraint: this.CONSTRAINT_PREMIER_RANG, nb: 6 }),
  new Group("Maingu", 2),
  new Group("Bour.R", 2),
  // new Group("Coll.J", 8),
  // new Group("Meun.V", 16),
  // new Group("Leme.H", 3),
  // new Group("Vall.M", 2),
  // new Group("Lero.E", 2),
  // new Group("Laur.T", 8),
  // new Group("Jupin", 2),
  // new Group("Pean.A", 2),
  // new Group("Bett.A", 9),
  // new Group("Pins.V", 10),
  // new Group("Pott.N", 2),
  // new Group("Remi p", 3),
  // new Group("Epro.I", 6),
  // new Group("Doue.K", 1),
  // new Group("Dilis", 3),
  // new Group("Rondea", 1),
  // new Group("Delcou", 4),
  // new Group("Jarr.V", 2),
  // new Group("Epro.M", 5),
  // new Group("Gibon", 6),
  // new Group("Lang.P  ", 19),
  // new Group("Dane.D", 2),
  // new Group("Techer", 4),
  // new Group("Pier.J", 5),
  // new Group("Pillai", 7),
  // new Group("Less.B", 1),
  // new Group("Yver.M", 3),
  // new Group("Les vieux", 33),
];

const SIMPLE_GROUPS = GROUPS.map((group) => ({ name: group.name, nb: group.nb }));

class App extends React.Component<{}, AppData> {

  private GAData: GADTO;

  private gaService: GAService;

  constructor(props: object) {
    super(props);

    this.GAData = {
      groups: SIMPLE_GROUPS,
      gridSize: { width: WIDTH, height: HEIGHT },
      constraints: [],
      forbiddenSeats: [],
      // leftRightScore: LEFT_RIGHT_SCORE,
      // topBottomScore: TOP_BOTTOM_SCORE,
      nbPlans: NB_PLANS,
      survivorProportion: SURVIVOR_PERCENT,
      nbReproductions: NB_REPRODUCTIONS,
      probaMutation: PROBA_MUTATION_PERCENT,
      nbGenerations: NB_GENERATIONS,
    }

    this.gaService = new GAService();
    // default state
    this.state = {
      bestPlan: null,
      reproduceData: { reproducing: false, nbReproduction: 0},
    }
  }

  private onChange(data: GADTO) {
    this.GAData = { ...this.GAData, ...data };
  }

  private startReproducing = () => {
    if (!this.state.reproduceData.reproducing) {
      this.setState({ reproduceData: { ...this.state.reproduceData, reproducing: true } }, () => {
        // on laisse le temps au btn de changer (ugly!)
        setTimeout(() => {
          this.reproduce();
        }, 100);
      });
    }
  }

  private reproduce = () => {
    // mesure time
    // const begin = new Date();

    // let plans = this.state.plans;
    // let bestPlan = plans[0];

    // for (let i = 0; i < this.NB_GENERATIONS; i++) {
    //   plans = this.gaService.reproduce(plans, this.SURVIVOR_PROPORTION, this.NB_REPRODUCTIONS, this.PROBA_MUTATION);
    //   bestPlan = plans[0];
    // }
    // this.setState({ reproduceData: { ...this.state.reproduceData, nbReproduction: this.state.reproduceData.nbReproduction + this.NB_GENERATIONS, reproducing: false } });
    // this.setState({ bestPlan, plans });

    // const end = new Date();

    // console.log(`Finished in ${(end.getTime() - begin.getTime()) / 1000} seconds`);
  }

  private callGA = async () => {
    const { averageScore, bestPlan, bestScore, time }: GAResponseDTO = await callGA(this.GAData);
    this.setState({ bestPlan })
    console.log(bestPlan)
  }

  render() {
    return (
      <div className="App">
        <div className="plan-container">
          {/* <button onClick={this.startReproducing} disabled={this.state.reproduceData.reproducing} key={`reproduce-btn-${this.state.reproduceData.reproducing}`}>
            { this.state.reproduceData.reproducing ? 'reproducing...' : 'Reproduce!' }
          </button> */}

          <button onClick={this.callGA}>GA API</button>

          <div id="main">
            {
              this.state.bestPlan && (
                <div id="best-plan" key={this.state.bestPlan.score}>
                  <b key={this.state.bestPlan.score}>Score: {this.state.bestPlan.score}</b><br/>
                  <b key={this.state.reproduceData.nbReproduction}>NB GENERATION: {this.state.reproduceData.nbReproduction}</b>
                  <PlanDisplay plan={this.state.bestPlan} />
                </div>
              )
            }
          </div>
        </div>

        <div className='tools-container'>
          <Tools onChange={this.onChange.bind(this)} defaultData={this.GAData} />
        </div>
      </div>
    )
  }
}

export default App;
