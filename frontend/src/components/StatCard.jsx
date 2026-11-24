import React from 'react';

const StatCard = ({ label, value, subtext, icon: Icon, color = 'purple' }) => {
  const colorClass = `stat-icon-${color}`;

  return (
    <div className="stat-card">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
      {Icon && (
        <div className={`stat-icon-wrapper ${colorClass}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
