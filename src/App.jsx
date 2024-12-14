import React from "react";
import Partition from './components/Partition'; // Import the Partition component
import "./App.css"; // Import optional styles

// Root App component
const App = () => {
  return (
    <div className="w-full h-screen"> {/* Set full screen for the main partition */}
      <Partition id="root" onRemove={() => {}} /> {/* Render the root partition */}
    </div>
  );
};

export default App;
