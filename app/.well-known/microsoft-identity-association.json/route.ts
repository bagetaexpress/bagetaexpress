async function GET(): Promise<Response> {
  return Response.json({
    associatedApplications: [
      {
        applicationId: "58f6bf52-ba2d-4150-9e55-790e1010a1b0",
      },
    ],
  });
}

export { GET };
