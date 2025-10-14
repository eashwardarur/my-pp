import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/Home.css';

function Landing() {
  const navigate = useNavigate();

  // Seed data (frontend-only)
  const allCourses = useMemo(() => ([
    { id: 'react-101', title: 'React 101', category: 'Web Development', level: 'Beginner', rating: 4.7, duration: '8h', description: 'Start building with React from scratch.' },
    { id: 'ai-basics', title: 'AI & ML Basics', category: 'AI & Data', level: 'Beginner', rating: 4.6, duration: '10h', description: 'Foundations of AI and ML with practical use‑cases.' },
    { id: 'ds-algo', title: 'Data Structures & Algorithms', category: 'Programming', level: 'Intermediate', rating: 4.8, duration: '16h', description: 'Master DS&A for interviews.' },
    { id: 'node-api', title: 'Node.js APIs', category: 'Backend', level: 'Intermediate', rating: 4.5, duration: '9h', description: 'Build REST APIs with Node & Express.' },
    { id: 'ui-ux', title: 'UI/UX Essentials', category: 'Design', level: 'Beginner', rating: 4.4, duration: '6h', description: 'Design fundamentals for modern apps.' },
    { id: 'interview', title: 'Interview Prep', category: 'Interview Prep', level: 'All', rating: 4.6, duration: '6h', description: 'Nail your next interview with mock sessions.' },
  ]), []);

  const categories = ['All', 'Web Development', 'AI & Data', 'Programming', 'Backend', 'Design', 'Interview Prep'];
  const [activeCat, setActiveCat] = useState('All');

  const featured = allCourses.filter(c => activeCat === 'All' || c.category === activeCat).slice(0, 6);
  const goDetails = (c) => navigate(`/courses/${c.id}`, { state: { course: c } });

  const testimonials = [
    { quote: 'This platform made learning addictive. The flow is so smooth!', name: 'Priya S.', role: 'Frontend Dev' },
    { quote: 'The structure and design helped me stay consistent every day.', name: 'Rahul M.', role: 'Student' },
    { quote: 'Loved the interview practice and quick feedback.', name: 'Aisha K.', role: 'Data Analyst' },
  ];

  const faqs = [
    { q: 'Is this fully frontend only?', a: 'Yes. All navigation and state are handled by React Router and React state/localStorage.' },
    { q: 'Do I need an account to browse courses?', a: 'You can explore the catalog, but enrolling requires a quick sign up (frontend-only).' },
    { q: 'Will my progress persist?', a: 'Your progress is stored in localStorage so you can pick up where you left off on this device.' },
  ];
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1 className="heroTitle">Learn faster with a beautiful, simple e‑learning experience</h1>
            <p className="heroSubtitle">
              Explore curated courses, track your progress, and practice with confidence.
              100% frontend demo — instant, smooth navigation with React Router.
            </p>
            <div className="ctaRow">
              <Link to="/signup" className="btn btnPrimary">Get Started</Link>
              <Link to="/login" className="btn btnGhost">I already have an account</Link>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
              <div className="statCard">
                <div className="statIcon" aria-hidden />
                <div>
                  <strong>Personalized Journeys</strong>
                  <div className="muted">Your learning, your pace</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="heroMock">
              <div className="heroMockContent">
                <div className="heroMockTitle">Clean, Modern UI</div>
                <div className="heroMockSubtitle">Designed for focus and momentum</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="section" style={{ paddingTop: 40, paddingBottom: 20 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Trusted by learners from</div>
          <div className="logos-row">
            {['TechNova', 'Cloudify', 'DataForge', 'UXFlow', 'AlgoWorks'].map((brand) => (
              <div key={brand} className="logo-item">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="chips" role="tablist" aria-label="Course categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`chip ${activeCat === cat ? 'active' : ''}`}
                onClick={() => setActiveCat(cat)}
                role="tab"
                aria-selected={activeCat === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section">
        <div className="container">
          <h2 className="section-title centered">Featured Courses</h2>
          <div className="grid-3">
            {featured.map(c => (
              <div className="card" key={c.id}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <p style={{ color: 'var(--text-muted)' }}>{c.category} • {c.level} • {c.duration} • ⭐ {c.rating}</p>
                <div className="ctaRow" style={{ marginTop: 12 }}>
                  <button className="btn btnPrimary" onClick={() => goDetails(c)}>View Details</button>
                  <Link to="/courses" className="btn btnGhost">Explore All</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title centered">By the numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div>
                <h3>12k+</h3>
                <p>Learners</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div>
                <h3>550+</h3>
                <p>Courses</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div>
                <h3>4.7</h3>
                <p>Avg. Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="section-title centered">Loved by learners</h2>
          <div className="grid-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="card">
                <p style={{ fontStyle: 'italic' }}>“{t.quote}”</p>
                <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>{t.name} • {t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title centered">FAQ</h2>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {faqs.map((f, i) => (
              <div key={i} className="card" style={{ marginBottom: 12 }}>
                <button
                  className="faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {f.q}
                  <span style={{ marginLeft: 'auto', opacity: 0.7 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="faq-a">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to start your journey?</h2>
          <p>Join thousands of learners improving their skills every day.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Create free account</Link>
            <Link to="/courses" className="btn btn-outline">Browse courses</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
