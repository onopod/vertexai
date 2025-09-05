"use client";

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '' }]);
    const currentIndex = messages.length + 1;
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content })
      });
      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim();
              if (data) {
                try {
                  const json = JSON.parse(data);
                  if (json.type === 'text') {
                    setMessages(prev => {
                      const copy = [...prev];
                      copy[currentIndex] = {
                        role: 'assistant',
                        content: copy[currentIndex].content + json.text
                      };
                      return copy;
                    });
                  }
                } catch (err) {
                  // ignore non-JSON lines
                }
              }
            }
          }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev];
        copy[currentIndex] = { role: 'assistant', content: `エラーが発生しました: ${err.message}` };
        return copy;
      });
    }
  }

  return (
    <main>
      <div>
        {messages.map((m, i) => (
          <p key={i}><strong>{m.role}:</strong> {m.content}</p>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: '1rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="メッセージを入力"
          style={{ width: '80%' }}
        />
        <button type="submit">送信</button>
      </form>
    </main>
  );
}
