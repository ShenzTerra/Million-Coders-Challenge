
import { Level, CommandType } from './types';

export const LEVELS: Level[] = [
  {
    id: 1,
    gridSize: 5,
    title: "Level 1: Forward Motion",
    message: "Help Million Coders reach the battery! Try moving forward.",
    startPos: { x: 0, y: 2 },
    startDir: 'E',
    goalPos: { x: 4, y: 2 },
    obstacles: [],
    availableCommands: [CommandType.MOVE, CommandType.TURN_LEFT, CommandType.TURN_RIGHT]
  },
  {
    id: 2,
    gridSize: 5,
    title: "Level 2: Turning Corners",
    message: "You'll need to turn to reach this one!",
    startPos: { x: 1, y: 3 },
    startDir: 'E',
    goalPos: { x: 3, y: 1 },
    obstacles: [{ x: 3, y: 3 }, { x: 1, y: 1 }],
    availableCommands: [CommandType.MOVE, CommandType.TURN_LEFT, CommandType.TURN_RIGHT]
  },
  {
    id: 3,
    gridSize: 5,
    title: "Level 3: Obstacle Course",
    message: "Watch out for walls! Navigate the maze.",
    startPos: { x: 0, y: 4 },
    startDir: 'N',
    goalPos: { x: 4, y: 0 },
    obstacles: [
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, 
      { x: 2, y: 1 }, { x: 2, y: 0 }, { x: 4, y: 2 }
    ],
    availableCommands: [CommandType.MOVE, CommandType.TURN_LEFT, CommandType.TURN_RIGHT]
  },
  {
    id: 4,
    gridSize: 6,
    title: "Level 4: Advanced Coordinates",
    message: "Use 'Go To' to jump to specific points!",
    startPos: { x: 0, y: 0 },
    startDir: 'E',
    goalPos: { x: 5, y: 5 },
    obstacles: [],
    availableCommands: [CommandType.MOVE, CommandType.TURN_LEFT, CommandType.TURN_RIGHT, CommandType.GO_TO]
  },
  {
    id: 5,
    gridSize: 5,
    title: "Level 5: Master Task",
    message: "Task: Visit all 4 corners and the center! Use 'Glide' to see the path.",
    startPos: { x: 2, y: 2 },
    startDir: 'N',
    goalPos: { x: 2, y: 2 }, // Center is the final goal
    obstacles: [],
    availableCommands: [CommandType.GO_TO, CommandType.GLIDE],
    isSpecialTask: true
  }
];
