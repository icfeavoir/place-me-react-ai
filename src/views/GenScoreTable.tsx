import './Tools.css';

type Props = {
  map: Map<number, number>;
}

export const GenScoreTable = ({ map }: Props) => {

  const renderRows = () => {
    const res: JSX.Element[] = [];
    map.forEach((value, key) => {
      res.push(renderRow(key, value));
    });

    return res;
  }

  const renderRow = (key: number, value: number) => {
    return (<tr>
      <td>{key}</td>
      <td>{value}</td>
    </tr>)
  }

  return (
    <table className='gen-score-table'>
      <tr>
        <th>Génération</th>
        <th>Score</th>
      </tr>
      { renderRows() }
    </table>
  );
}