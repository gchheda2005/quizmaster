export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is not configured with an API key. Please contact the admin.' });
  }

  const { topics, difficulty } = req.body;

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: 'Please provide at least one topic.' });
  }

  const topicStr = topics.join(', ');

  const prompt = `You are a quiz master for an Indian general knowledge and current affairs competition. Generate exactly 10 multiple-choice questions covering these topics: ${topicStr}.

Difficulty: ${difficulty || 'Mixed'}

Rules:
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Questions should be factual, accurate, and up to date
- Mix of topics across the 10 questions — don't repeat the same topic consecutively
- For current affairs: use events from 2023–2025
- For Bollywood: films, actors, directors, awards from recent decades
- For Sports: include cricket, Olympics, FIFA, tennis, and Indian sports stars
- For Records: include both Indian and world records (geography, population, buildings, etc.)
- Explanations should be brief (1–2 sentences) and educational

Respond ONLY with a valid JSON array. No markdown, no backticks, no preamble. Format:
[
  {
    "topic": "Topic Name",
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Brief educational explanation."
  }
]

"answer" is the 0-based index of the correct option. Vary which index (0,1,2,3) is correct across questions.`;

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.json().catch(() => ({}));
      return res.status(502).json({ error: errData.error?.message || 'Failed to reach AI service.' });
    }

    const data = await anthropicRes.json();
    const raw = data.content.map(b => b.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(clean);

    return res.status(200).json({ questions });
  } catch (err) {
    console.error('Quiz API error:', err);
    return res.status(500).json({ error: 'Failed to generate questions. Please try again.' });
  }
}
