import './App.css';
import React from 'react';
import { Group } from './models/Group';
import { Plan } from './models/Plan';
import { Seat, GridSizeType } from './types/types';
import { PlanDisplay } from './views/PlanDisplay';
import { GAService } from './services/ga.service';


const gridSize: GridSizeType = {
  width: 16,
  height: 10
}

const GROUPS = [
  new Group("Madi.L", 5),
  new Group("Leco.A", 6),
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
const NB_PLANS = 100;
// nombre de survivants par génération (en %)
const SURVIVOR_PERCENT = 0.7;
// nombre de nouveaux plan à chaque génération (tjr avoir le même nb de plan)
const NB_REPRODUCTIONS = 35;  // 0.5 * NB_PLANS;
// nombre de générations
const NB_GENERATIONS = 2000;

type AppData = {
  plans: Plan[];
  bestPlan: Plan;
  reproducing: boolean;
};

class App extends React.Component<{}, AppData> {

  private gaService: GAService;

  constructor(props: object) {
    super(props);

    const plans = Array.from({length: NB_PLANS }, () => new Plan(gridSize, GROUPS, FORBIDDEN_SEATS));
    plans.forEach((plan) => { plan.generateRandomPlan() });

    this.gaService = new GAService();

    // Plan avec le meilleur score
    const bestPlan = this.gaService.sortPlans(plans)?.[0];

    this.state = {
      plans,
      bestPlan,
      reproducing: false
    }
  }

  componentDidMount() {
    this.reloadBestPlan();
  }

  private reloadBestPlan = () => {
    this.setState({ bestPlan : this.state.bestPlan });
  }

  private calcAverage = () => {
    return this.state.plans.reduce((acc, plan) => acc + plan.score, 0) / this.state.plans.length;
  }

  private reproduce = () => {
    // mesure time
    const begin = new Date();
    if (!this.state.reproducing) {
      this.setState({ reproducing: true });

      let plans = this.state.plans;
      let bestPlan = plans[0];

      for (let i = 0; i < NB_GENERATIONS; i++) {
        plans = this.gaService.reproduce(plans, SURVIVOR_PERCENT, NB_REPRODUCTIONS,);
        bestPlan = plans[0];
      }
      this.setState({ reproducing: false });
      this.setState({ bestPlan });

      const end = new Date();

      console.log(`Finished in ${(end.getTime() - begin.getTime()) / 1000} seconds`);
    }
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.reproduce} disabled={this.state.reproducing}>{ this.state.reproducing ? 'reproducing...' : 'Reproduce!'}</button>
        <div id="main">
          <div id="best-plan">
            <b key={this.state.bestPlan.score}>Score: {this.state.bestPlan.score}</b>
            <PlanDisplay plan={this.state.bestPlan} />
          </div>

          <div id="average">
            <b>Moyenne des scores : {this.calcAverage()}</b>
          </div>

        </div>
      </div>
    )
  }
}

export default App;
