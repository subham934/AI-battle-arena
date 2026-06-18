import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ArenaHeader from './components/ArenaHeader';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { fetchBattleResponse } from './services/battleService';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, title: 'Factorial function in JS', time: '2h ago' },
    { id: 2, title: 'React Hook Optimization', time: '5h ago' },
    { id: 3, title: 'Python list comprehension', time: 'Yesterday' },
  ]);
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Add user message to thread
    const userMsg = { type: 'user', text: trimmed, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // If it's the first message of the session, update/add sidebar history item
    if (messages.length === 0) {
      const newHistoryItem = {
        id: Date.now(),
        title: trimmed.slice(0, 30) + (trimmed.length > 30 ? '…' : ''),
        time: 'Just now',
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
      setActiveHistoryId(newHistoryItem.id);
    }

    try {
      const battleData = await fetchBattleResponse(trimmed);
      const botMsg = { type: 'battle', data: battleData, id: Date.now() + 1 };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = { type: 'error', text: 'Battle simulation failed. Please try again.', id: Date.now() + 1 };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewBattle = () => {
    setMessages([]);
    setActiveHistoryId(null);
    setInput('');
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <Sidebar
        history={history}
        activeHistoryId={activeHistoryId}
        onNewBattle={handleNewBattle}
        onSelectHistory={(id) => setActiveHistoryId(id)}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <ArenaHeader isLoading={isLoading} />
        <ChatArea messages={messages} isLoading={isLoading} onChipClick={(text) => setInput(text)} />
        <InputArea
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default App;