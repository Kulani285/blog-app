import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import './PostCard.css';

export default function PostCard({ post, onDelete, showActions = false }) {
const { user } = useAuth();
  const canEdit = user && (user.role === 'ADMIN' || user.username === post.author?.username);
  const dateStr = post.createdAt
    ? format(new Date(post.createdAt), 'MMM d, yyyy')
    : '';

  return (
    <article className="post-card">
      {post.coverImage && (
        <Link to={`/post/${post.slug || post.id}`} className="post-card-image-link">
          <div className="post-card-image">
            <img src={post.coverImage} alt={post.title} loading="lazy" />
          </div>
        </Link>
      )}
      <div className="post-card-body">
        {post.tags?.length > 0 && (
          <div className="post-card-tags">
            {post.tags.slice(0, 3).map(tag => (
              <Link to={`/tag/${tag}`} key={tag} className="tag">{tag}</Link>
            ))}
          </div>
        )}
        <Link to={`/post/${post.slug || post.id}`} className="post-card-title-link">
          <h2 className="post-card-title">{post.title}</h2>
        </Link>
        {post.excerpt && (
          <p className="post-card-excerpt">{post.excerpt}</p>
        )}
        <div className="post-card-meta">
          <div className="post-card-author">
            <div className="author-avatar">
              {post.author?.displayName?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <span className="author-name">{post.author?.displayName || 'Anonymous'}</span>
              <span className="post-date">{dateStr}</span>
            </div>
          </div>
          <div className="post-card-right">
            <span className="view-count" title="Views">
              ◎ {post.viewCount || 0}
            </span>
            {showActions && (canEdit) && (
  <div className="post-card-actions">
    <span className={`badge badge-${post.status?.toLowerCase()}`}>{post.status}</span>
    <Link to={`/editor/${post.id}`} className="btn btn-outline btn-sm">Edit</Link>
    {onDelete && (
      <button onClick={() => onDelete(post.id)} className="btn btn-danger btn-sm">Delete</button>
    )}
  </div>
)}
          </div>
        </div>
      </div>
    </article>
  );
}
