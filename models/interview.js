export function createInterviewRecord({ userId, config, transcript, feedback, durationSeconds }) {
  return {
    userId,
    category: config.category,
    difficulty: config.difficulty,
    duration: config.duration,
    language: config.language,
    voiceStyle: config.voiceStyle,
    transcript,
    feedback,
    scores: feedback.scores,
    durationSeconds,
    createdAt: new Date()
  };
}
