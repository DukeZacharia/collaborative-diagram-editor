# Collaborative Diagram Editor

## Overview

A simple web-based diagram editor that allows users to draw rectangular boxes, connect them with lines, and collaborate in real-time with other users. Adding, moving, connecting, and deleting boxes are synchronized across all connected clients using WebSockets.

## Features

- Add rectangular boxes with random colors.
- Select and move boxes; connecting lines update dynamically.
- Connect boxes via "Connect Mode".
- Delete selected boxes and their connections.
- Real-time collaboration via WebSockets.

## Tech Stack

- **Frontend**: React, SVG for rendering, socket.io-client
- **State Management**: React component state (`useState`)
- **Backend**: Node.js, Express, Socket.IO

## Rendering and State Management

- **Rendering**: Implemented using SVG for flexibility with shapes and dynamic lines.
- **State**: Managed locally using React's `useState`. Real-time updates are synced via WebSocket events.

## How to Run
```
cd diagrame-editor
make sure to see the package.json on the same folder then run npm install to install the dependencies

npm install
```


```
Terminal 1
cd diagrame-editor
node server.js
```

```
Terminal 2
cd diagrame-editor
npm start
```


## Test collaboration
 - Open the app in two browser tabs or two devices and perform actions (add, move, connect, delete). The diagram will stay synchronized between all connected clients.


```Terminal logs
When actions are performed, you will also see logs appearing in the terminal where the WebSocket server is running:

A user connected: j6-XYAFVKTT7RgJxAAAB
Received action: addBox
Received action: moveBox
Received action: addConnection
```

## How to Use the Diagram Editor

### Add a Box
- Click the **"Add Box"** button.
- A new rectangular box with a random color will appear at a default position.

### Move a Box
- Click and hold on any box.
- Drag the box to a new position.
- All connected lines will automatically update as the box moves.

### Connect Boxes
- Click the **"Connect Boxes"** button to enter **Connect Mode**.
- Click the first box (starting box).
- Then click a second box (target box).
- A line will appear connecting the two boxes.
- Click the **"Exit Connect Mode"** button to return to normal editing.

### Delete a Box
- Click on the box you want to delete (it will highlight).
- Click the **"Delete Selected Box"** button.
- The box and all its connected lines will be removed.


