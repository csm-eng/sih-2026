import React, { useContext, useEffect, useState } from 'react';
import { Building2, Mail, Globe, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import industryService from '../../services/industryService';
import './IndustryProfilePage.css';

const IndustryProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.companyId) {
      fetchCompany();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const res = await industryService.getCompanyById(user.companyId);
      setCompany(res?.data || null);
    } catch (err) {
      console.error('Failed to load company details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="industry-profile-page">
      <div className="page-header">
        <div>
          <h2>Industry Partner Profile</h2>
          <p>Manage your company profile and institutional partnership settings.</p>
        </div>
      </div>

      <div className="content-card profile-card">
        <div className="company-profile-header">
          <div className="company-logo-large">
            <Building2 size={36} />
          </div>
          <div>
            <h3>{company?.name || user?.name || 'Industry Partner Company'}</h3>
            <p className="profile-tagline">{company?.industry || 'Technology & Innovation Partner'}</p>
          </div>
        </div>

        <div className="profile-details-grid">
          <div className="detail-item">
            <Mail size={18} className="detail-icon" />
            <div>
              <label>Official Email</label>
              <span>{company?.email || user?.email || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-item">
            <Globe size={18} className="detail-icon" />
            <div>
              <label>Website</label>
              <span>{company?.website || 'https://smarthire.hub'}</span>
            </div>
          </div>

          <div className="detail-item">
            <MapPin size={18} className="detail-icon" />
            <div>
              <label>Headquarters</label>
              <span>{company?.location || 'India'}</span>
            </div>
          </div>

          <div className="detail-item">
            <ShieldCheck size={18} className="detail-icon" />
            <div>
              <label>Verification Status</label>
              <span className="status-verified-text">
                <CheckCircle2 size={14} /> Verified Industry Partner
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryProfilePage;
