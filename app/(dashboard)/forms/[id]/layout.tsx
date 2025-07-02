import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full mx-auto">
      {children}
    </div>
  );
}

export default layout;
