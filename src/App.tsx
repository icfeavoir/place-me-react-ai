import './App.css';
import React from 'react';
import { io, Socket } from 'socket.io-client';

import { ConstraintSeatsType, GADTO, GAResponseDTO, LoadingType, PlanType } from './types/types';
import { PlanDisplay } from './views/PlanDisplay';
import { Tools } from './views/Tools';
import { GenScoreTable } from './views/GenScoreTable';
import { ListGroups } from './components/ListGroups';

import { genPremierRangContraint } from './assets/constraints/constraints';

// import { GROUPS, FORBIDDEN_SEATS, WIDTH, HEIGHT } from './assets/test.resource';
import { GROUPS, FORBIDDEN_SEATS, WIDTH, HEIGHT } from './assets/dm-simple.resource';
// import { GROUPS, FORBIDDEN_SEATS, WIDTH, HEIGHT } from './assets/dm.resource';
// import { GROUPS, FORBIDDEN_SEATS, WIDTH, HEIGHT } from './assets/ajc.resource';

type AppData = {
  bestPlan: PlanType | null;
  genOfBestPlan: number;
  genAndScoreMap: Map<number, number>; // generationI => scoreX
  reproducing: boolean;
  loadingText: string;
  error: string;
  gaResponseData: { averageScore: number, time: number };
};

const LEFT_RIGHT_SCORE = 10;
const TOP_BOTTOM_SCORE = 5;
const MALUS_SCORE = -50;

// nombre initial de plans
const NB_PLANS = 100;
// % de survivants par génération
const SURVIVOR_PERCENT = 65;
// nombre de nouveaux plan à chaque génération (tjr avoir le même nb de plan)
const NB_REPRODUCTIONS = 35;
// proba mutation (%)
const PROBA_MUTATION_PERCENT = 15;
// nombre de générations
const NB_GENERATIONS = 100;

class App extends React.Component<{}, AppData> {

  private GAData: GADTO;
  private socket: Socket;

  constructor(props: object) {
    super(props);

    this.GAData = {
      groups: GROUPS,
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
      bestPlan: { gridSize: this.GAData.gridSize, placement: [], forbiddenSeats: FORBIDDEN_SEATS, score: 0 },
      genOfBestPlan: 0,
      genAndScoreMap: new Map(),
      reproducing: false,
      loadingText: '',
      error: '',
      gaResponseData: { averageScore: 0, time: 0 },
    }

    this.generateConstraints();

    this.socket = io('http://localhost:3000');
  }

  componentDidMount() {
    if (this.socket === null) {
      this.socket = io('http://localhost:3000');
    }

    if (this.socket) {
      this.socket.on('loading', this.updateLoadingState.bind(this));
      this.socket.on('current-gen', this.updateCurrentPlan.bind(this));
      this.socket.on('done', this.onGenerateFinished.bind(this));
    }
  }

  /**
   * Quand on reçoit l'event de loading
   */
  private updateLoadingState({ current, total }: LoadingType) {
    if (total === 0) return;

    if (!this.state.reproducing) {
      this.setState({ reproducing: true });
    }

    const loadingText = `Génération: ${Math.round((current / total) * 100)}% (${current}/${total})`;
    this.setState({ loadingText });
  }

  /**
   * Quand on reçoit l'event de current-gen
   * On met à jour le plan
   */
  private updateCurrentPlan({ bestPlan, genOfBestPlan }: Partial<GAResponseDTO>) {
    if (!bestPlan || !genOfBestPlan) return;
    
    const currentMap = this.state.genAndScoreMap;
    if (!currentMap.has(genOfBestPlan.generation)) {
      currentMap.set(genOfBestPlan.generation, genOfBestPlan.score);
      console.log(currentMap);
    }

    this.setState({
      bestPlan,
      genOfBestPlan: genOfBestPlan.generation,
      genAndScoreMap: currentMap,
    });
  }

  /**
   * Quand le GA est terminé
   */
  private onGenerateFinished({ error, averageScore, bestPlan, time, genOfBestPlan }: GAResponseDTO) {
    if (error) {
      this.setState({ error: `ERR: ${error}` });
    }

    this.setState({
      bestPlan,
      gaResponseData: { averageScore, time },
      genOfBestPlan: genOfBestPlan.generation
    })

    this.setState({ reproducing: false });
  }

  /**
   * Quand une valeur change (TOOLS)
   */
  private onChange(data: GADTO) {
    this.GAData = { ...this.GAData, ...data };

    this.reset();
    this.generateConstraints();
  }

  /**
   * Re génère les contraintes
   */
  private generateConstraints() {
    const CONSTRAINT_PREMIER_RANG: ConstraintSeatsType = genPremierRangContraint(this.GAData.gridSize);
    this.GAData.constraints = [CONSTRAINT_PREMIER_RANG];
  }

  /**
   * Envoie l'event au server
   */
  private callGA = async () => {
    this.reset();
    this.setState({ reproducing: true, loadingText: 'Loading...' });
    this.socket.emit('generate', this.GAData);  
  }

  /**
   * Reset data
   */
  private reset = () => {
    this.setState({
      bestPlan: { gridSize: this.GAData.gridSize, placement: [], forbiddenSeats: FORBIDDEN_SEATS, score: 0 },
      reproducing: false,
      gaResponseData: { averageScore: 0, time: 0 },
      genOfBestPlan: 0,
      genAndScoreMap: new Map(),
      loadingText: '',
      error: '',
    });
  }

  /**
   * HTML
   */
  render() {
    return (
      <div className="App">
        <div className="plan-container">

          <ListGroups groups={GROUPS} />

          <button id="generate-btn" onClick={this.callGA} disabled={this.state.reproducing}>
            {
              this.state.reproducing ? this.state.loadingText : 'GENERATE!'
            }
          </button>

          <div id="main">
            <p className='error'>{ this.state.error }</p>
            {
              this.state.bestPlan && (
                <div id="best-plan" key={this.state.bestPlan.score}>
                  <b key={this.state.bestPlan.score}>Score: {this.state.bestPlan.score}</b><br />
                  <b>Génération du meilleur score: {this.state.genOfBestPlan} </b>

                  {this.state.gaResponseData.time > 0 && (
                    <p key={this.state.gaResponseData.time}>Calculé en {this.state.gaResponseData.time} secondes.</p>
                  )}
                  <PlanDisplay plan={this.state.bestPlan} />
                </div>
              )
            }
          </div>

          {this.state.genAndScoreMap.size > 0 && <GenScoreTable map={this.state.genAndScoreMap} />}
        </div>

        <div className='tools-container'>
          <Tools onChange={this.onChange.bind(this)} defaultData={this.GAData} />
        </div>
      </div>
    )
  }
}

export default App;
