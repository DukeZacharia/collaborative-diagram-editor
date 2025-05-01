import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// socket connection globally
const socket = io('http://localhost:4000');

function App() {
  const [boxes, setBoxes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [connectFromId, setConnectFromId] = useState(null);

  const addBox = () => {
    const colors = ['lightblue', 'lightgreen', 'lightcoral', 'khaki', 'plum', 'lightsalmon', 'aquamarine'];
    const newBox = {
      id: Date.now().toString(),
      x: 100,
      y: 100,
      width: 80,
      height: 50,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setBoxes([...boxes, newBox]);
    socket.emit('action', { type: 'addBox', box: newBox });
  };

  //Select & Move Box
  const handleMouseDown = (e, box) => {
    e.stopPropagation();
    setSelectedBoxId(box.id);

    if (isConnectMode) {
      if (!connectFromId) {
        setConnectFromId(box.id);
      } else {
        const newConnection = { fromId: connectFromId, toId: box.id };
        setConnections((prev) => [...prev, newConnection]);
        socket.emit('action', {
          type: 'addConnection',
          fromId: connectFromId,
          toId: box.id,
        });
        setConnectFromId(null);
      }
      return;
    }

    // Prepare drag offset
    setDragOffset({
      x: e.clientX - box.x,
      y: e.clientY - box.y,
    });
  };

  // Handle Moving the Box
  const handleMouseMove = (e) => {
    if (selectedBoxId && !isConnectMode) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      setBoxes((prevBoxes) =>
        prevBoxes.map((box) =>
          box.id === selectedBoxId
            ? { ...box, x: newX, y: newY }
            : box
        )
      );

      // Send move event
      socket.emit('action', {
        type: 'moveBox',
        id: selectedBoxId,
        newX,
        newY,
      });
    }
  };

  const handleMouseUp = () => {
    setSelectedBoxId(null);
  };

  //Delete selected box and related connections
  const handleDelete = () => {
    if (selectedBoxId) {
      setBoxes((prev) => prev.filter((b) => b.id !== selectedBoxId));
      setConnections((prev) =>
        prev.filter(
          (conn) =>
            conn.fromId !== selectedBoxId && conn.toId !== selectedBoxId
        )
      );
      socket.emit('action', {
        type: 'deleteBox',
        id: selectedBoxId,
      });
      setSelectedBoxId(null);
    }
  };

  // Listen for actions from other users
  useEffect(() => {
    socket.on('action', (data) => {
      if (data.type === 'addBox') {
        setBoxes((prev) => [...prev, data.box]);
      } else if (data.type === 'moveBox') {
        setBoxes((prev) =>
          prev.map((b) =>
            b.id === data.id
              ? { ...b, x: data.newX, y: data.newY }
              : b
          )
        );
      } else if (data.type === 'addConnection') {
        setConnections((prev) => [
          ...prev,
          { fromId: data.fromId, toId: data.toId },
        ]);
      } else if (data.type === 'deleteBox') {
        setBoxes((prev) => prev.filter((b) => b.id !== data.id));
        setConnections((prev) =>
          prev.filter(
            (conn) =>
              conn.fromId !== data.id && conn.toId !== data.id
          )
        );
      }
    });

    // Clean up listener when component unmounts
    return () => socket.off('action');
  }, []);

  return (
    <div className="App">
      <h1>Collaborative Diagram Editor</h1>
      <div id="toolbar" style={{ marginBottom: '10px' }}>
        <button onClick={addBox}>Add Box</button>
        <button onClick={() => setIsConnectMode(!isConnectMode)}>
          {isConnectMode ? 'Exit Connect Mode' : 'Connect Boxes'}
        </button>
        <button onClick={handleDelete}>Delete Selected Box</button>
      </div>

      <svg
        id="diagram-canvas"
        width="800"
        height="600"
        style={{ border: '1px solid black' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => setSelectedBoxId(null)}
      >
        {/* Draw lines */}
        {connections.map((conn, index) => {
          const fromBox = boxes.find((b) => b.id === conn.fromId);
          const toBox = boxes.find((b) => b.id === conn.toId);
          if (!fromBox || !toBox) return null;

          return (
            <line
              key={index}
              x1={fromBox.x + fromBox.width / 2}
              y1={fromBox.y + fromBox.height / 2}
              x2={toBox.x + toBox.width / 2}
              y2={toBox.y + toBox.height / 2}
              stroke="black"
              strokeWidth={2}
            />
          );
        })}

        {/* Draw boxes */}
        {boxes.map((box) => (
          <rect
            key={box.id}
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            fill={
              box.id === selectedBoxId
                ? 'yellow'
                : box.color || 'lightblue'
            }
            stroke="black"
            onMouseDown={(e) => handleMouseDown(e, box)}
          />
        ))}
      </svg>
    </div>
  );
}

export default App;
