import { PlanType } from '../types/types';

export const PlanDisplay: React.FC<{ plan: PlanType }> = ({ plan }) => {

  function renderRows() {
    const { height } = plan.gridSize;
    return <table>
      <tbody>
        { Array.from({ length: height }, (_, rowIndex) => renderRow(rowIndex)) }
      </tbody>
    </table>;
  }

  function renderRow(rowIndex: number) {
    const { width } = plan.gridSize;
    return <tr key={`row-${rowIndex}`}>
      { Array.from({ length: width }, (_, cellIndex) => renderCell(rowIndex, cellIndex)) }
    </tr>;
  }

  function renderCell(rowIndex: number, cellIndex: number) {
    const { placement } = plan;
    const groupMember = placement.find(({ seat: groupMemberSeat }) => groupMemberSeat.line === rowIndex && groupMemberSeat.col === cellIndex)
    
    let backgroundColor = groupMember?.groupColor ?? 'initial';
    // if (plan.isForbiddenSeatAt(rowIndex, cellIndex)) {
    //   backgroundColor = 'grey';
    // }

    let border = '1px solid black';
    // if (plan.getConstraintSeatAt(seat)) {
    //   border = '3px dotted red';
    // }

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