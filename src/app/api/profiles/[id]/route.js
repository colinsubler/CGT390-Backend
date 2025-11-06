let profiles = [
  { id: 1, name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
  { id: 2, name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
];

export async function GET(_, { params }) {
  const id = Number(params.id);
  const profile = profiles.find(p => p.id === id);
  if (!profile)
    return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(profile, { status: 200 });
}

export async function PUT(request, { params }) {
  const id = Number(params.id);
  const profile = profiles.find(p => p.id === id);
  if (!profile)
    return Response.json({ error: "Not found" }, { status: 404 });

  try {
    const data = await request.json();
    const { name, major, year, gpa } = data;

    if (
      (year && (typeof year !== "number" || year < 1 || year > 4)) ||
      (gpa && (typeof gpa !== "number" || gpa < 0 || gpa > 4))
    ) {
      return Response.json({ error: "Invalid fields" }, { status: 400 });
    }

    Object.assign(profile, data);
    return Response.json(profile, { status: 200 });
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export const PATCH = PUT;
