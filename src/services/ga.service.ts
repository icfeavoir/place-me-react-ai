import { Plan } from "../models/Plan";

export class GAService {

  private NB_REPRODUCTIONS: number;
  private _plans: Plan[];


  constructor(NB_REPRODUCTIONS: number) {
    this.NB_REPRODUCTIONS = NB_REPRODUCTIONS;
    this._plans = [];
  }

  get plans(): Plan[] {
    return this._plans;
  }

  set plans(plans: Plan[]) {
    this._plans = plans;
  }

  private sortPlans() {
    this._plans = this._plans.sort((a, b) => {
      return a.score - b.score;
    });
  }

  private keepOnly(nb: number) {
    this._plans = this._plans.slice(0, nb);
  }

  /**
   * Technique de sélection de plan.
   * Chaque plan de la liste peut être choisi, mais plus son score est bon,
   * plus sa prob d'être choisie est grande.
   */
  private rouletteWheelSelection(): Plan {
    this.keepOnly(this._plans.length * 0.8);
    this.sortPlans();

    // par défaut, on choisit le premier plan
    let selectedPlan: Plan = this.plans[0];

    const sumScore = this._plans.reduce((acc, plan) => acc + plan.score, 0);
    const choosedScore = Math.floor(Math.random() * sumScore);

    let scoreCounter = 0
    this.plans.every(plan => {
      scoreCounter += plan.score
      // retourne une copie
      if (scoreCounter >= choosedScore) {
        selectedPlan = plan;
        return false;
      }
      // every doit retourner false pour arrêter la boucle
      return false;
    });

    console.log(`Choosed plan with score ${selectedPlan.score}`);
    return selectedPlan;
  }

  /**
   * Création de nouveaux plans à partir des plans existants
   */
  reproduce() {
    for (let i = 0; i < this.NB_REPRODUCTIONS; i++) {
      const mother = this.rouletteWheelSelection();
      const father = this.rouletteWheelSelection();
      const newPlan = Plan.createFromParents(father, mother);
    }
  }

}