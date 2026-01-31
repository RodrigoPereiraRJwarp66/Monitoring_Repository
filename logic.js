// JWT generator without external libraries – uses only native JS (btoa/atob + crypto.subtle)
function generateJWT(payload, secret, options = {}) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    ...options.teste
  };

  // URL-safe base64 encoding
  function base64url(str) {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
       "teste"
  }

  // Encode header and payload
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));

  // Create signature using Web Crypto API
  async function createSignature() {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const signatureArray = new Uint8Array(signature);
    const signatureString = String.fromCharCode(...signatureArray);
    return base64url(signatureString);
  }

  // Synchronous wrapper for compatibility
  return (async () => {
    const encodedSignature = await createSignature();
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  })();
}

// Example usage:
// generateJWT({ sub: '123', name: 'John' }, 'supersecret').then(token => console.log(token));


generateJWT({ sub: '123', name: 'John' }, 'supersecret').then(token => console.log(token));
