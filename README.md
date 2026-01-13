# Portfolio Website

This repository contains the source code for my personal portfolio website, built with **React + TypeScript** and structured using a lightweight **Model–View architecture**. The site showcases my background, experience, and projects, and features an interactive **real-time fluid dynamics simulation** rendered on an HTML canvas.

---

## Features

### Clean Model–View Separation
- Application state (bio, experiences, projects) is centralized in a model layer
- View components remain stateless and declarative

### Interactive Fluid Simulation Background
- Real-time 2D fluid dynamics solver based on simplified Navier–Stokes equations
- Mouse movement injects velocity and density into the simulation
- Custom canvas renderer for smooth, organic motion

### Fully Componentized UI
- Modular React components for Bio, Experience, and Projects
- Data-driven rendering from JSON files

### Type-Safe Codebase
- Written entirely in TypeScript
- Explicit interfaces for application state, projects, and experiences

---

## Architecture Overview
src/

├── main/ # Application entry point

├── model/ # Centralized application state

│ └── data/ # Experience and project JSON data

├── view/ # Top-level React view

├── components/ # Reusable UI components

│ ├── Bio

│ ├── Experiences

│ ├── Projects

│ └── FluidBackground

└── fluidSimulation/ # Custom fluid dynamics engine

---

## Model

The `Model` class owns the full application state, including:
- Portfolio title and bio
- Experience and project data loaded from JSON

State is cloned before being exposed to prevent mutation and keep rendering predictable.

---

## View

The view layer retrieves immutable state from the model and renders:
- A hero bio section
- Experience and project panels
- A full-screen animated fluid background

---

## Fluid Simulation

The background animation is powered by a custom-built **grid-based fluid solver** that simulates:
- Velocity advection
- Density diffusion
- Projection for incompressible flow
- Boundary constraints

Each animation frame:
- Updates velocity fields
- Updates and advects density
- Applies decay for smooth fading
- Renders velocity vectors directly to the canvas

Mouse movement dynamically injects energy into the fluid, creating an interactive visual effect.

---

## Technologies Used

- React
- TypeScript
- HTML Canvas
- CSS
