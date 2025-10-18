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
    <div className="landing" style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ width: '100%' }}>
        <section className="hero" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <div className="hero-content" style={{ textAlign: 'center' }}>
            <h1 className="heroTitle" style={{ color: '#fff' }}>Learn faster with a beautiful, simple e‑learning experience</h1>
            <p className="heroSubtitle" style={{ color: '#cbd5e1' }}>
              Explore curated courses, track your progress, and practice with confidence.
            </p>
            <div className="ctaRow" style={{ justifyContent: 'center' }}>
              <Link to="/signup" className="btn btnPrimary">Get Started</Link>
              <Link to="/login" className="btn btnGhost" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#e2e8f0' }}>I already have an account</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Landing;
