# Collaborative Diagram Editor

## Overview

A simple web-based diagram editor that allows users to draw rectangular boxes, connect them with lines, and collaborate in real-time with other users. Actions such as adding, moving, connecting, and deleting boxes are synchronized across all connected clients using WebSockets.

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

cd diagrame-editor

```
node server.js
```

```
New Terminal

npm start ```


## Test collaboration
 - Open the app in two browser tabs or two devices and perform actions (add, move, connect, delete). The diagram will stay synchronized between all connected clients.



## How to Run

### 1️⃣ Install dependencies

In the project root (`diagram-editor`):

```bash
npm install