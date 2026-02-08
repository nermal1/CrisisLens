import { getAllScenarios } from "@/lib/scenarios";
import ScenarioGrid from "@/components/ui/ScenarioGrid";

export default function ScenarioPage() {

  const scenarios = getAllScenarios();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scenario Library</h1>
        <p className="text-slate-500 mt-2 max-w-3xl">
          Click on any card to view the full history, causes, and market winners/losers.
        </p>
      </div>

      <ScenarioGrid initialScenarios={scenarios} />
    </div>
  );
}