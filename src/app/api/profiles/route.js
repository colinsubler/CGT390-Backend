let profiles = [
  { id: 1, name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
  { id: 2, name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const major = searchParams.get("major");
  const year = searchParams.get("year");
  const q = searchParams.get("q");

  let results = profiles;

  if (major) results = results.filter(p => p.major.toLowerCase() === major.toLowerCase());
  if (year) results = results.filter(p => p.year === Number(year));
  if (q) results = results.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  return Response.json(results, { status: 200 });
}

export async function POST(request) {
  try {
    const { name, major, year, gpa } = await request.json();

    if (
      typeof name !== "string" ||
      typeof major !== "string" ||
      typeof year !== "number" ||
      typeof gpa !== "number" ||
      year < 1 || year > 4 ||
      gpa < 0 || gpa > 4
    ) {
      return Response.json({ error: "Invalid fields" }, { status: 400 });
    }

    const newProfile = {
      id: Date.now(),
      name,
      major,
      year,
      gpa,
    };

    profiles.push(newProfile);
    return Response.json(newProfile, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  const index = profiles.findIndex(p => p.id === id);
  if (index === -1) return Response.json({ error: "Not found" }, { status: 404 });

  profiles.splice(index, 1);
  return Response.json({ message: "Deleted" }, { status: 200 });
}
