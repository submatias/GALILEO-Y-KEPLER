// api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Missing prompt' });
  }

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error("Falta GEMINI_API_KEY en variables de entorno");
      return res.status(500).json({ message: 'Server misconfigured: missing API key' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      return res.status(500).json({ message: 'Gemini API request failed', error: errorData });
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.output_text ||
      "No se pudo obtener respuesta de Gemini.";

    return res.status(200).json({ answer: text });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
