import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Image as ImageIcon, Loader2, MessageSquare, Plus, Trash2, Edit2, Check, X, Download } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [generations, setGenerations] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      fetchGenerations(currentSession._id);
    } else {
      setGenerations([]);
    }
  }, [currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [generations, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions');
      setSessions(res.data);
      if (res.data.length > 0 && !currentSession) {
        setCurrentSession(res.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const fetchGenerations = async (sessionId) => {
    try {
      const res = await api.get(`/generate/session/${sessionId}`);
      setGenerations(res.data);
    } catch (error) {
      console.error('Failed to fetch generations:', error);
    }
  };

  const handleCreateSession = async () => {
    try {
      const res = await api.post('/sessions', { title: 'New Chat' });
      setSessions([res.data, ...sessions]);
      setCurrentSession(res.data);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const handleRenameSession = async (id) => {
    try {
      const res = await api.put(`/sessions/${id}`, { title: editTitle });
      setSessions(sessions.map(s => s._id === id ? res.data : s));
      if (currentSession?._id === id) setCurrentSession(res.data);
      setEditingSession(null);
    } catch (error) {
      console.error('Failed to rename session:', error);
    }
  };

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;
    try {
      await api.delete(`/sessions/${id}`);
      const newSessions = sessions.filter(s => s._id !== id);
      setSessions(newSessions);
      if (currentSession?._id === id) {
        setCurrentSession(newSessions.length > 0 ? newSessions[0] : null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    let sessionId = currentSession?._id;
    if (!sessionId) {
      try {
        const res = await api.post('/sessions', { title: prompt.substring(0, 30) });
        setSessions([res.data, ...sessions]);
        setCurrentSession(res.data);
        sessionId = res.data._id;
      } catch (err) {
        return console.error(err);
      }
    }

    const currentPrompt = prompt;
    setPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/generate', { prompt: currentPrompt, sessionId });
      setGenerations([...generations, res.data]);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, prompt) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-${prompt.substring(0, 15).replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="dashboard-container">
      <div className="sessions-panel glass">
        <div className="panel-header">
          <h3>Chats</h3>
          <button className="icon-btn" onClick={handleCreateSession} title="New Chat">
            <Plus size={18} />
          </button>
        </div>
        <div className="session-list">
          {sessions.map(session => (
            <div 
              key={session._id} 
              className={`session-item ${currentSession?._id === session._id ? 'active' : ''}`}
              onClick={() => setCurrentSession(session)}
            >
              <MessageSquare size={16} className="session-icon" />
              
              {editingSession === session._id ? (
                <div className="session-edit" onClick={e => e.stopPropagation()}>
                  <input 
                    autoFocus
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRenameSession(session._id)}
                  />
                  <button onClick={() => handleRenameSession(session._id)}><Check size={14}/></button>
                  <button onClick={() => setEditingSession(null)}><X size={14}/></button>
                </div>
              ) : (
                <>
                  <span className="session-title">{session.title}</span>
                  <div className="session-actions">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setEditingSession(session._id);
                      setEditTitle(session.title);
                    }}><Edit2 size={14} /></button>
                    <button onClick={(e) => handleDeleteSession(session._id, e)}><Trash2 size={14} /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        <div className="chat-header glass">
          <h2>{currentSession ? currentSession.title : 'New Chat'}</h2>
        </div>

        <div className="chat-history">
          {generations.length === 0 && !loading && (
            <div className="empty-state">
              <ImageIcon size={48} className="empty-icon" />
              <h3>Start Creating</h3>
              <p>Type a detailed prompt below to generate an image.</p>
            </div>
          )}
          
          {generations.map((gen, idx) => (
            <div key={idx} className="message-pair">
              <div className="message user-message">
                <p>{gen.prompt}</p>
              </div>
              <div className="message ai-message glass">
                <div className="image-container">
                  <img src={gen.imageUrl} alt={gen.prompt} loading="lazy" />
                  <div className="image-overlay">
                    <button 
                      className="btn btn-secondary download-btn"
                      onClick={() => handleDownload(gen.imageUrl, gen.prompt)}
                    >
                      <Download size={16} /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-pair">
              <div className="message user-message">
                <p>{prompt}</p>
              </div>
              <div className="message ai-message loading-message glass">
                <Loader2 className="spinner" size={24} />
                <span>Generating your vision...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <form className="input-form glass" onSubmit={handleGenerate}>
            <input 
              type="text" 
              placeholder="Describe what you want to see..." 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary send-btn" disabled={loading || !prompt.trim()}>
              {loading ? <Loader2 className="spinner" size={18} /> : <Send size={18} />}
            </button>
          </form>
          <div className="disclaimer">AI can make mistakes. Verify important information.</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
