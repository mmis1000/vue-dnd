import { createType } from '@mmis1000/vue-dnd'
// the DataType is what you used to identify the item for drag
type BallDataType = [item: string, type: 'ball', from: string]
export const BallType = createType<BallDataType>()

type PaperDataType = [item: string, type: 'paper', from: string]
export const PaperType = createType<PaperDataType>()
