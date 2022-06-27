import './App.css';
import React from 'react';

import { ConstraintSeatsType, GADTO, GAResponseDTO, GroupType, PlanType } from './types/types';
import { PlanDisplay } from './views/PlanDisplay';
import { Tools } from './views/Tools';
import { callGA } from './services/ai.service';

import { GROUPS } from './assets/groups/dm-groups';
import { genPremierRangContraint } from './assets/constraints/constraints';
import { FORBIDDEN_SEATS } from './assets/forbiddenSeats/random';

// const SOCKET_ENDPOINT = 'http://localhost:3000';

type AppData = {
  bestPlan: PlanType | null;
  reproducing: boolean;
  loading: string;
  error: string;
  gaResponseData: { averageScore: number, time: number };
};

const WIDTH = 10;
const HEIGHT = 10;

const LEFT_RIGHT_SCORE = 10;
const TOP_BOTTOM_SCORE = 5;
const MALUS_SCORE = -100;

// nombre initial de plans
const NB_PLANS = 100;
// % de survivants par génération
const SURVIVOR_PERCENT = 50;
// nombre de nouveaux plan à chaque génération (tjr avoir le même nb de plan)
const NB_REPRODUCTIONS = 50;  // 0.5 * NB_PLANS;
// proba mutation (%)
const PROBA_MUTATION_PERCENT = 0;
// nombre de générations
const NB_GENERATIONS = 100;


class App extends React.Component<{}, AppData> {

  private GAData: GADTO;
  private groups: GroupType[] = GROUPS;

  constructor(props: object) {
    super(props);

    this.GAData = {
      groups: this.groups,
      gridSize: { width: WIDTH, height: HEIGHT },
      forbiddenSeats: FORBIDDEN_SEATS,
      constraints: [],
      scores: {
        leftRightScore: LEFT_RIGHT_SCORE,
        topBottomScore: TOP_BOTTOM_SCORE,
        malusScore: MALUS_SCORE,
      },
      nbPlans: NB_PLANS,
      survivorProportion: SURVIVOR_PERCENT,
      nbReproductions: NB_REPRODUCTIONS,
      probaMutation: PROBA_MUTATION_PERCENT,
      nbGenerations: NB_GENERATIONS,
    }

    // default state
    this.state = {
      bestPlan: { gridSize: this.GAData.gridSize, placement: [], score: 0},
      reproducing: false,
      loading: 'Loading...',
      error: '',
      gaResponseData: { averageScore: 0, time: 0 },
    }

    this.generateConstraints();
  }

  // Socket
  // useEffect(() => {
  //   const socket = socketIOClient(SOCKET_ENDPOINT);
  //   socket.on('generatingLoader', (data) => {
  //     console.log(data);
  //   });
  // });

  private onChange(data: GADTO) {
    this.GAData = { ...this.GAData, ...data };

    this.setState({
      bestPlan: { gridSize: this.GAData.gridSize, placement: [], score: 0 },
    });
    this.generateConstraints();
  }

  private generateConstraints() {
    const CONSTRAINT_PREMIER_RANG: ConstraintSeatsType = genPremierRangContraint(this.GAData.gridSize);
    this.GAData.constraints = [CONSTRAINT_PREMIER_RANG];
  }

  private callGA = async () => {
    this.setState({
      reproducing: true,
      error: '',
      gaResponseData: { averageScore: 0, time: 0 },
    });

    try {
      const { error, averageScore, bestPlan, time }: GAResponseDTO = await callGA(this.GAData);
      if (error) {
        this.setState({ error: `ERR: ${error}` });
      }

      this.setState({
        bestPlan,
        gaResponseData: { averageScore, time },
      })
    } catch (err) {
    } finally {
      this.setState({ reproducing: false });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="plan-container">

          <button onClick={this.callGA} disabled={this.state.reproducing}>
            {
              this.state.reproducing ? this.state.loading : 'GENERATE!'
            }
          </button>

          <div id="main">
            <p className='error'>{ this.state.error }</p>
            {
              this.state.bestPlan && (
                <div id="best-plan" key={this.state.bestPlan.score}>
                  <b key={this.state.bestPlan.score}>Score: {this.state.bestPlan.score}</b><br/>
                  {this.state.gaResponseData.time > 0 && (
                    <p key={this.state.gaResponseData.time}>Calculé en {this.state.gaResponseData.time} secondes.</p>
                  )}
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
