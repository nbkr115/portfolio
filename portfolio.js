import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PortfolioAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI assistant. Ask me about my portfolio!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant that explains the portfolio of John Doe, a web developer who specializes in AI and frontend design." },
            ...newMessages
          ]
        })
      });

      const data = await response.json();
      setMessages([...newMessages, data.choices[0].message]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Oops! Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center">John Doe Portfolio</h1>

        <Card>
          <CardContent className="p-4 space-y-2 max-h-[60vh] overflow-y-auto bg-white rounded-lg">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-${msg.role === "user" ? "right" : "left"} whitespace-pre-wrap`}
              >
                <span className={msg.role === "user" ? "text-gray-700 font-semibold" : "text-blue-600"}>
                  {msg.role === "user" ? "You: " : "AI: "}
                </span>
                {msg.content}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my projects, experience, skills..."
            className="flex-grow"
          />
          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
