"use client";

import { GetFormById } from "@/actions/form";
type Form = Awaited<ReturnType<typeof GetFormById>>;
import React, { useEffect, useState } from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { ImSpinner2 } from "react-icons/im";
import useDesigner from "./hooks/useDesigner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Confetti from "react-confetti";
import { UpdateFormContent } from "@/actions/form";

function FormBuilder({ form }: { form: NonNullable<Form> }) {
  console.log(form);

  const { elements, setElements, setSelectedElement } = useDesigner();
  const [isReady, setIsReady] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (isReady) return;
    if (!form || "error" in form) return;
    const elements = JSON.parse(form.content);
    setElements(elements);
    setSelectedElement(null);
    setIsReady(true);
    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [form, setElements, setSelectedElement, isReady]);

  // Auto-save effect: save elements whenever they change (after initial load)
  useEffect(() => {
    if (!isReady) return;
    if (!form || "error" in form) return;
    // Don't auto-save if not ready or if form is published (optional)
    if (form.published) return;
    const save = async () => {
      try {
        await UpdateFormContent(form.id, JSON.stringify(elements));
        toast.success("Auto-saved", { description: "Form changes saved" });
      } catch (error) {
        console.error(error);
        toast.warning("Auto-save error", { description: "Could not auto-save form" });
      }
    };
    save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <span className="animate-spin h-12 w-12">
          <ImSpinner2 />
        </span>
      </div>
    );
  }

  if (!form || "error" in form) {
    throw new Error("Form not found");
  }

  const shareUrl = `${window.location.origin}/submit/${form.shareURL}`;

  if (form.published) {
    return (
      <>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1000}
        />
        <div className="flex flex-col items-center justify-center  h-full w-full ">
          <div className="max-w-md">
            <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
              🎊🎊 Form Published 🎊🎊
            </h1>
            <h2 className="text-2xl">Share this form</h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              Anyone with the link can view and submit the form
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl}></Input>
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Copied!", {
                    description: "Link copied to clipboard",
                  });
                }}
              >
                Copy link
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link href={"/"} className="gap-2">
                  <BsArrowLeft />
                  Go back home
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link href={`/forms/${form.id}`} className="gap-2">
                  <BsArrowLeft />
                  Form details
                  <BsArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form:</span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </nav>
        <div
          className="flex w-full flex-grow items-center justify-center
          relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]"
        >
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

export default FormBuilder;
