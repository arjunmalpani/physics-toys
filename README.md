# Physics Toys

A small physics playground built with React Three Fiber and Rapier. Drop shapes into an arena and watch them fall, bounce and pile up.

![Preview](./screenshots/preview.png)

## Features

- Rapier physics: gravity, collisions, friction and bounce
- Random boxes and balls spawn with their own size and bounciness
- Colour shows bounciness, so you can read the physics by eye
- Arena with a floor and walls, and a debug view of the colliders
- Toy count capped at 60 (the oldest is removed)

## Tech

React, Vite, Three.js, @react-three/fiber, @react-three/drei, @react-three/rapier

## Run locally

    npm install
    npm run dev

## Roadmap

- [ ] Click a toy to launch it with an impulse
- [ ] Goal zone and score counter
- [ ] Deploy

## What I'm learning

- Dynamic vs fixed rigid bodies, and colliders vs meshes
- Why physics objects own their position (not React state)
- Sleeping bodies, and why a settled pile is cheap