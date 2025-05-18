'use strict';

module.exports = {
  generateUniqueUrlData,
};

// This function is called by Artillery for each virtual user before making a request
// It sets a variable `uniqueUrl` in the virtual user's context
function generateUniqueUrlData(userContext, events, done) {
  const timestamp = Date.now();
  // Generate a random string component to ensure high probability of uniqueness
  const randomSuffix =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  userContext.vars.uniqueUrl = `https://example.com/very/long/url/for/artillery/${timestamp}-${randomSuffix}`;
  return done(); // Signal that the function has completed
}
