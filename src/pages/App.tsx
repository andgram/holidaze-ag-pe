import React from "react";
import "../styles/index.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 to-yellow-500 flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-extrabold text-white drop-shadow-lg mb-4 animate-bounce">
        Holidaze Rocks!
      </h1>
      <p className="text-2xl text-purple-900 font-semibold bg-white p-4 rounded-lg shadow-xl">
        Tailwind is LIVE and LOUD!
      </p>
      <button className="mt-6 px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-full hover:bg-green-700 transition duration-300">
        Test Me!
      </button>
    </div>
  );
}

export default App;
