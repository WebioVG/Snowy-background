# Snow Animation Canvas

A dynamic snow animation featuring falling snowflakes, interactive snowballs, and wind gusts. This project showcases canvas-based animations with advanced interactivity, including snowball growth, attraction mechanics, and stack absorption effects.

## Installation

1. Clone this repository and open it in VSCode:
   ```bash
   git clone https://github.com/WebioVG/Snowy-background.git
   code Snowy-background
   ```
2. Install the LiveServer free extension for VSCode if not already installed
3. Open the index.html file in VS Code, then right-click and select "Open with Live Server"
4. The project will open in your default web browser. Enjoy!

## How to Use
- Click or touch the canvas to create an interactive snowball.
- Move the snowball to absorb snowflakes or interact with the snow stack.
- Watch as periodic wind gusts move snowflakes dynamically across the canvas.

## Features

- **Falling Snowflakes**: Snowflakes drift naturally with customizable speeds and directions.
- **Interactive Snowball**:
  - Snowflakes are attracted to the snowball and absorbed upon collision.
  - Snowball grows in size as it absorbs snowflakes and interacts with the snow stack.
  - Dynamic snow texture adds a realistic appearance to the snowball.
- **Snow Stack**:
  - Snowflakes accumulate to form a stack at the bottom of the canvas.
  - The snowball can absorb snow from the stack to increase its size.
- **Wind Gusts**:
  - Periodic gusts of wind move snowflakes dynamically across the canvas.
  - Curved wind lines visually indicate wind direction and intensity.
- **Mobile and Desktop Support**:
  - Responsive canvas adapts to various screen sizes.
  - Full support for touch and mouse interactions.

## Project structure

```
src/
├── classes/
│   ├── CanvasInteractivity.js   # Manages interactions (mouse/touch)
│   ├── CursorAttractor.js       # Interactive snowball mechanics
│   ├── GustOfWind.js            # Wind gust animation and effects
│   ├── SnowCanvas.js            # Main canvas animation logic
│   ├── Snowflake.js             # Snowflake behavior and rendering
│   ├── SnowflakeManager.js      # Handles snowflake lifecycle
│   ├── SnowflakeMeltEffect.js   # Melting effect for absorbed snowflakes
│   └── SnowStack.js             # Logic for managing the snow stack
├── index.css                    # Styles for the canvas and page
├── index.html                   # Entry point for the application
├── index.js                     # Initializes the canvas
└── README.md                    # Project documentation
```

## Customization
You can tweak the following features by modifying the corresponding files:

- Snowflake behavior (```Snowflake.js```):
- Speed, size, and drift of snowflakes.
- Wind Gusts (```GustOfWind.js```):
- Frequency, direction, and intensity of wind.
- Snowball interaction (```CursorAttractor.js```):
- Attraction radius and growth mechanics.