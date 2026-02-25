import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostsByTag } from '../api';
import PostCard from '../components/PostCard';

export default function TagPage() {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPostsByTag(tag)
      .then(res => setPosts(res.data.content))
      .finally(() => setLoading(false));
  }, [tag]);

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <span className="tag tag-rust" style={{ marginBottom: '1rem', display: 'inline-block' }}>{tag}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
            Posts tagged "{tag}"
          </h1>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <p className="text-muted">No published posts with this tag.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
