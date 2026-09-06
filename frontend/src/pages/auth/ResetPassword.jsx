import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import api from '../../services/api';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          newPassword: password,
        }
      );

      setSuccess(
        response.data?.message ||
          'Password reset successful! Redirecting to login...'
      );

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Unable to reset password. The link may be invalid or expired.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-page">

      {/* LEFT HERO */}
      <section className="reset-hero">

        <div className="reset-hero-content">

          <div className="reset-brand">
            <div className="reset-brand-mark">S</div>
            <span>SmartHire Hub</span>
          </div>

          <div className="reset-badge">
            Secure account recovery
          </div>

          <h1>
            Get back to your
            <span> journey.</span>
          </h1>

          <p>
            Create a new password and continue building
            your career journey with SmartHire Hub.
          </p>

          <div className="reset-stats">

            <div>
              <strong>Secure</strong>
              <span>Temporary reset link</span>
            </div>

            <div>
              <strong>Simple</strong>
              <span>Choose your password</span>
            </div>

            <div>
              <strong>Fast</strong>
              <span>Continue your journey</span>
            </div>

          </div>

        </div>

      </section>

      {/* RIGHT PANEL */}
      <section className="reset-panel">

        <div className="reset-card">

          <div className="reset-mobile-brand">
            <div className="reset-brand-mark">S</div>
            <span>SmartHire Hub</span>
          </div>

          <div className="reset-header">

            <span className="reset-label">
              ACCOUNT RECOVERY
            </span>

            <h2>
              Create a new password
            </h2>

            <p>
              Choose a new password for your account.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="reset-form-group">

              <label htmlFor="password">
                New password
              </label>

              <div className="reset-input-wrapper">

                <Lock size={18} />

                <input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />

              </div>

            </div>

            <div className="reset-form-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="reset-input-wrapper">

                <Lock size={18} />

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />

              </div>

            </div>

            {error && (
              <div className="reset-error">
                {error}
              </div>
            )}

            {success && (
              <div className="reset-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="reset-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Updating password...'
              ) : (
                <>
                  Reset password
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="reset-prompt">
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

export default ResetPassword;