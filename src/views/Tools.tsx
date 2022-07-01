import './Tools.css';

import { useState } from 'react';
import { Slider } from '../components/Slider';
import { GADTO } from '../types/types';

type ToolsProps = {
  onChange: Function;
  defaultData: Partial<GADTO>;
}

export const Tools = ({ onChange, defaultData }: ToolsProps) => {

  const [width, setWidth] = useState(defaultData?.gridSize?.width ?? 10);
  const [height, setHeight] = useState(defaultData?.gridSize?.height ?? 10);

  const [leftRightScore, setLeftRightScore] = useState(defaultData?.scores?.leftRightScore ?? 10);
  const [topBottomScore, setTopBottomScore] = useState(defaultData?.scores?.topBottomScore ?? 5);
  const [malusScore, setMalusScore] = useState(defaultData?.scores?.malusScore ?? -100);
  
  const [nbPlans, setNbPlans] = useState(defaultData?.nbPlans ?? 10);
  const [survivorProportion, setSurvivorProportion] = useState(defaultData?.survivorProportion ?? 10);
  const [nbReproductions, setNbReproductions] = useState(defaultData?.nbReproductions ?? 10);
  const [probaMutation, setProbaMutation] = useState(defaultData?.probaMutation ?? 10);
  const [nbGenerations, setNbGenerations] = useState(defaultData?.nbGenerations ?? 10);


  const emitValues = () => {
    const data: Partial<GADTO> = {
      gridSize: { width, height },
      scores: {
        leftRightScore,
        topBottomScore,
        malusScore,
      },
      nbPlans,
      survivorProportion,
      nbReproductions,
      probaMutation,
      nbGenerations,
    }
    onChange(data);
  }

  return (
    <div className="tools-list">
      <button onClick={emitValues}>VALIDER</button>
      <div className="tool-group">
        <span className='tool-title'>Grille</span>
        <Slider name={'Lignes'} x={height} xmin={1} xmax={15} xstep={1} onChange={setHeight} />
        <Slider name={'Colonnes'} x={width} xmin={1} xmax={15} xstep={1} onChange={setWidth} />
      </div>
      <div className='tool-group'>
        <span className='tool-title'>Score</span>
        <Slider name={'Droite / Gauche'} x={leftRightScore} xmin={1} xmax={30} xstep={1} onChange={setLeftRightScore} />
        <Slider name={'Haut / Bas'} x={topBottomScore} xmin={1} xmax={30} xstep={1} onChange={setTopBottomScore} />
        <Slider name={'Malus'} x={malusScore} xmin={-1000} xmax={0} xstep={1} onChange={setMalusScore} />
      </div>
      <div className='tool-group'>
        <span className='tool-title'>Paramètres</span>
        <Slider name={'Nombre de plans'} x={nbPlans} xmin={0} xmax={500} xstep={10} onChange={setNbPlans} />
        <Slider name={'Proportion survivants (%)'} x={survivorProportion} xmin={0} xmax={100} xstep={1} onChange={setSurvivorProportion} />
        <Slider name={'Nombre de reproductions'} x={nbReproductions} xmin={0} xmax={100} xstep={1} onChange={setNbReproductions} />
        <Slider name={'Probabilité de mutation (%)'} x={probaMutation} xmin={0} xmax={100} xstep={1} onChange={setProbaMutation} />
        <Slider name={'Nombre de générations'} x={nbGenerations} xmin={0} xmax={5000} xstep={50} onChange={setNbGenerations} />
      </div>
    </div>
  );
}