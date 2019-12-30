
export interface User {
  id: string,
}

export interface UserWithName extends User{
  name: string,
}

export interface Position {
  x: number,
  y: number,
}

export interface Cell {
  position: Position,
  owner: User,
}

export interface Board {
  cells: Cell[],
  possibleSteps: Position[],
  order: UserWithName[],
  lastStep: Cell,
  currentPlayer: User | null,
  winner: UserWithName | null,
  winnerLine: Position[] | null,
}

export interface View {
  offset: Position,
  size: Position,
  symbols: { [id: string]: string },
}
