import { NextResponse } from "next/server";

export async function GET() {
  const ciudadesId = [
    2070, 2058, 1760, 1757, 1652, 2007, 1643, 1641, 2063, 1981, 2013, 1856,
    1688, 1725, 1904, 1986, 1646, 1642,
  ];

  const originId = 1646;
  const apiKey = process.env.KUPOS_API_KEY;
  const today = new Date();
  const date = today.toISOString().split("T")[0];

  try {
    if (!apiKey) {
      throw new Error("Error de autenticación");
    }

    const results = [];

    for (const destId of ciudadesId) {
      if (destId === originId) continue;

      const url = `https://gds.kupos.com/gds/api/ui_schedules/${originId}/${destId}/${date}.json?api_key=${apiKey}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          `Error HTTP ${res.status}: ${res.statusText} al consultar ${url}`
        );
      }

      const data = await res.json();

      if (!data || data.error || !data.result) {
        throw new Error(
          `Error en la respuesta de Kupos: ${
            data?.error || "Respuesta inválida"
          }`
        );
      }

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
      const [hA, mA] = a.dep_time.split(":").map(Number);
      const [hB, mB] = b.dep_time.split(":").map(Number);
      return hA * 60 + mA - (hB * 60 + mB);
    });

    return NextResponse.json({ schedules: results });
  } catch (error: any) {
    console.error("Error fetching schedules:", error.message);
    return NextResponse.json(
      { error: error.message || "Error desconocido al obtener horarios" },
      { status: 500 }
    );
  }
}
