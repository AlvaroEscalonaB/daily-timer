import { createFileRoute } from "@tanstack/react-router";
import { DailyTimerScreen } from "#/screens/DailyTimerScreen";

export const Route = createFileRoute("/")({ component: DailyTimerScreen });
