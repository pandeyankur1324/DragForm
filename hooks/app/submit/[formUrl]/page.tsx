import { GetFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import React from "react";

async function SubmitPage({
  params,
}: {
  params: Promise<{ formUrl: string }>;
}) {
  const { formUrl } = await params;
  const form = await GetFormContentByUrl(formUrl);
  console.log(form);

  if (!form) {
    throw new Error("form not found");
  }
  const temp = form.content.substring(1, form.content.length - 1);
  console.log(temp)
  const formContent = JSON.parse(form.content) as FormElementInstance[];
  console.log(formContent);

  return <FormSubmitComponent formUrl={formUrl} content={formContent} />;
}

export default SubmitPage;
