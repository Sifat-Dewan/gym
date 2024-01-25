"use client";

import PulseLoader from "react-spinners/PulseLoader";

export const Loader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center md:pl-[240px]">
      <PulseLoader
        color="#6d28d9"
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};
