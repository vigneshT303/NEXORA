import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '480px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: 'var(--shadow-purple)'
        }}>
          <AlertTriangle size={36} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '12px 0 8px', color: 'var(--text-main)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
          The page or resource you are looking for doesn't exist, has been removed, or you don't have authorization to view it.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Login
          </Link>
          <Link to="/admin/dashboard" className="btn btn-primary">
            <Home size={16} /> Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
