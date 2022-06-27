import { ConstraintSeatsType, GridSizeType } from "../../types/types"

export const genPremierRangContraint = ({ width, height }: GridSizeType): ConstraintSeatsType => ({
  name: 'PR',
  seats: Array.from({ length: width }, (_, i) => ({ line: height - 1, col: i }))
})
