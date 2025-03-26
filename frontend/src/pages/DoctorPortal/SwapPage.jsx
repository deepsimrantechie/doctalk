import React from "react";

const SwapPage = () => {
  return (
    <div className="mr-10 ml-10">
      <h1 className="mb-4 text-xl text-center font-semibold">
        Swap It ,It May Realease your strees
      </h1>
      <figure className="diff aspect-16/9 min-h-40 " tabIndex={0}>
        <div className="diff-item-1" role="img">
          <div className="bg-primary text-primary-content grid place-content-center text-9xl font-black">
            Doctor
          </div>
        </div>
        <div className="diff-item-2" role="img" tabIndex={0}>
          <div className="bg-base-200 grid place-content-center text-9xl font-black">
            Pateint
          </div>
        </div>
        <div className="diff-resizer"></div>
      </figure>
    </div>
  );
};

export default SwapPage;
