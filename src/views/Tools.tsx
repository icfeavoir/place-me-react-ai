import { useState } from 'react';
import Slider from 'react-input-slider';
import './Tools.css';

export const Tools: React.FC = () => {

  const [test, setTest] = useState(0);

  return (
    <div className="tools-list">
      <div className="grid-size">
        <p>Largeur: {test}</p>
        <Slider axis='x' xmin={0} xmax={100} xstep={1} x={test} onChange={({ x }) => setTest(x)} />
        <p>Longueur</p>
      </div>
      <div className='score'>
        <p>Score LEFT / RIGHT</p>
        <p>Score TOP / BOTTOM</p>
      </div>
      <div className='params'>
        <p>NB_PLANS</p>
        <p>SURVIVOR_PERCENT</p>
        <p>NB_REPRODUCTIONS</p>
        <p>PROBA_MUTATION</p>
        <p>NB_GENERATIONS</p>
      </div>
    </div>
  );
}