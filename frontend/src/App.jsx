import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "16px",
          },
        }}
      />
      <Route
        path="/"
        element={
          <div>
            <h1 className="text-4xl font-bold text-blue-600">HackTrail 3.0</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
