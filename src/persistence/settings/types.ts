export interface MeetingSettings {
	key: string;
	timerDurationSeconds: number;
}

export const SETTINGS_KEY = "meeting-settings";

export const DEFAULT_SETTINGS: MeetingSettings = {
	key: SETTINGS_KEY,
	timerDurationSeconds: 120,
};
