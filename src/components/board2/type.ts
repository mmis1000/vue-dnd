import { createType } from "../../packages/vue-dnd";

export type Piece = 'knight' | 'root'
export const KnightType = createType<['knight', number, number]>()
export const RootType = createType<['root', number, number]>()