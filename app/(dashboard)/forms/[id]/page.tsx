import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import React, { ReactNode } from "react";
import { StatsCard } from "../../page";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

async function FormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const form = await GetFormById(Number(id));
  console.log("Form is", form);

  if (!form || "error" in form) {
    throw new Error("Form not found");
  }

  const { visits, submissions } = form;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="py-10 border-b border-muted">
          <div className="flex justify-between container">
            <h1 className="text--4xl font-bold truncate">{form.name}</h1>
            <VisitBtn shareUrl={form.shareURL} />
          </div>
        </div>
        <div className="py-4 border-b border-muted">
          <div className="container flex gap-2 items-center justify-between">
            <FormLinkShare shareUrl={form.shareURL} />
          </div>
        </div>
        <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cold-2 lg:grid-cols-4 container">
          <StatsCard
            title="Total visits"
            icon={
              <div className="text-blue-600">
                <LuView />
              </div>
            }
            helperText="All time form visits"
            value={visits.toLocaleString() || ""}
            loading={false}
            className="shadow-md shadow-blue-600"
          />

          <StatsCard
            title="Total submissions"
            icon={
              <div className="text-yellow-600">
                <FaWpforms />
              </div>
            }
            helperText="All time form submissions"
            value={submissions.toLocaleString() || ""}
            loading={false}
            className="shadow-md shadow-yellow-600"
          />

          <StatsCard
            title="Submission rate"
            icon={
              <div className="text-green-600">
                <HiCursorClick />
              </div>
            }
            helperText="Visits that result in form submission"
            value={submissionRate.toLocaleString() + "%" || ""}
            loading={false}
            className="shadow-md shadow-green-600"
          />

          <StatsCard
            title="Bounce rate"
            icon={
              <div className="text-red-600">
                <TbArrowBounce />
              </div>
            }
            helperText="Visits that leave without interacting"
            value={bounceRate.toLocaleString() + "%" || ""}
            loading={false}
            className="shadow-md shadow-red-600"
          />
        </div>

        <div className="container pt-10">
          <SubmissionTable id={form.id} />
        </div>
      </div>
    </div>
  );
}

export default FormDetailPage;

type Row = {
  [key: string]: string;
} & {
  submittedAt: Date;
};

async function SubmissionTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form || "error" in form) {
    throw new Error("form not found");
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];
    form.FormSubmissions.forEach((submission: typeof form.FormSubmissions[number]) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                return (
                  <TableHead key={column.id} className="uppercase">
                    {column.label}
                  </TableHead>
                );
              })}
              <TableHead className="text-muted-foreground text-right uppercase">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}
