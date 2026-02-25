import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, deletePost } from '../api';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/PostCard';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('ALL');

  const fetchPosts = (p = 0) => {
    setLoading(true);
    getAllPosts(p, 10)
      .then(res => {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(page); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    await deletePost(id);
    fetchPosts(page);
  };

  const filtered = filter === 'ALL' ? posts : posts.filter(p => p.status === filter);
  const counts = {
    ALL: posts.length,
    PUBLISHED: posts.filter(p => p.status === 'PUBLISHED').length,
    DRAFT: posts.filter(p => p.status === 'DRAFT').length,
    ARCHIVED: posts.filter(p => p.status === 'ARCHIVED').length,
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="text-muted">Welcome back, <strong>{user?.displayName}</strong></p>
          </div>
          <Link to="/editor" className="btn btn-primary">+ New Post</Link>
        </div>

        <div className="dashboard-stats">
          {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map(s => (
            <button
              key={s}
              className={`stat-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              <span className="stat-count">{counts[s]}</span>
              <span className="stat-label">{s === 'ALL' ? 'Total Posts' : s}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="dashboard-empty">
            <p>No posts found.</p>
            <Link to="/editor" className="btn btn-primary mt-2">Create your first post</Link>
          </div>
        ) : (
          <div className="dashboard-posts">
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                showActions={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination" style={{ marginTop: '2rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</button>
            <span className="page-info">Page {page + 1} of {totalPages}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
