import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface SessionForPrompt {
  sessionDate: string;
  training: string;
  alignmentStatus: string;
  deviationReason: string | null;
}

export interface UpcomingSession {
  sessionDate: string;
  training: string;
}

export interface Suggestion {
  sessionDate: string;
  originalTraining: string;
  suggestedTraining: string;
  reason: string;
}

export async function generateSuggestions(
  deviatedSessions: SessionForPrompt[],
  upcomingSessions: UpcomingSession[],
): Promise<Suggestion[]> {
  if (deviatedSessions.length === 0 || upcomingSessions.length === 0) return [];

  const deviationText = deviatedSessions
    .map(
      (s) =>
        `- ${s.sessionDate}: "${s.training}" → status: ${s.alignmentStatus}${s.deviationReason ? ` (${s.deviationReason})` : ""}`,
    )
    .join("\n");

  const upcomingText = upcomingSessions
    .map((s) => `- ${s.sessionDate}: "${s.training}"`)
    .join("\n");

  const prompt = `You are a running coach assistant. A runner has deviations from their training plan.

Deviations:
${deviationText}

Upcoming planned sessions:
${upcomingText}

Suggest specific adjustments to the upcoming sessions to account for the deviations. For each adjustment, return a JSON array with objects containing: sessionDate, originalTraining, suggestedTraining, reason.

Only suggest changes where it makes sense. Return only the JSON array, no other text.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as Suggestion[];
  } catch {
    return [];
  }
}
