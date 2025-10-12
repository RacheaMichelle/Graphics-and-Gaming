import React, { useState, useRef, useEffect } from 'react';

const CreativeProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const processSteps = [
    {
      id: 1,
      title: "Discovery & Consultation",
      icon: "🎯",
      description: "We begin by deeply understanding your vision, objectives, and requirements. Through collaborative discussions, we identify your unique needs and establish clear project goals.",
      color: "#6366F1",
      gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
      duration: "1 Day",
      services: ["Requirement Analysis", "Goal Setting", "Project Scope", "Timeline Planning", "Budget Review"]
    },
    {
      id: 2,
      title: "Strategy & Planning",
      icon: "💡",
      description: "Our team develops comprehensive strategies and innovative concepts. We create detailed plans, wireframes, and storyboards to ensure alignment with your vision.",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
      duration: "1 Day",
      services: ["Creative Strategy", "Wireframing", "Content Planning", "Technical Architecture", "Resource Allocation"]
    },
    {
      id: 3,
      title: "Execution & Development",
      icon: "⚡",
      description: "We bring concepts to life with precision and expertise. Our team executes the planned strategies while maintaining the highest quality standards throughout development.",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
      duration: "1 Day",
      services: ["Design Implementation", "Content Creation", "Technical Development", "Quality Assurance", "Progress Tracking"]
    },
    {
      id: 4,
      title: "Review & Refinement",
      icon: "🔍",
      description: "We conduct thorough reviews and implement refinements based on your feedback. This collaborative phase ensures the final product exceeds expectations.",
      color: "#EF4444",
      gradient: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
      duration: "1 Day",
      services: ["Quality Testing", "Client Review", "Feedback Implementation", "Performance Optimization", "Final Adjustments"]
    },
    {
      id: 5,
      title: "Delivery & Launch",
      icon: "🚀",
      description: "We deliver the final product with comprehensive support and documentation. Our team ensures smooth deployment and provides necessary training and resources.",
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
      duration: "1 Day",
      services: ["Final Delivery", "Documentation", "Training & Support", "Launch Assistance", "Post-Launch Review"]
    }
  ];

  // Auto-advance through steps
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % processSteps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [processSteps.length, isHovering]);

  return (
    <section className="creative-process" id="process">
      <div className="container">
        {/* Professional Header */}
        <div className="section-header">
          <div className="header-badge">
            <span className="badge-text">OUR PROCESS</span>
          </div>
          
          <h2 className="main-title">
            Streamlined Creative
            <span className="title-accent"> Workflow</span>
          </h2>
          
          <div className="title-divider">
            <div className="divider-line"></div>
            <div className="divider-dot"></div>
            <div className="divider-line"></div>
          </div>
          
          <p className="subtitle">
            A structured approach to delivering exceptional creative solutions. 
            Our proven methodology ensures quality, efficiency, and client satisfaction at every stage.
          </p>
        </div>

        {/* Modern Process Timeline */}
        <div className="process-timeline">
          <div className="timeline-container">
            <div className="timeline-track">
              <div 
                className="timeline-progress" 
                style={{ 
                  width: `${(activeStep / (processSteps.length - 1)) * 100}%`,
                  background: processSteps[activeStep].gradient
                }}
              />
            </div>
            
            {processSteps.map((step, index) => (
              <div
                key={step.id}
                className={`timeline-node ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                onClick={() => setActiveStep(index)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="node-indicator">
                  <div 
                    className="node-core"
                    style={{ 
                      background: step.gradient,
                      borderColor: step.color
                    }}
                  >
                    <span className="node-icon">{step.icon}</span>
                    {index < activeStep && (
                      <div className="completion-check">✓</div>
                    )}
                  </div>
                  <div className="node-connector"></div>
                </div>
                
                <div className="node-content">
                  <div className="node-header">
                    <span className="node-step">Step {index + 1}</span>
                    <span className="node-duration">{step.duration}</span>
                  </div>
                  <h4 className="node-title">{step.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Display */}
        <div className="content-display">
          <div className="process-content">
            <div 
              className="step-card"
              style={{ 
                '--step-color': processSteps[activeStep].color,
                '--step-gradient': processSteps[activeStep].gradient
              }}
            >
              <div className="card-header">
                <div className="step-meta">
                  <div className="step-indicator">
                    <span className="step-number">0{activeStep + 1}</span>
                  </div>
                  <div className="step-info">
                    <span className="step-phase">PHASE {activeStep + 1}</span>
                    <h3>{processSteps[activeStep].title}</h3>
                  </div>
                </div>
                <div className="step-timing">
                  <span className="timing-label">Duration</span>
                  <span className="timing-value">{processSteps[activeStep].duration}</span>
                </div>
              </div>
              
              <p className="step-description">{processSteps[activeStep].description}</p>
              
              <div className="step-deliverables">
                <h4 className="deliverables-title">Key Deliverables</h4>
                <div className="deliverables-grid">
                  {processSteps[activeStep].services.map((service, index) => (
                    <div 
                      key={service}
                      className="deliverable-item"
                    >
                      <div className="deliverable-icon">
                        <div className="icon-circle" style={{ background: processSteps[activeStep].color }}></div>
                      </div>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="step-controls">
                <button 
                  className="control-btn prev"
                  onClick={() => setActiveStep(prev => prev > 0 ? prev - 1 : processSteps.length - 1)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Previous
                </button>
                
                <div className="step-pagination">
                  {processSteps.map((_, index) => (
                    <button
                      key={index}
                      className={`pagination-dot ${index === activeStep ? 'active' : ''}`}
                      onClick={() => setActiveStep(index)}
                      style={{ 
                        background: index === activeStep ? processSteps[activeStep].color : '#E5E7EB'
                      }}
                    />
                  ))}
                </div>
                
                <button 
                  className="control-btn next"
                  onClick={() => setActiveStep(prev => prev < processSteps.length - 1 ? prev + 1 : 0)}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Process Visualization */}
          <div className="process-visualization">
            <div className="visual-container">
              <div className="process-wheel">
                <div className="wheel-center">
                  <div 
                    className="center-core"
                    style={{ background: processSteps[activeStep].gradient }}
                  >
                    <div className="core-icon">{processSteps[activeStep].icon}</div>
                  </div>
                </div>
                
                <div className="wheel-items">
                  {processSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`wheel-item ${index === activeStep ? 'active' : ''}`}
                      style={{ 
                        '--item-angle': `${(360 / processSteps.length) * index}deg`,
                        '--item-color': step.color
                      }}
                    >
                      <div 
                        className="item-marker"
                        style={{ background: step.color }}
                      >
                        <span className="item-step">{index + 1}</span>
                      </div>
                      <div className="item-label">
                        <span>{step.title.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="wheel-glow" style={{ background: processSteps[activeStep].gradient }}></div>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      <style jsx>{`
        .creative-process {
          padding: 100px 0;
          background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
          position: relative;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 2;
        }

        /* Professional Header */
        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .header-badge {
          display: inline-block;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 8px 20px;
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .badge-text {
          color: #6366F1;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .main-title {
          font-size: 3rem;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .title-accent {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .divider-line {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #6366F1, transparent);
        }

        .divider-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366F1;
        }

        .subtitle {
          font-size: 1.125rem;
          color: #6B7280;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Modern Process Timeline */
        .process-timeline {
          margin-bottom: 80px;
        }

        .timeline-container {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
        }

        .timeline-track {
          position: absolute;
          top: 40px;
          left: 60px;
          right: 60px;
          height: 3px;
          background: #E5E7EB;
          border-radius: 2px;
          z-index: 1;
        }

        .timeline-progress {
          height: 100%;
          border-radius: 2px;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .timeline-node {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 48px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .timeline-node:hover {
          transform: translateX(8px);
        }

        .node-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .node-core {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          border: 3px solid;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .timeline-node.active .node-core {
          transform: scale(1.1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .completion-check {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #10B981;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .node-connector {
          width: 2px;
          height: 48px;
          background: #E5E7EB;
          border-radius: 1px;
        }

        .node-content {
          flex: 1;
          padding-top: 8px;
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .node-step {
          font-size: 0.875rem;
          color: #6366F1;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .node-duration {
          font-size: 0.875rem;
          color: #6B7280;
          background: #F3F4F6;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 500;
        }

        .node-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1F2937;
          margin: 0;
        }

        /* Content Display */
        .content-display {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: start;
          margin-bottom: 80px;
        }

        .step-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid #F3F4F6;
          position: relative;
          overflow: hidden;
        }

        .step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--step-gradient);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .step-meta {
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .step-indicator {
          width: 60px;
          height: 60px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #6366F1;
        }

        .step-info {
          flex: 1;
        }

        .step-phase {
          font-size: 0.875rem;
          color: #6B7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          display: block;
        }

        .step-info h3 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1F2937;
          margin: 0;
        }

        .step-timing {
          text-align: right;
        }

        .timing-label {
          display: block;
          font-size: 0.875rem;
          color: #6B7280;
          margin-bottom: 4px;
        }

        .timing-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1F2937;
          background: #F3F4F6;
          padding: 6px 12px;
          border-radius: 8px;
        }

        .step-description {
          font-size: 1.125rem;
          color: #4B5563;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .step-deliverables {
          margin-bottom: 32px;
        }

        .deliverables-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 16px;
        }

        .deliverables-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .deliverable-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #F8FAFC;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .deliverable-item:hover {
          background: #F1F5F9;
          transform: translateX(4px);
        }

        .deliverable-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-circle {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .deliverable-item span {
          color: #374151;
          font-weight: 500;
        }

        .step-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #D1D5DB;
          color: #374151;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .control-btn:hover {
          background: #F9FAFB;
          border-color: #9CA3AF;
          transform: translateY(-1px);
        }

        .step-pagination {
          display: flex;
          gap: 8px;
        }

        .pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-dot.active {
          transform: scale(1.2);
        }

        /* Process Visualization */
        .process-visualization {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visual-container {
          position: relative;
          width: 100%;
          max-width: 400px;
        }

        .process-wheel {
          position: relative;
          width: 100%;
          height: 400px;
        }

        .wheel-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }

        .center-core {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          animation: corePulse 3s ease-in-out infinite;
        }

        .wheel-items {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .wheel-item {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(var(--item-angle)) translateY(-160px) rotate(calc(-1 * var(--item-angle)));
          transition: all 0.5s ease;
        }

        .wheel-item.active {
          transform: translate(-50%, -50%) rotate(var(--item-angle)) translateY(-140px) rotate(calc(-1 * var(--item-angle)));
        }

        .item-marker {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .wheel-item.active .item-marker {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .item-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 24px;
          text-align: center;
        }

        .item-label span {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6B7280;
          white-space: nowrap;
        }

        .wheel-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.1;
          z-index: 1;
        }

        /* Process Benefits */
        .process-benefits {
          background: white;
          border-radius: 20px;
          padding: 60px 40px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid #F3F4F6;
        }

        .benefits-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .benefits-header h3 {
          font-size: 2rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 12px;
        }

        .benefits-header p {
          font-size: 1.125rem;
          color: #6B7280;
          margin: 0;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
        }

        .benefit-card {
          text-align: center;
          padding: 32px 24px;
          background: #F8FAFC;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .benefit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .benefit-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .benefit-card h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 12px;
        }

        .benefit-card p {
          color: #6B7280;
          line-height: 1.5;
          margin: 0;
        }

        /* Animations */
        @keyframes corePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .content-display {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .main-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .creative-process {
            padding: 60px 0;
          }

          .main-title {
            font-size: 2rem;
          }

          .timeline-node {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .node-connector {
            display: none;
          }

          .card-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .step-meta {
            flex-direction: column;
            gap: 16px;
          }

          .step-controls {
            flex-direction: column;
            gap: 16px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 16px;
          }

          .step-card {
            padding: 24px 20px;
          }

          .process-wheel {
            height: 300px;
          }

          .wheel-item {
            transform: translate(-50%, -50%) rotate(var(--item-angle)) translateY(-120px) rotate(calc(-1 * var(--item-angle)));
          }

          .wheel-item.active {
            transform: translate(-50%, -50%) rotate(var(--item-angle)) translateY(-100px) rotate(calc(-1 * var(--item-angle)));
          }
        }
      `}</style>
    </section>
  );
};

export default CreativeProcess;