import { Plan } from "../models/Plan";

export class GAService {

  sortPlans(plans: Plan[]) {
    return plans.sort((a, b) => b.score - a.score );
  }

  keepOnly(plans: Plan[], toKeep: number) {
    return plans.slice(0, toKeep);
  }

  /**
   * Technique de sélection de plan.
   * Chaque plan de la liste peut être choisi, mais plus son score est bon,
   * plus sa prob d'être choisie est grande.
   */
  private rouletteWheelSelection(plans: Plan[]): Plan {
    const sortedPlans = this.sortPlans(plans);

    // par défaut, on choisit le premier plan
    let selectedPlan: Plan = sortedPlans[0];

    const sumScore = sortedPlans.reduce((acc, plan) => acc + plan.score, 0);
    const choosedScore = Math.floor(Math.random() * sumScore);

    let scoreCounter = 0
    sortedPlans.every(plan => {
      scoreCounter += plan.score
      // retourne une copie
      if (scoreCounter >= choosedScore) {
        selectedPlan = plan;
        // every doit retourner false pour arrêter la boucle
        return false;
      }
      return true;
    });

    return selectedPlan;
  }

  /**
   * Création de nouveaux plans à partir des plans existants
   */
  reproduce(plans: Plan[], SURVIVOR_PERCENT: number, NB_REPRODUCTIONS: number) {
    // on "tue" une partie de la population
    const bestPlans = this.sortPlans(plans);
    const survivors = this.keepOnly(bestPlans, plans.length * SURVIVOR_PERCENT);

    // le reste peut se reproduire
    const newPlans = [];
    for (let i = 0; i < NB_REPRODUCTIONS; i++) {
      const father = this.rouletteWheelSelection(survivors)?.clone();
      const mother = this.rouletteWheelSelection(survivors)?.clone();
    
      if (father && mother) {
        const child = Plan.createFromParents(father, mother);
        // console.log(`father\n${father.toString()}`);
        // console.log(`mother\n${mother.toString()}`);
        // console.log(`child\n${child.toString()}`);
        newPlans.push(child);
      }
    }
    // après toutes les reproductions, on ajoute les plans existants à la population
    const nextPlansGeneration = this.sortPlans([...survivors, ...newPlans]);
    console.log('score', nextPlansGeneration.map(plan => plan.score));

    return nextPlansGeneration;
  }

}