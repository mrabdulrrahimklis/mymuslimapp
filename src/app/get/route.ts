import { storeFor } from '@/lib/stores';

/** The QR code's target: the phone's own store, or the app section of the site on a computer. */
export function GET(request: Request) {
  const store = storeFor(request.headers.get('user-agent'));
  return new Response(null, {
    status: 302,
    headers: { location: store ?? '/#app', 'cache-control': 'no-store', vary: 'user-agent' },
  });
}
