import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  ArrowRight,
  Briefcase,
  Lock,
  Mail,
  Sparkles,
  User,
} from 'lucide-react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const result = await register(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="register-page">

      {/* LEFT HERO */}
      <section className="register-hero">

        <div className="register-hero-content">

          <div className="register-brand">
            <div className="register-brand-mark">S</div>
            <span>SmartHire Hub</span>
          </div>

          <div className="register-badge">
            <Sparkles size={15} />
            <span>AI-powered career intelligence</span>
          </div>

          <h1>
            Build your
            <span> skills </span>
            shape your
            <span> future.</span>
          </h1>

          <p>
            Create your profile, discover your skill gaps and
            connect with opportunities aligned with your career goals.
          </p>

          <div className="register-stats">

            <div>
              <strong>Skills</strong>
              <span>Build your profile</span>
            </div>

            <div>
              <strong>Learning</strong>
              <span>Close skill gaps</span>
            </div>

            <div>
              <strong>Industry</strong>
              <span>Find opportunities</span>
            </div>

          </div>

        </div>

      </section>

      {/* RIGHT REGISTER PANEL */}
      <section className="register-panel">

        <div className="register-card">

          {/* Mobile brand */}
          <div className="register-mobile-brand">
            <div className="register-brand-mark">S</div>
            <span>SmartHire Hub</span>
          </div>

          <div className="register-header">

            <span className="register-label">
              GET STARTED
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Start your journey towards the right career.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="register-form-group">

              <label htmlFor="name">
                Full name
              </label>

              <div className="register-input-wrapper">

                <User size={18} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="name"
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className="register-form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="register-input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="register-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">

                <Lock size={18} />

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />

              </div>

            </div>

            {/* ROLE */}
            <div className="register-form-group">

              <label htmlFor="role">
                Account type
              </label>

              <div className="register-input-wrapper">

                <Briefcase size={18} />

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="student">
                    Student
                  </option>

                  <option value="institute">
                    Institute Representative
                  </option>

                  <option value="company">
                    Industry Professional
                  </option>

                </select>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="register-success">
                {success}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="register-button"
              disabled={isSubmitting}
            >

              {isSubmitting ? (
                'Creating account...'
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </form>

          {/* LOGIN */}
          <div className="register-prompt">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Register;