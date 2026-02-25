import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getPostBySlug, deletePost } from '../api';
import { useAuth } from '../hooks/useAuth';
import './PostDetail.css';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getPostBySlug(slug)
      .then(res => setPost(res.data))
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    await deletePost(post.id);
    navigate('/dashboard');
  };

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  if (error) return <div className="container-narrow" style={{ padding: '4rem 2rem', color: 'var(--muted)' }}>{error}</div>;
  if (!post) return null;

  const canEdit = user && (user.role === 'ADMIN' || user.username === post.author?.username);

  return (
    <div className="post-detail fade-up">
      {post.coverImage && (
        <div className="post-hero-image">
          <img src={post.coverImage} alt={post.title} />
        </div>
      )}

      <div className="container-narrow">
        <div className="post-header">
          {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <Link to={`/tag/${tag}`} key={tag} className="tag tag-rust">{tag}</Link>
              ))}
            </div>
          )}
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <div className="post-author">
              <div className="author-avatar-lg">
                {post.author?.displayName?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <strong>{post.author?.displayName || 'Anonymous'}</strong>
                <span className="post-meta-date">
                  {post.createdAt && format(new Date(post.createdAt), 'MMMM d, yyyy')}
                  {post.updatedAt && post.updatedAt !== post.createdAt && ' · updated'}
                </span>
              </div>
            </div>
            <div className="post-meta-right">
              <span className="view-count">◎ {post.viewCount}</span>
              {canEdit && (
                <div className="post-edit-actions">
                  <Link to={`/editor/${post.id}`} className="btn btn-outline btn-sm">Edit</Link>
                  <button onClick={handleDelete} className="btn btn-danger btn-sm">Delete</button>
                </div>
              )}
            </div>
          </div>
          <hr className="divider" />
        </div>

        <div className="post-content">
          {post.content?.split('\n').map((para, i) => (
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          ))}
        </div>

        <footer className="post-footer">
          <hr className="divider" />
          <div className="post-footer-inner">
            <span className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              ✦ End of article
            </span>
            <Link to="/" className="btn btn-outline btn-sm">← Back to Archive</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
