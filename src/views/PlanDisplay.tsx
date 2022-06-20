import { Plan } from '../models/Plan';
import { Seat } from '../types/types';

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
    const seat: Seat = { line: rowIndex, col: cellIndex }
    const groupMember = plan.getGroupMemberAt(seat);
    
    let backgroundColor = groupMember?.groupColor ?? 'initial';
    if (plan.isForbiddenSeatAt(rowIndex, cellIndex)) {
      backgroundColor = 'grey';
    }

    let border = 'initial';
    if (plan.getConstraintSeatAt(seat)) {
      border = '3px dotted red';
    }

    let text = '';
    if (groupMember) text += `${groupMember?.groupName} (${groupMember.groupNb})`;
    if (groupMember?.constraint) text += ` [${groupMember?.constraint?.id}]`;


    return (
      <td
        key={`cell-${rowIndex}-${cellIndex}-${text}`}
        style={{ backgroundColor, border }}
      >
        { text }
      </td>
    );
  }

  return (
    <>
      { renderRows() }
    </>
  );
}