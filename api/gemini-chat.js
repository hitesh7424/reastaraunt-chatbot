export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { prompt, system, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
    // Build the conversation as a single part for now
    const fullPrompt = `${system}\n\n` + history.map(h => `${h.role}: ${h.content}`).join('\n') + `\nuser: ${prompt}`;
  
    const payload = {
      contents: [
        {
          parts: [{ text: fullPrompt }]
        }
      ]
    };
  
    try {
      const apiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await apiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response.";
      return res.status(200).json({ reply });
    } catch (err) {
      console.error('Gemini API error:', err);
      return res.status(500).json({ reply: 'Internal server error.' });
    }
  }
  