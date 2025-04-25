const systemPrompt =
  "You are a helpful, friendly, and efficient restaurant reservation chatbot. " +
  "Always help users book a table with minimal questions, suggest alternatives if fully booked, " +
  "and act human-like.";

const chatHistory = [];
const messagesEl = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage('user', text);
  chatHistory.push({ role: 'user', content: text });
  userInput.value = '';

  try {
    const res = await fetch('/api/gemini-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text, system: systemPrompt, history: chatHistory })
    });

    const { reply } = await res.json();
    addMessage('bot', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    console.error(err);
    addMessage('bot', 'Sorry, I’m having trouble connecting to the server.');
  }
}