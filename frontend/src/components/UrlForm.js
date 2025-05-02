import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { shortenUrl } from '../services/urlService';

const UrlForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError('');
    setShortUrl('');

    // Validate URL
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      // Simple URL validation
      new URL(url);
    } catch (err) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      const response = await shortenUrl(url);
      console.log('API Response:', response.data); // Debug log

      // Correctly access the shortUrl from the nested data object
      setShortUrl(response.data.data.shortUrl);
      setUrl('');

      // Show success message
      toast.success('URL shortened successfully!');
    } catch (err) {
      console.error('Error response:', err.response); // Debug log
      const errorMessage =
        err.response?.data?.message ||
        'An error occurred while shortening the URL';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => {
        toast.success('URL copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy URL');
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="url-form">
            <h2 className="text-center mb-4">Shorten Your URL</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    error ? 'is-invalid' : ''
                  }`}
                  placeholder="Enter your long URL here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    'Shorten'
                  )}
                </button>
              </div>
              {error && <div className="text-danger mb-3">{error}</div>}
            </form>

            {shortUrl && (
              <div className="url-result mt-4">
                <h5 className="mb-3">Your shortened URL:</h5>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={shortUrl}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-primary copy-btn"
                    type="button"
                    onClick={copyToClipboard}
                  >
                    <i className="fas fa-copy"></i> Copy
                  </button>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Open
                  </a>
                  <a
                    href={`/stats/${shortUrl.split('/').pop()}`}
                    className="btn btn-outline-secondary"
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    Stats
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlForm;
