import { getDB } from "../db";
import { DEFAULT_SETTINGS, type MeetingSettings, SETTINGS_KEY } from "./types";

export async function getSettings(): Promise<MeetingSettings> {
	const db = await getDB();
	const settings = await db.get("settings", SETTINGS_KEY);
	return settings ?? DEFAULT_SETTINGS;
}

export async function saveSettings(
	input: Partial<Omit<MeetingSettings, "key">>,
): Promise<MeetingSettings> {
	const db = await getDB();
	const current = await getSettings();
	const updated: MeetingSettings = { ...current, ...input };
	await db.put("settings", updated);
	return updated;
}
