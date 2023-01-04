import { createType } from '@mmis1000/vue-dnd'
// the DataType is what you used to identify the item for drag
type DataType = string
export const BallType = createType<DataType>()
