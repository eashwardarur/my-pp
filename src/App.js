import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import About from './pages/About';
import Features from './pages/Features';
import InterviewPractice from './pages/InterviewPractice';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import DomainSelectionPage from './pages/DomainSelectionPage';
import CourseRecommendations from './components/CourseRecommendations';

function CoursesCatalog() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const courses = [
    { id: 'react-101', title: 'React 101', category: 'Web Development', level: 'Beginner', rating: 4.7, lessons: 12, duration: '8h', instructor: 'Jane Doe', totalLessons: 12, description: 'Start building with React from scratch.', whatYouWillLearn: ['JSX & Components', 'State & Props', 'Routing', 'Hooks'], requirements: ['Basic JS'], },
    { id: 'ai-basics', title: 'AI & ML Basics', category: 'AI & Data', level: 'Beginner', rating: 4.6, lessons: 15, duration: '10h', instructor: 'Dr. Smith', totalLessons: 15, description: 'Foundations of AI, ML and practical use-cases.', whatYouWillLearn: ['ML concepts', 'Supervised vs Unsupervised', 'Model evaluation'], requirements: ['Basic Math'], },
    { id: 'ds-algo', title: 'Data Structures & Algorithms', category: 'Programming', level: 'Intermediate', rating: 4.8, lessons: 20, duration: '16h', instructor: 'Alex Lee', totalLessons: 20, description: 'Master DS&A for interviews.', whatYouWillLearn: ['Arrays/Strings', 'Trees/Graphs', 'DP'], requirements: ['Basic coding'], },
    { id: 'node-api', title: 'Node.js APIs', category: 'Backend', level: 'Intermediate', rating: 4.5, lessons: 14, duration: '9h', instructor: 'Sam Patel', totalLessons: 14, description: 'Build REST APIs with Node & Express.', whatYouWillLearn: ['Express', 'Routing', 'Middlewares'], requirements: ['JS basics'], },
    { id: 'ui-ux', title: 'UI/UX Essentials', category: 'Design', level: 'Beginner', rating: 4.4, lessons: 10, duration: '6h', instructor: 'Lara M.', totalLessons: 10, description: 'Design fundamentals for modern apps.', whatYouWillLearn: ['Layouts', 'Color & Type', 'Wireframes'], requirements: ['None'], },
  ];

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = courses.filter(c => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    const matchCat = category === 'All' || c.category === category;
    const matchLvl = level === 'All' || c.level === level;
    return matchQ && matchCat && matchLvl;
  });

  const goDetails = (c) => navigate(`/courses/${c.id}`, { state: { course: c } });

  return (
    <div className="container section">
      <div className="section-header">
        <h2>Explore Courses</h2>
        <p>Search, filter and pick a course to start learning.</p>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: 12 }}>
          <input className="input" placeholder="Search courses..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="features-grid">
        {filtered.map(c => (
          <div className="feature-card" key={c.id}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p style={{ color: 'var(--text-muted)' }}>{c.category} • {c.level} • {c.duration} • ⭐ {c.rating}</p>
            <div className="cta-buttons">
              <button className="btn btn-outline" onClick={() => goDetails(c)}>View Details</button>
              <button className="btn btn-primary" onClick={() => goDetails(c)}>Enroll</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: 24 }}>
            <p>No courses match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEnrolled, enrollInCourse } = useAuth();
  const seed = location.state?.course || { id, title: id, description: 'Course overview goes here.', instructor: 'Instructor', totalLessons: 10, duration: '8h', level: 'Beginner', rating: 4.6, category: 'General', whatYouWillLearn: ['Concept 1', 'Concept 2'], requirements: ['None'], curriculum: [
    { module: 'Introduction', lessons: 2 }, { module: 'Core Concepts', lessons: 5 }, { module: 'Project', lessons: 3 }
  ] };

  const enrolled = isEnrolled(seed.id);

  const onEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    enrollInCourse({ id: seed.id, title: seed.title, totalLessons: seed.totalLessons });
    navigate('/my-learning');
  };

  return (
    <div className="container section">
      <div className="section-header">
        <h2>{seed.title}</h2>
        <p>{seed.description}</p>
      </div>

      <div className="features-grid" style={{ marginTop: 0 }}>
        <div className="feature-card">
          <h3>Overview</h3>
          <p style={{ color: 'var(--text-muted)' }}>Instructor: {seed.instructor} • {seed.level} • {seed.duration} • ⭐ {seed.rating}
          <br/>Category: {seed.category}</p>
          <div>
            <strong>What you'll learn:</strong>
            <ul>
              {seed.whatYouWillLearn?.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
          </div>
          <div style={{ marginTop: 12 }}>
            <strong>Requirements:</strong>
            <ul>
              {seed.requirements?.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
          </div>
          <div className="cta-buttons" style={{ marginTop: 16 }}>
            {!enrolled ? (
              <button className="btn btn-primary" onClick={onEnroll}>Enroll Now</button>
            ) : (
              <button className="btn btn-primary" onClick={() => navigate(`/my-learning/${seed.id}`)}>Continue Learning</button>
            )}
            <button className="btn btn-outline" onClick={() => navigate('/courses')}>Back to Courses</button>
          </div>
        </div>

        <div className="feature-card">
          <h3>Curriculum</h3>
          <ul>
            {(seed.curriculum || [
              { module: 'Module 1', lessons: 3 },
              { module: 'Module 2', lessons: 4 },
            ]).map((m, idx) => (
              <li key={idx}>{m.module} — {m.lessons} lessons</li>
            ))}
          </ul>
        </div>

        <div className="feature-card">
          <h3>Reviews</h3>
          <p>⭐ ⭐ ⭐ ⭐ ☆ (4.6)</p>
          <p style={{ color: 'var(--text-muted)' }}>Reviews are simulated in this frontend-only demo.</p>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    
    // Prevent body scroll when mobile menu is open
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
  };

  // Cleanup body class on component unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  // Close mobile menu on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container header-inner">
          <Link to={isAuthenticated ? "/courses" : "/"} className="brand" aria-label="AI E-Learning Home">
            <span className="brand-logo" aria-hidden>AI</span>
            <span className="brand-text">E‑Learning & Proctor</span>
          </Link>
          
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`} aria-label="Primary">
            {mobileMenuOpen && (
              <button 
                className="mobile-menu-close"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                ✕
              </button>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
                <Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link>
                <Link to="/features" className="nav-link" onClick={closeMobileMenu}>Features</Link>
                <Link to="/interview-practice" className="nav-link" onClick={closeMobileMenu}>AI Interview</Link>
                <Link to="/courses" className="nav-link" onClick={closeMobileMenu}>Courses</Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
                <Link to="/signup" className="nav-link" onClick={closeMobileMenu}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/courses" replace /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/courses" replace /> : <Signup />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" replace />} />
          <Route path="/features" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="/interview-practice" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="/domain-selection" element={isAuthenticated ? <DomainSelectionPage /> : <Navigate to="/login" replace />} />
          <Route path="/course-recommendations" element={isAuthenticated ? <CourseRecommendations /> : <Navigate to="/login" replace />} />
          <Route path="/course-detail/:courseId" element={isAuthenticated ? <CourseDetailsPage /> : <Navigate to="/login" replace />} />
          
          {/* Direct routes for main sections */}
          <Route path="/courses" element={isAuthenticated ? <CoursesCatalog /> : <Navigate to="/login" replace />} />
          <Route path="/assessment" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="/career-guidance" element={isAuthenticated ? <Features /> : <Navigate to="/login" replace />} />
          <Route path="/all-courses" element={isAuthenticated ? <CourseRecommendations /> : <Navigate to="/login" replace />} />
          <Route path="/practice" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="/interview" element={isAuthenticated ? <InterviewPractice /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
