import './Slider.css';
import InputSlider from "react-input-slider";

type SliderProps = {
  name: string;
  x: number;
  xmin: number;
  xmax: number;
  xstep: number;
  onChange: Function;
}

export const Slider = ({ name, x, xmin, xmax, xstep, onChange }: SliderProps) => {

  return (
    <div className='slider-container'>
      <p>{name}</p>
      <span className='slider'>
        <InputSlider xmin={xmin} xmax={xmax} xstep={xstep} x={x} onChange={({ x }) => onChange(x)} />
      </span>
      <span
        style={{ marginLeft: '.5rem' }}
      >{x}</span>
    </div>
  )
}