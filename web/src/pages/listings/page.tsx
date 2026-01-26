import { EmissionsTable } from "./data-table";

export default function App() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">OWID CO₂ Dashboard</h1>
        <p className="text-muted-foreground">
          Latest emissions snapshot by country (2024)
        </p>
      </div>

      <EmissionsTable />
    </main>
  );
}
