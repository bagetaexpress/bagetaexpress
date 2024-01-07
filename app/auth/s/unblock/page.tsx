import Scanner from "../_components/scanner";

export default function UnblockPage() {
  return (
    <div className=" relative min-h-full max-w-screen-sm mx-auto">
      <h1 className="text-2xl font-semibold pt-2">Odblokovať</h1>
      <Scanner url="/auth/s/unblock" />
    </div>
  );
}
