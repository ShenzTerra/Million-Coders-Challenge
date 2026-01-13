
export enum CommandType {
  MOVE = 'MOVE',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  GO_TO = 'GO_TO',
  GLIDE = 'GLIDE'
}

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface Position {
  x: number;
  y: number;
}

export interface Command {
  id: string;
  type: CommandType;
  x?: number;
  y?: number;
}

export interface Level {
  id: number;
  gridSize: number;
  title: string;
  message: string;
  startPos: Position;
  startDir: Direction;
  goalPos: Position;
  obstacles: Position[];
  availableCommands: CommandType[];
  isSpecialTask?: boolean; // For the corners + center task
}
