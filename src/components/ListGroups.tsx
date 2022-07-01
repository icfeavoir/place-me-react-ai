import './ListGroups.css';
import { GroupType } from '../types/types';

type Props = {
  groups: GroupType[];
}

export const ListGroups = ({ groups }: Props) => {

  const items = groups.map((group) => {
    return (
      <div className="group-item" key={group.name} style={{ backgroundColor: group.color}}>
        {group.name} ({group.nb})
        {group.constraint && ` [${group.constraint.constraintName}]`}
      </div>
    )
  })

  return (
    <div className='groups-container'>
      {items}
    </div>
  )
}