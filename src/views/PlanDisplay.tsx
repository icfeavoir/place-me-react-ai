import { Plan } from '../models/Plan';

export const PlanDisplay: React.FC<{ plan: Plan }> = ({ plan }) => {

  function renderRows() {
    return <table>
      <tbody>
        { plan.grid.map((row, rowIndex) => renderRow(rowIndex)) }
      </tbody>
    </table>;
  }

  function renderRow(rowIndex: number) {
    return <tr key={`row-${rowIndex}`}>
      { plan.grid[rowIndex].map((cell, cellIndex) => renderCell(rowIndex, cellIndex)) }
    </tr>;
  }

  function renderCell(rowIndex: number, cellIndex: number) {
    const group = plan.getGroupMemberAt(rowIndex, cellIndex);
    
    let backgroundColor = group?.groupColor ?? 'initial';
    if (plan.isForbiddenSeatAt(rowIndex, cellIndex)) {
      backgroundColor = 'grey';
    }

    return (
      <td
        key={`cell-${rowIndex}-${cellIndex}-${group?.groupName}`}
        style={{ backgroundColor }}
      >
        { group?.groupName }
      </td>
    );
  }

  return (
    <>
      { renderRows() }
    </>
  );
}