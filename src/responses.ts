import type { RouteResponse } from '@ph7/orbit';

const securityHeaders = {
  'content-security-policy':
    "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY'
};

export function html(body: string, status = 200): RouteResponse {
  return {
    status,
    headers: {
      ...securityHeaders,
      'content-type': 'text/html; charset=utf-8'
    },
    body
  };
}

export function json(body: unknown, status = 200): RouteResponse {
  return {
    status,
    headers: {
      ...securityHeaders,
      'access-control-allow-origin': '*',
      'cache-control': 'no-store',
      'content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body, null, 2)
  };
}

export function options(): RouteResponse {
  return {
    status: 204,
    headers: {
      ...securityHeaders,
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, HEAD, OPTIONS',
      'access-control-allow-headers': 'content-type',
      allow: 'GET, HEAD, OPTIONS'
    },
    body: ''
  };
}

export function methodNotAllowed(): RouteResponse {
  return {
    status: 405,
    headers: {
      ...securityHeaders,
      allow: 'GET, HEAD, OPTIONS',
      'content-type': 'text/plain; charset=utf-8'
    },
    body: 'Method not allowed.'
  };
}
