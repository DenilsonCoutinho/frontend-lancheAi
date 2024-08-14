// lib/rateLimit.ts
const rateLimit = (windowMs: number, maxRequests: number) => {
    const requests: Record<string, number[]> = {};
  
    return (ip: string | null) => {
      if (!ip) {
        return new Response('Unable to determine client IP.', { status: 400 });
      }
  
      const now = Date.now();
  
      if (!requests[ip]) {
        requests[ip] = [];
      }
  
      requests[ip] = requests[ip].filter(timestamp => now - timestamp < windowMs);
  
      if (requests[ip].length >= maxRequests) {
        return new Response('Too many requests, please try again later.', { status: 429 });
      }
  
      requests[ip].push(now);
      return null; // Rate limit not exceeded
    };
  };
  
  export default rateLimit;
  