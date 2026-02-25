import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchPosts } from '../api';
import PostCard from '../components/PostCard';

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchPosts(q)
      .then(res => setPosts(res.data.content))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Search results
        </h1>
        <p className="text-muted" style={{ marginBottom: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          "{q}"
        </p>
        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div style={{ color: 'var(--muted)', padding: '3rem 0' }}>No results found for "{q}".</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
