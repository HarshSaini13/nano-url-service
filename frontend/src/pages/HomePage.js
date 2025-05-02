import React from 'react';
import UrlForm from '../components/UrlForm';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="hero-title">Shorten, Share, Track</h1>
              <p className="hero-subtitle">
                Transform long, unwieldy links into clean, memorable, and
                trackable short URLs in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* URL Form Section */}
      <section className="py-5">
        <UrlForm />
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-12 text-center">
              <h2 className="mb-3">Why Choose Our URL Shortener?</h2>
              <p className="lead">
                Our service is designed with performance, reliability, and
                scalability in mind.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3>Lightning Fast</h3>
                <p>
                  Our service is optimized for speed with distributed caching
                  and efficient algorithms to ensure minimal latency.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Detailed Analytics</h3>
                <p>
                  Track clicks, geographic data, referrers, and more with our
                  comprehensive analytics dashboard.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Secure & Reliable</h3>
                <p>
                  Built with security in mind, our platform ensures your links
                  are safe and always available when you need them.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-expand-arrows-alt"></i>
                </div>
                <h3>Highly Scalable</h3>
                <p>
                  Our architecture is designed to handle millions of requests
                  per second, ensuring reliability at any scale.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-code"></i>
                </div>
                <h3>Developer Friendly</h3>
                <p>
                  Integrate with our RESTful API to programmatically create and
                  manage short URLs in your applications.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <h3>Global CDN</h3>
                <p>
                  Our service is distributed across multiple regions worldwide,
                  ensuring fast access from anywhere on the globe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="stat-item">
                <div className="stat-number">99.99%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <div className="stat-number">50M+</div>
                <div className="stat-label">URLs Shortened</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <div className="stat-number">100ms</div>
                <div className="stat-label">Avg. Response Time</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h2>About Our Service</h2>
              <p className="lead">
                We've built a URL shortening service that prioritizes
                performance, scalability, and reliability.
              </p>
              <p>
                Our platform is designed with a microservices architecture,
                utilizing the latest technologies to ensure high availability
                and low latency. We employ distributed caching, database
                sharding, and a global CDN to deliver a seamless experience to
                users worldwide.
              </p>
              <p>
                Whether you're sharing links on social media, tracking marketing
                campaigns, or managing URLs for your business, our service
                provides the tools you need to succeed.
              </p>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="mb-3">Technical Highlights</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Horizontally scalable microservices architecture
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Redis-based distributed caching for fast lookups
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      MongoDB database with sharding for high throughput
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Load balancing with consistent hashing
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      RESTful API with comprehensive documentation
                    </li>
                    <li>
                      <i className="fas fa-check-circle text-success me-2"></i>
                      Containerized deployment with Docker and Kubernetes
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
