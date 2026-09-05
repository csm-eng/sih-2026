import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);

    const result = await login(email, password);

    setIsSubmitting(false);

    if (result.success) {
      if (result.role === 'student') {
        navigate('/student/dashboard');
      } else if (result.role === 'institute') {
        navigate('/institute/dashboard');
      } else if (result.role === 'company') {
        navigate('/industry/dashboard');
      } else if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/unauthorized');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT HERO */}
      <section className="login-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-content">

          <div className="hero-brand">
            <div className="brand-mark">S</div>
            <span>SmartHire Hub</span>
          </div>

          <div className="hero-badge">
            <Sparkles size={15} />
            <span>AI-powered career intelligence</span>
          </div>

          <h1>
            Turn your
            <span> skills </span>
            into your
            <span> future.</span>
          </h1>

          <p>
            Connect your skills, learning journey and opportunities
            with the right career path.
          </p>

          <div className="hero-stats">
            <div>
              <strong>Skills</strong>
              <span>Build your profile</span>
            </div>

            <div>
              <strong>Opportunities</strong>
              <span>Find your path</span>
            </div>

            <div>
              <strong>Industry</strong>
              <span>Connect directly</span>
            </div>
          </div>

          <div className="hero-decoration">
            <div className="floating-card card-one">
              <span className="dot" />
              Skill Match
              <strong>92%</strong>
            </div>

            <div className="floating-card card-two">
              <span className="dot" />
              Career Growth
              <strong>↑ 24%</strong>
            </div>

            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
          </div>

        </div>
      </section>

      {/* RIGHT LOGIN */}
      <section className="login-panel">
        <div className="login-card">

          <div className="mobile-brand">
            <div className="brand-mark">S</div>
            <span>SmartHire Hub</span>
          </div>

          <div className="login-header">
            <span className="login-label">WELCOME BACK</span>

            <h2>Sign in to your account</h2>

            <p>
              Continue your journey towards the right career.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Signing in...'
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="register-prompt">
            Don't have an account?
            <Link to="/register">Create account</Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Login;