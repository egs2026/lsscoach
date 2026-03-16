const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callOpenRouter(messages, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');

  const body = {
    model: options.model || 'anthropic/claude-3.5-sonnet',
    messages,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.max_tokens || 2000,
  };

  if (options.response_format) {
    body.response_format = options.response_format;
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://lsscoach.ebanigeniussolutions.com',
      'X-Title': 'LSS Master Coach',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
