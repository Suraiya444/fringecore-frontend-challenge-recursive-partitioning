import React, { useState } from "react";
import { Resizable } from "react-resizable";

// Helper function to generate a random color
const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

// Partition component that recursively renders child partitions
const Partition = ({ id, onRemove }) => {
  const [children, setChildren] = useState([]); // Stores child partitions
  const [orientation, setOrientation] = useState(null); // Orientation for splitting ('v' or 'h')
  const [color, setColor] = useState(getRandomColor()); // Background color of the partition

  // Handles splitting the current partition into two (either vertically or horizontally)
  const handleSplit = (direction) => {
    setOrientation(direction);
    const newChild1 = { id: `${id}-1`, color: getRandomColor(), size: 50 }; // First child
    const newChild2 = { id: `${id}-2`, color: getRandomColor(), size: 50 }; // Second child
    setChildren([newChild1, newChild2]); // Add children to the state
  };

  // Handles resizing a specific child partition
  const handleResize = (index, newSize) => {
    const totalSize = children.reduce((sum, child) => sum + child.size, 0); // Total size of children
    const updatedChildren = children.map((child, i) => {
      if (i === index) return { ...child, size: newSize }; // Resize the specific child
      return { ...child, size: totalSize - newSize }; // Adjust size of the other child
    });
    setChildren(updatedChildren); // Update children with new sizes
  };

  // Removes the current partition when '-' is clicked
  const handleRemove = () => {
    onRemove(id);
  };

  return (
    <div
      className="relative flex w-full h-full"
      style={{
        flexDirection: orientation === "v" ? "row" : "column", // Set direction for children
        backgroundColor: children.length === 0 ? color : "transparent", // Set color if no children
      }}
    >
      {/* Render buttons in the center if there are no children */}
      {children.length === 0 && (
        <div className="absolute inset-0 flex justify-center items-center">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded m-1"
            onClick={() => handleSplit("v")} // Split vertically
          >
            V
          </button>
          <button
            className="bg-green-500 text-white px-2 py-1 rounded m-1"
            onClick={() => handleSplit("h")} // Split horizontally
          >
            H
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded m-1"
            onClick={handleRemove} // Remove the partition
          >
            -
          </button>
        </div>
      )}

      {/* Render child partitions */}
      {children.map((child, index) => (
        <React.Fragment key={child.id}>
          <Resizable
            axis={orientation === "v" ? "x" : "y"} // Allow resizing along the correct axis
            width={orientation === "v" ? child.size : undefined}
            height={orientation === "h" ? child.size : undefined}
            resizeHandles={orientation === "v" ? ["e"] : ["s"]}
            onResize={(e, data) =>
              handleResize(index, orientation === "v" ? data.size.width : data.size.height) // Resize child
            }
          >
            <div
              className="relative"
              style={{
                width: orientation === "v" ? `${child.size}%` : "100%", // Width for vertical split
                height: orientation === "h" ? `${child.size}%` : "100%", // Height for horizontal split
                backgroundColor: child.color, // Background color of the child
              }}
            >
              {/* Recursive rendering of child partitions */}
              <Partition id={child.id} onRemove={(childId) => {
                setChildren(children.filter((c) => c.id !== childId)); // Remove a specific child
              }} />
            </div>
          </Resizable>

          {/* Add a separator between child partitions */}
          {index < children.length - 1 && (
            <div
              className={`bg-gray-300 ${orientation === "v" ? "w-2" : "h-2"}`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Partition;
