import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowRight, Mail } from 'lucide-react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    const result = await forgotPassword(email);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(result.message);

      if (result.resetLink) {
        window.location.href = result.resetLink;
      }

      setEmail('');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="forgot-page">

      {/* LEFT HERO */}
      <section className="forgot-hero">
        <div className="forgot-hero-content">

          <div className="forgot-brand">
            <div className="forgot-brand-mark">S</div>
            <span>SmartHire Hub</span>
          </div>

          <div className="forgot-badge">
            Secure account recovery
          </div>

          <h1>
            Get back to your
            <span> journey.</span>
          </h1>

          <p>
            Don't worry. We'll help you securely recover
            your SmartHire Hub account and continue your
            career journey.
          </p>

          <div className="forgot-stats">
            <div>
              <strong>Secure</strong>
              <span>Protected recovery</span>
            </div>

            <div>
              <strong>Simple</strong>
              <span>Easy account recovery</span>
            </div>

            <div>
              <strong>Fast</strong>
              <span>Get back quickly</span>
            </div>
          </div>

        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="forgot-panel">
        <div className="forgot-card">

          <div className="forgot-mobile-brand">
            <div className="forgot-brand-mark">S</div>
            <span>SmartHire Hub</span>
          </div>

          <div className="forgot-header">
            <span className="forgot-label">
              ACCOUNT RECOVERY
            </span>

            <h2>Reset your password</h2>

            <p>
              Enter your email address and we'll send you
              a secure link to reset your password.
            </p>
          </div>

          {error && (
            <div className="forgot-error">
              {error}
            </div>
          )}

          {success && (
            <div className="forgot-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="forgot-form-group">
              <label htmlFor="email">
                Email address
              </label>

              <div className="forgot-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="forgot-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Sending reset link...'
              ) : (
                <>
                  Send reset link
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="forgot-prompt">
            Remember your password?
            <Link to="/login">
              Sign in
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ForgotPassword;