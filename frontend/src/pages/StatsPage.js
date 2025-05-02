import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUrlStats } from '../services/urlService';

const StatsPage = () => {
  const { shortId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUrlStats(shortId);
        setStats(response.data.data);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Failed to fetch URL statistics';
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
      }
    };

    fetchStats();
  }, [shortId]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <Link to="/" className="alert-link">
              Go back to homepage
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">URL Not Found!</h4>
          <p>The short URL you're looking for doesn't exist or has expired.</p>
          <hr />
          <p className="mb-0">
            <Link to="/" className="alert-link">
              Go back to homepage
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-12 mb-4">
          <h1 className="mb-4">URL Statistics</h1>
          <div className="stats-card">
            <div className="row">
              <div className="col-md-8">
                <h3>URL Information</h3>
                <div className="mb-3">
                  <strong>Original URL:</strong>
                  <div className="text-break">
                    <a
                      href={stats.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {stats.originalUrl}
                    </a>
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Short URL:</strong>
                  <div>
                    <a
                      href={stats.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {stats.shortUrl}
                    </a>
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={() => {
                        navigator.clipboard.writeText(stats.shortUrl);
                        toast.success('URL copied to clipboard!');
                      }}
                    >
                      <i className="fas fa-copy"></i> Copy
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Created:</strong>
                  <div>{formatDate(stats.createdAt)}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center h-100">
                  <div className="card-body d-flex flex-column justify-content-center">
                    <h3 className="display-4 mb-0">{stats.clicks}</h3>
                    <p className="lead">Total Clicks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between">
            <Link to="/" className="btn btn-outline-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Home
            </Link>
            <a
              href={stats.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <i className="fas fa-external-link-alt me-2"></i>
              Visit Short URL
            </a>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">
              <i className="fas fa-info-circle me-2"></i>
              Pro Tip!
            </h4>
            <p>
              For more detailed analytics including geographic data, device
              information, and referrer tracking, upgrade to our premium plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
