// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GetFormById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import React from "react";

async function BuilderPage({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const form = await GetFormById(Number(id));

  console.log("Form is", form);
  if (!form) {
    throw new Error("Form not found");
  }
  return <FormBuilder form={form} />;
}

export default BuilderPage;
