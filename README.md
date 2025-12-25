# Isometric Game Framework - React Three Fiber

A simple framework for building isometric games like Crossy Road using React Three Fiber.

## Features

- Orthographic isometric camera view
- Player movement with arrow keys (or WASD)
- Camera tracking that follows the player
- Lightweight AABB collision detection system
- Ground plane and obstacle cubes

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the game.

## Controls

- **Arrow Keys** or **WASD**: Move the player (blue cube)

## Project Structure

```
src/
├── components/
│   ├── Player.tsx       # Player component with movement controls
│   ├── Ground.tsx       # Ground plane component
│   ├── Obstacle.tsx     # Obstacle cube component
│   └── Camera.tsx       # Camera controller for tracking
├── utils/
│   └── collision.ts     # AABB collision detection system
├── App.tsx             # Main game scene
└── main.tsx            # App entry point
```

## Collision System

The project uses a custom lightweight AABB (Axis-Aligned Bounding Box) collision detection system located in `src/utils/collision.ts`. This prevents the player from moving through obstacles.

## Next Steps

- Add infinite terrain generation
- Implement scoring system
- Add different obstacle types
- Create animations and particle effects
- Add sound effects
