import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getTags } from '../api';
import PostCard from '../components/PostCard';
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([getPosts(page), getTags()])
      .then(([postsRes, tagsRes]) => {
        setPosts(postsRes.data.content);
        setTotalPages(postsRes.data.totalPages);
        setTags(tagsRes.data.slice(0, 12));
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="home">
      {/* Hero */}
      <header className="home-hero">
        <div className="container">
          <div className="hero-eyebrow">A place for ideas</div>
          <h1 className="hero-title">
            Inkwell<br />
            <em>Journal</em>
          </h1>
          <p className="hero-sub">
            Stories, insights, and longform writing from our contributors.
          </p>
        </div>
        <div className="hero-rule">
          <span>✦</span>
        </div>
      </header>

      <div className="home-body container">
        <main className="home-main">
          {loading ? (
            <div className="spinner" />
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h3>No posts yet</h3>
              <p>Be the first to publish something.</p>
            </div>
          ) : (
            <>
              <div className="posts-grid">
                {posts.map((post, i) => (
                  <div key={post.id} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <PostCard post={post} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    ← Previous
                  </button>
                  <span className="page-info">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <aside className="home-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Topics</h3>
            <div className="sidebar-tags">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  className="tag"
                  onClick={() => navigate(`/tag/${tag.name}`)}
                >
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && <p className="text-muted" style={{fontSize: '0.875rem'}}>No topics yet.</p>}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-heading">About</h3>
            <p className="sidebar-about">
              Inkwell is a space for thoughtful writing. We publish essays, tutorials,
              and perspectives from contributors around the world.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
