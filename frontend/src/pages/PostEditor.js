import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, createPost, updatePost, getTags } from '../api';
import './PostEditor.css';

const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    status: 'DRAFT',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getTags().then(res => setAllTags(res.data.map(t => t.name)));
    if (isEdit) {
      getPostById(id)
        .then(res => {
          const p = res.data;
          setForm({
            title: p.title || '',
            content: p.content || '',
            excerpt: p.excerpt || '',
            coverImage: p.coverImage || '',
            status: p.status || 'DRAFT',
            tags: p.tags || [],
          });
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const addTag = (tag) => {
    if (!tag.trim() || form.tags.includes(tag.trim())) return;
    setForm(f => ({ ...f, tags: [...f.tags, tag.trim()] }));
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updatePost(id, form);
      } else {
        await createPost(form);
      }
      setSaved(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="spinner" style={{ marginTop: '5rem' }} />;

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="editor-page">
      <div className="editor-topbar">
        <div className="editor-topbar-left">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">← Back</button>
          <span className="editor-meta">
            {wordCount} words · ~{readTime} min read
          </span>
        </div>
        <div className="editor-topbar-right">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-select"
            style={{ width: 'auto' }}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || saved}
          >
            {saved ? '✓ Saved!' : loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="editor-body">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="editor-main">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Your story begins with a title…"
              className="editor-title-input"
              required
            />

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your story here…"
              className="editor-content-textarea"
              required
            />
          </div>

          <div className="editor-sidebar">
            <div className="sidebar-section">
              <h4 className="sidebar-heading">Cover Image</h4>
              <div className="form-group">
                <input
                  type="url"
                  name="coverImage"
                  value={form.coverImage}
                  onChange={handleChange}
                  placeholder="https://…"
                  className="form-input"
                />
                {form.coverImage && (
                  <img src={form.coverImage} alt="Cover preview" className="cover-preview" />
                )}
              </div>
            </div>

            <div className="sidebar-section">
              <h4 className="sidebar-heading">Excerpt</h4>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Short summary shown in listings…"
                className="form-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="sidebar-section">
              <h4 className="sidebar-heading">Tags</h4>
              <div className="tags-input-wrapper">
                {form.tags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="tag-remove">×</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tag, press Enter"
                  className="tag-text-input"
                />
              </div>
              {allTags.length > 0 && (
                <div className="tag-suggestions">
                  {allTags
                    .filter(t => !form.tags.includes(t) && t.includes(tagInput))
                    .slice(0, 6)
                    .map(t => (
                      <button type="button" key={t} className="tag" onClick={() => addTag(t)}>{t}</button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
