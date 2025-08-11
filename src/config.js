// Centralize CDN endpoints (prod defaults = official CloudFront)
export const CDN = {
  // Where models.json and models/* live
  MODELS_BASE: import.meta.env.VITE_MODELS_CDN || 'https://dr4wh7nh38tn3.cloudfront.net',
  // (optional) where site images live, if you later split assets
  SITE_BASE: import.meta.env.VITE_SITE_CDN || 'https://d7yb14d27s1sv.cloudfront.net',
};

export const MODELS_INDEX = `${CDN.MODELS_BASE}/models.json`;
export const modelURL = (filename) => `${CDN.MODELS_BASE}/models/${filename}`;
export const imageURL = (name) => `${CDN.SITE_BASE}/img/${name}`;
