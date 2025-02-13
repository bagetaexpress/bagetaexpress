import EmployeeTable from "./_components/employee-table";
import SellerTable from "./_components/seller-table";
import { AddEmployeeErrors, AddSellerErrors } from "./access-errors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bageta.express | Srpáva prístupu",
};

export default async function AccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className=" relative min-h-full">
      <h1 className="text-3xl font-semibold pt-2">Správa účtov</h1>
      <h2 className="text-2xl font-semibold pt-4">Zamestnanci</h2>
      <EmployeeTable
        err={searchParams.EmpError as AddEmployeeErrors | undefined}
      />
      <h2 className="text-2xl font-semibold pt-4">Predajcovia</h2>
      <SellerTable
        err={searchParams.SellerError as AddSellerErrors | undefined}
      />
    </div>
  );
}
