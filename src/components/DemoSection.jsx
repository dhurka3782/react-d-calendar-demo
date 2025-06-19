import React from 'react';

const DemoSection = ({ title, description, children, className = '' }) => {
  return (
    <section className={`demo-section ${className}`}>
      <div className="demo-header">
        <h2 className="demo-title">{title}</h2>
        <p className="demo-description">{description}</p>
      </div>
      <div className="demo-content">
        {children}
      </div>
    </section>
  );
};

export default DemoSection;