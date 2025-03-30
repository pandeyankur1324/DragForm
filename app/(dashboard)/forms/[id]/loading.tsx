import React from "react";
import { ImSpinner2 } from "react-icons/im";

function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <span className="animate-spin h-12 w-12">
        <ImSpinner2 />
      </span>
    </div>
  );
}

export default Loading;
