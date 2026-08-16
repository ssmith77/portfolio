export function getExpectedToken() {
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  return Buffer.from(password.split('').reverse().join('')).toString('base64');
}

export function isAuthorized(request: Request) {
  const header = request.headers.get('x-admin-token');
  return header === getExpectedToken();
}
