import React from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";

function SaveFormBtn() {
  return (
    <Button variant={"outline"} className="gap-2">
      <span className="h-4 w-4">
        <HiSaveAs />
      </span>
      Save
    </Button>
  );
}

export default SaveFormBtn;
