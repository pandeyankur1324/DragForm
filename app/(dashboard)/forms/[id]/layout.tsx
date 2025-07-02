import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  return <div className="flex w-full flex-col flex-grow items-center mx-auto">{children}</div>;
=======
  return (
    <div className="w-full mx-auto">
      {children}
    </div>
  );
>>>>>>> 4185d45 (updated all the bugs)
}

export default layout;
