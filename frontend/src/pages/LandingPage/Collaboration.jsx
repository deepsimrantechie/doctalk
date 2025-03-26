import React from "react";

const Collaboration = () => {
  return (
    <div>
      {" "}
      <div>
        {/* Upper Section */}
        <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-8 px-6 py-12 md:py-16">
          {/* Left Side */}
          <div className="w-full md:w-1/3 text-center md:text-left space-y-6">
            <h1 className="text-3xl font-bold leading-snug text-gray-800">
              Your Bridge to Better Health
              <br />
              <span className="text-blue-500">Start Your Journey Today</span>
            </h1>
            <button className="bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-900 transition">
              Working Process
            </button>
          </div>

          {/* First Box (Clients) */}
          <div className="w-full md:w-1/3 max-w-md bg-gray-200 rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Our Client</h1>
                <div className="avatar-group -space-x-4 flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          alt="Client"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-700">12K+</h1>
                <h2 className="text-gray-600">Happy Clients</h2>
              </div>
            </div>
          </div>

          {/* Second Box (Progress) */}
          <div className="w-full md:w-1/3 max-w-md bg-gray-200 rounded-3xl p-6 md:p-10 shadow-lg">
            <div className="flex flex-col items-center space-y-6">
              <div
                className="radial-progress bg-primary text-white border-primary border-4"
                style={{ "--value": 70 }} // ✅ Fixed inline style
                aria-valuenow={70}
                role="progressbar"
              >
                70%
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                Heading Success
              </h1>
            </div>
          </div>
        </div>

        {/* Lower Section */}
        <div className="flex justify-center items-center px-6 py-12 md:py-16">
          <div className="w-full max-w-5xl bg-[#D8EE53] rounded-3xl p-10 md:p-16 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              {/* Left Section (Text) */}
              <div className="w-full">
                <div className="flex flex-wrap justify-center text-xl md:text-2xl font-bold gap-6 md:gap-12 text-center">
                  <h1 className="text-gray-800">Omada</h1>
                  <h1 className="text-gray-800">RobinHood</h1>
                  <h1 className="text-gray-800">SamSara</h1>
                  <h1 className="text-gray-800">FirstBase</h1>
                  <h1 className="text-gray-800">Exodus</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
