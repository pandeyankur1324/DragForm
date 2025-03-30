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
  // const { id } = params;
  // const form = await GetFormById(Number(id));
  const form = {
    id: 4,
    userId: "user_2uZijF5HWhg3dRRxmei00spEehn",
    createdAt: "2025-03-26 09:24:49.141",
    published: false,
    name: "DemoTest",
    description: "Testing Neon Server\n",
    content: "[]",
    visits: 0,
    submissions: 0,
    shareURL: "b06cf6a8-7cec-40b4-9a0d-7d8016445078",
  };

  console.log("Form is", form);
  if (!form) {
    throw new Error("Form not found");
  }
  return <FormBuilder form={form} />;
}

export default BuilderPage;
