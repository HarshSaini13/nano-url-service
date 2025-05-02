import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-4">
              <i className="fas fa-link me-2"></i>
              NanoURL
            </h5>
            <p className="mb-3">
              A scalable, high-performance URL shortening service designed to
              make your links more manageable and trackable.
            </p>
            <div className="social-icons">
              <a href="#!" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#!" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#!" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#!" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="mb-4">Links</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#stats">Stats</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
            </ul>
          </div>
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-4">Resources</h5>
            <ul className="footer-links">
              <li>
                <a href="#!">API Documentation</a>
              </li>
              <li>
                <a href="#!">Developer Guide</a>
              </li>
              <li>
                <a href="#!">Integrations</a>
              </li>
              <li>
                <a href="#!">Status</a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5 className="mb-4">Legal</h5>
            <ul className="footer-links">
              <li>
                <a href="#!">Terms of Service</a>
              </li>
              <li>
                <a href="#!">Privacy Policy</a>
              </li>
              <li>
                <a href="#!">Cookie Policy</a>
              </li>
              <li>
                <a href="#!">GDPR</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">
              &copy; {currentYear} NanoURL. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0">
              Made with <i className="fas fa-heart text-danger"></i> by the
              NanoURL Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
