import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import DomainSelection from '../components/DomainSelection';
import CourseRecommendations from '../components/CourseRecommendations';

gsap.registerPlugin(ScrollTrigger);

// Lightweight Step wrapper
const Step = ({ children }) => <div>{children}</div>;

// Stepper with dynamic Next/Finish, validation, and progress indicator
const Stepper = ({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = 'Back',
  nextButtonText = 'Next',
  isNextDisabled = false,
}) => {
  const childrenArray = React.Children.toArray(children);
  const total = childrenArray.length;
  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    onStepChange?.(step);
  }, [step]);

  const next = () => {
    if (step < total) {
      setStep(step + 1);
    } else {
      onFinalStepCompleted?.();
    }
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, color: 'var(--text-muted)' }}>Step {step} of {total}</div>
      <div style={{ marginBottom: 24 }}>
        {childrenArray[step - 1]}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <button type="button" onClick={prev} className="btn btn-outline" disabled={step === 1}> {backButtonText} </button>
        <button type="button" onClick={next} className="btn btnPrimary" disabled={isNextDisabled}>
          {step === total ? 'Finish' : nextButtonText}
        </button>
      </div>
    </div>
  );
};

function Login() {
  const cardRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSplash, setLoadingSplash] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showDomainSelection, setShowDomainSelection] = useState(false);
  const [showCourseRecommendations, setShowCourseRecommendations] = useState(false);
  const [selectedDomainData, setSelectedDomainData] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const animationsRef = useRef([]);

  // Animation setup (kept for consistency, though the Stepper replaces the old form)
  useEffect(() => {
    const validateElement = (element) => element && element.isConnected && document.contains(element);

    animationsRef.current.forEach(anim => anim?.kill());
    animationsRef.current = [];

    const card = cardRef.current;
    if (validateElement(card)) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const mainAnim = tl.fromTo(card, { y: 24, opacity: 0, rotateX: -6 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.7 });
      animationsRef.current.push(mainAnim);
    }

    return () => {
      animationsRef.current.forEach(anim => anim?.kill());
      animationsRef.current = [];
      ScrollTrigger.getAll().forEach(trigger => trigger?.kill());
    };
  }, []);

  // 3s loader splash for ACE LEARNING
  useEffect(() => {
    const timer = setTimeout(() => setLoadingSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Frontend-only login (no backend). Creates a local session using AuthContext
  const performLogin = async () => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        alert('Please enter email and password.');
        return;
      }

      const userData = {
        name: email.split('@')[0],
        email,
        id: `local_${Date.now()}`,
        role,
      };

      login(userData);

      const existingDomainSelection = localStorage.getItem('userDomainSelection');
      if (existingDomainSelection) {
        navigate('/dashboard');
      } else {
        setShowDomainSelection(true);
      }
    } catch (err) {
      console.error(err);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Backwards compatibility if form submit is used anywhere
  const handleLogin = async (e) => {
    e.preventDefault();
    await performLogin();
  };

  const handleDomainSelect = (domainData) => {
    localStorage.setItem('userDomainSelection', JSON.stringify(domainData));
    setSelectedDomainData(domainData);
    setShowDomainSelection(false);
    setShowCourseRecommendations(true);
  };

  const handleCourseSelect = (course) => {
    localStorage.setItem('selectedCourse', JSON.stringify(course));
    navigate('/dashboard');
  };

  const handleSkipCourseSelection = () => {
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      {loadingSplash ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 700 }}>ACE LEARNING</h1>
        </div>
      ) : (
        <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ maxWidth: 560, width: '100%' }}>
            <div ref={cardRef} className="card" style={{ padding: 24 }}>
              <div className="section-header" style={{ marginBottom: 12 }}>
                <h2>Login Setup</h2>
                <p>Follow the steps to sign in to your account.</p>
              </div>
              <Stepper
                initialStep={1}
                onStepChange={(s) => setCurrentStep(s)}
                onFinalStepCompleted={performLogin}
                backButtonText="Previous"
                nextButtonText={isLoading ? 'Please wait...' : 'Next'}
                isNextDisabled={
                  isLoading ||
                  (currentStep === 2 && !email) ||
                  (currentStep === 3 && !password) ||
                  (currentStep === 4 && !role)
                }
              >
                <Step>
                  <h3>Welcome to ACE LEARNING</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Let's get started with your login process.</p>
                </Step>

                <Step>
                  <div className="form-group">
                    <label htmlFor="email">Enter your Email</label>
                    <input
                      id="email"
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </Step>

                <Step>
                  <div className="form-group">
                    <label htmlFor="password">Enter your Password</label>
                    <input
                      id="password"
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </Step>

                <Step>
                  <div className="form-group">
                    <label htmlFor="role">Select your Role</label>
                    <select
                      id="role"
                      className="form-input"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="">Choose your role</option>
                      <option value="student">Student</option>
                      <option value="learner">Learner</option>
                      <option value="professor">Professor</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </Step>

                <Step>
                  <div className="card" style={{ background: 'var(--bg-muted)', padding: 16 }}>
                    <p><strong>Email:</strong> {email || 'Not entered'}</p>
                    <p><strong>Role:</strong> {role || 'Not selected'}</p>
                  </div>
                  <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>
                    {isLoading ? 'Signing you in...' : 'Click Finish to sign in.'}
                  </div>
                  <div className="form-links" style={{ marginTop: 8 }}>
                    <Link to="/signup" className="auth-link">Don't have an account? <span>Sign Up</span></Link>
                  </div>
                </Step>
              </Stepper>
            </div>
          </div>
        </section>
      )}

      {/* Domain Selection Popup */}
      <DomainSelection
        isOpen={showDomainSelection}
        onClose={() => setShowDomainSelection(false)}
        onDomainSelect={handleDomainSelect}
      />

      {/* Course Recommendations Popup */}
      {showCourseRecommendations && selectedDomainData && (
        <div className="course-recommendations-overlay">
          <div className="course-recommendations-modal">
            <div className="modal-header">
              <h2>Perfect! Here are your recommended courses</h2>
              <button className="skip-btn" onClick={handleSkipCourseSelection}>
                Skip for now
              </button>
            </div>
            <CourseRecommendations
              selectedDomain={selectedDomainData.domain}
              experienceLevel={selectedDomainData.experience}
              onCourseSelect={handleCourseSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;