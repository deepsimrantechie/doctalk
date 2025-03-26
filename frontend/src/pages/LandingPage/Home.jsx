import React from "react";
import assets from "../../assets/assets";

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen  p-6">
      <div className="w-full max-w-6xl bg-gray-200 rounded-3xl p-20 shadow-lg mx-6 lg:mx-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Section (Text) */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-bold leading-tight text-gray-800">
              Empowering <br />
              Lives Through <br />
              <span className="text-blue-500">Health</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Navigating Health together.Your trusted <br /> medical store
            </p>
            <button className="mt-4 font-bold">Get Started now</button>
          </div>

          {/* Right Section (Image) */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={assets.Hospital}
              alt="Hospital"
              className="w-96 h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
