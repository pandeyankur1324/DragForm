import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContent } from "@/actions/form";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();

  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, JsonElements);
      toast.success("Success", {
        description: "Your form has been saved",
      });
    } catch (error) {
      console.error("Failed to save form:", error);
      toast.warning("Error", {
        description: "Something went wrong",
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <span className="h-4 w-4">
        <HiSaveAs />
      </span>
      Save
      {loading && (
        <span className="animate-spinner">
          <FaSpinner />
        </span>
      )}
    </Button>
  );
}

export default SaveFormBtn;
