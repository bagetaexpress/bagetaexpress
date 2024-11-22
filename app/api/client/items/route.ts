import itemRepository from "@/repositories/item-repository";

async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const schoolID = searchParams.get("schoolID");

  if (!schoolID || schoolID === "") {
    return new Response("Missing schoolID", { status: 400 });
  }
  if (isNaN(Number(schoolID))) {
    return new Response("Invalid schoolID", { status: 400 });
  }

  const items = await itemRepository.getMany({
    schoolId: parseInt(schoolID),
  });
  return Response.json(items);
}

export { GET };
