import { NextResponse } from "next/server";

export async function GET() {
  const ciudadesId = [
    2070, 2058, 1760, 1757, 1652, 2007, 1643, 1641, 2063, 1981, 2013, 1856,
    1688, 1725, 1904, 1986, 1646, 1642,
  ];

  //   const ciudadMap: Record<number, string> = {
  //     2070: "Viña del Mar",
  //     2058: "Valparaíso",
  //     1760: "El Tabo",
  //     1757: "El Quisco",
  //     1652: "Algarrobo",
  //     2007: "San Antonio",
  //     1643: "Quillota",
  //     1641: "Limache",
  //     2063: "Villa Alemana",
  //     1981: "Quilpué",
  //     2013: "San Felipe",
  //     1856: "Los Andes",
  //     1688: "Cartagena",
  //     1725: "Concón",
  //     1904: "Olmué",
  //     1986: "Rancagua",
  //     1646: "Santiago",
  //     1642: "Llay Llay",
  //   };

  const originId = 1646;
  const apiKey = process.env.KUPOS_API_KEY;
  const today = new Date();
  const date = today.toISOString().split("T")[0];

  try {
    const results = [];

    for (const destId of ciudadesId) {
      if (destId === originId) continue;

      const url = `https://gds.kupos.com/gds/api/ui_schedules/${originId}/${destId}/${date}.json?api_key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data.result)) {
        const headers = data.result[0];
        const rows = data.result.slice(1);

        const services = rows.map((r: any[]) =>
          Object.fromEntries(headers.map((h: string, i: number) => [h, r[i]]))
        );

        const pullman = services.filter(
          (item: any) => item.travel_name === "Pullman Costa"
        );

        results.push(...pullman);
      }
    }

    results.sort((a, b) => {
      const horaA = a.dep_time.split(":").map(Number);
      const horaB = b.dep_time.split(":").map(Number);
      const minutosA = horaA[0] * 60 + horaA[1];
      const minutosB = horaB[0] * 60 + horaB[1];
      return minutosA - minutosB;
    });

    return NextResponse.json({ schedules: results });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json(
      { error: "Error fetching schedules" },
      { status: 500 }
    );
  }
}
