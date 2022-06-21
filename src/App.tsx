import './App.css';
import React from 'react';
import { Group } from './models/Group';
import { Plan } from './models/Plan';
import { Seat, GridSizeType, ConstraintSeatsType } from './types/types';
import { PlanDisplay } from './views/PlanDisplay';
import { GAService } from './services/ga.service';
import { Tools } from './views/Tools';

const gridSize: GridSizeType = {
  width: 16,
  height: 10
}

const CONSTRAINT_PREMIER_RANG: ConstraintSeatsType = {
  id: 'PR',
  seats: Array.from({ length: gridSize.width }, (_, i) => ({ line: gridSize.height - 1, col: i }))
}

const CONSTRAINT_SEATS = [
  CONSTRAINT_PREMIER_RANG,
]

const GROUPS = [
  new Group("Madi.L", 5),
  new Group("Leco.A", 6, { constraint: CONSTRAINT_PREMIER_RANG, nb: 6 }),
  new Group("Maingu", 2),
  new Group("Bour.R", 2),
  new Group("Coll.J", 8),
  new Group("Meun.V", 16),
  new Group("Leme.H", 3),
  new Group("Vall.M", 2),
  new Group("Lero.E", 2),
  new Group("Laur.T", 8),
  new Group("Jupin", 2),
  new Group("Pean.A", 2),
  new Group("Bett.A", 9),
  new Group("Pins.V", 10),
  new Group("Pott.N", 2),
  new Group("Remi p", 3),
  new Group("Epro.I", 6),
  new Group("Doue.K", 1),
  new Group("Dilis", 3),
  new Group("Rondea", 1),
  new Group("Delcou", 4),
  new Group("Jarr.V", 2),
  new Group("Epro.M", 5),
  new Group("Gibon", 6),
  new Group("Lang.P  ", 19),
  new Group("Dane.D", 2),
  new Group("Techer", 4),
  new Group("Pier.J", 5),
  new Group("Pillai", 7),
  new Group("Less.B", 1),
  new Group("Yver.M", 3),
  // new Group("Les vieux", 33),
];

const FORBIDDEN_SEATS: Seat[] = [
  { line: 0, col: 4},
  { line: 0, col: 5},
  { line: 5, col: 8},
]

// nombre initial de plans
const NB_PLANS = 150;
// nombre de survivants par génération (en %)
const SURVIVOR_PERCENT = 0.5;
// nombre de nouveaux plan à chaque génération (tjr avoir le même nb de plan)
const NB_REPRODUCTIONS = 50;  // 0.5 * NB_PLANS;
// proba mutation
const PROBA_MUTATION = 0.8;
// nombre de générations
const NB_GENERATIONS = 3000;

type ReproduceDataType = {
  reproducing: boolean;
  nbReproduction: number;
}

type AppData = {
  plans: Plan[];
  bestPlan: Plan;
  reproduceData: ReproduceDataType;
};

class App extends React.Component<{}, AppData> {

  private gaService: GAService;

  constructor(props: object) {
    super(props);

    const plans = Array.from({length: NB_PLANS }, () => new Plan(gridSize, GROUPS, FORBIDDEN_SEATS, CONSTRAINT_SEATS));
    plans.forEach((plan) => { plan.generateRandomPlan() });

    this.gaService = new GAService();

    // Plan avec le meilleur score
    const bestPlan = this.gaService.sortPlans(plans)?.[0];

    this.state = {
      plans,
      bestPlan,
      reproduceData: { reproducing: false, nbReproduction: 0 }
    }
  }

  componentDidMount() {
    this.reloadBestPlan();
  }

  private reloadBestPlan = () => {
    this.setState({ bestPlan : this.state.bestPlan });
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
    const begin = new Date();

    let plans = this.state.plans;
    let bestPlan = plans[0];

    for (let i = 0; i < NB_GENERATIONS; i++) {
      plans = this.gaService.reproduce(plans, SURVIVOR_PERCENT, NB_REPRODUCTIONS, PROBA_MUTATION);
      bestPlan = plans[0];
    }
    this.setState({ reproduceData: { ...this.state.reproduceData, nbReproduction: this.state.reproduceData.nbReproduction + NB_GENERATIONS, reproducing: false } });
    this.setState({ bestPlan, plans });

    const end = new Date();

    console.log(`Finished in ${(end.getTime() - begin.getTime()) / 1000} seconds`);
  }

  private mutate = () => {
    const plan = this.state.bestPlan;
    const mutatedPlan = this.gaService.mutate(plan);
    if (mutatedPlan) {
      this.setState({ bestPlan: mutatedPlan });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="plan-container">
          <button onClick={this.startReproducing} disabled={this.state.reproduceData.reproducing} key={`reproduce-btn-${this.state.reproduceData.reproducing}`}>
            { this.state.reproduceData.reproducing ? 'reproducing...' : 'Reproduce!' }
          </button>
          {/* <button onClick={this.mutate}>Mutate!</button> */}

          <div id="main">
            <div id="best-plan">
              <b key={this.state.bestPlan.score}>Score: {this.state.bestPlan.score}</b><br/>
              <b key={this.state.reproduceData.nbReproduction}>NB GENERATION: {this.state.reproduceData.nbReproduction}</b>
              <PlanDisplay plan={this.state.bestPlan} />
            </div>
          </div>
        </div>

        <div className='tools-container'>
          <Tools />
        </div>
      </div>
    )
  }
}

export default App;
