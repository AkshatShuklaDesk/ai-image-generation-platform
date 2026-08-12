import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Search, Image as ImageIcon } from 'lucide-react';
import './History.css';

const History = () => {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: '/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchHistory();
  }, [page, keyword]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/generate/history?pageNumber=${page}&keyword=${keyword}`);
      setGenerations(res.data.generations);
      setPages(res.data.pages);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1);
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
    <div className="history-container">
      <div className="history-header glass">
        <h2>Your Creations</h2>
        <form className="search-form" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search prompts..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
      </div>

      <div className="history-content">
        {loading ? (
          <div className="loading-grid">Loading your masterpieces...</div>
        ) : generations.length === 0 ? (
          <div className="empty-state">
            <ImageIcon size={48} className="empty-icon" />
            <h3>No images found</h3>
            <p>Start generating images or try a different search term.</p>
          </div>
        ) : (
          <>
            <div className="gallery-grid">
              {generations.map((gen) => (
                <div key={gen._id} className="gallery-item glass">
                  <div className="gallery-image-wrapper">
                    <img src={gen.imageUrl} alt={gen.prompt} loading="lazy" />
                    <div className="gallery-overlay">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleDownload(gen.imageUrl, gen.prompt)}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="gallery-info">
                    <p className="prompt-text" title={gen.prompt}>{gen.prompt}</p>
                    <span className="date-text">{new Date(gen.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {pages > 1 && (
              <div className="pagination glass">
                <button 
                  className="btn btn-secondary" 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>
                <span className="page-info">Page {page} of {pages}</span>
                <button 
                  className="btn btn-secondary" 
                  disabled={page === pages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
