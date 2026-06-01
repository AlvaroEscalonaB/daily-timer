import { getDB } from "../db";
import type {
	CreateParticipantInput,
	Participant,
	UpdateParticipantInput,
} from "./types";

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getAllParticipants(): Promise<Participant[]> {
	const db = await getDB();
	const all = await db.getAllFromIndex("participants", "by-order");
	return all;
}

export async function createParticipant(
	input: CreateParticipantInput,
): Promise<Participant> {
	const db = await getDB();
	const all = await getAllParticipants();

	const participant: Participant = {
		id: generateId(),
		name: input.name,
		avatarColor: input.avatarColor,
		order: all.length,
		disabledForToday: false,
		createdAt: Date.now(),
	};

	await db.add("participants", participant);
	return participant;
}

export async function updateParticipant(
	id: string,
	input: UpdateParticipantInput,
): Promise<Participant> {
	const db = await getDB();
	const existing = await db.get("participants", id);
	if (!existing) throw new Error(`Participant ${id} not found`);

	const updated: Participant = { ...existing, ...input };
	await db.put("participants", updated);
	return updated;
}

export async function deleteParticipant(id: string): Promise<void> {
	const db = await getDB();
	await db.delete("participants", id);
}

export async function reorderParticipants(ids: string[]): Promise<void> {
	const db = await getDB();
	const tx = db.transaction("participants", "readwrite");

	await Promise.all(
		ids.map(async (id, index) => {
			const participant = await tx.store.get(id);
			if (participant) {
				await tx.store.put({ ...participant, order: index });
			}
		}),
	);

	await tx.done;
}

export async function shuffleParticipants(): Promise<Participant[]> {
	const all = await getAllParticipants();
	const shuffled = [...all];

	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	await reorderParticipants(shuffled.map((p) => p.id));
	return shuffled.map((p, index) => ({ ...p, order: index }));
}

export async function resetDailyDisabled(): Promise<void> {
	const db = await getDB();
	const all = await getAllParticipants();
	const tx = db.transaction("participants", "readwrite");

	await Promise.all(
		all
			.filter((p) => p.disabledForToday)
			.map((p) => tx.store.put({ ...p, disabledForToday: false })),
	);

	await tx.done;
}
