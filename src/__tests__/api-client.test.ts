import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, mergeHeaders } from '@/shared/api/api-client';
import { ApiError } from '@/shared/api/api-error';

const originalFetch = globalThis.fetch;

function mockFetchResponse(
  body: string | null,
  init: { status?: number; statusText?: string } = {}
) {
  const status = init.status ?? 200;
  const response = {
    ok: status >= 200 && status < 300,
    status,
    statusText: init.statusText ?? 'OK',
    text: async () => body ?? '',
  } as unknown as Response;

  const fetchMock = vi.fn().mockResolvedValue(response);
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('apiClient header merging', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = '';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should keep the default JSON content-type when no headers are passed', async () => {
    const fetchMock = mockFetchResponse(JSON.stringify({ ok: true }));
    await apiClient('/test');

    const [, init] = fetchMock.mock.calls[0];
    const headers = init.headers as Headers;
    expect(headers.get('content-type')).toBe('application/json');
  });

  it('should merge plain-object caller headers without losing defaults', async () => {
    const fetchMock = mockFetchResponse(JSON.stringify({ ok: true }));
    await apiClient('/test', { headers: { 'X-Trace': 'abc' } });

    const [, init] = fetchMock.mock.calls[0];
    const headers = init.headers as Headers;
    expect(headers.get('x-trace')).toBe('abc');
    expect(headers.get('content-type')).toBe('application/json');
  });

  it('should accept Headers instances and tuple arrays', async () => {
    const fetchMock = mockFetchResponse(JSON.stringify({ ok: true }));
    await apiClient('/a', { headers: new Headers({ Authorization: 'Bearer t' }) });
    await apiClient('/b', { headers: [['X-From', 'tuple']] as [string, string][] });

    const first = fetchMock.mock.calls[0][1].headers as Headers;
    const second = fetchMock.mock.calls[1][1].headers as Headers;
    expect(first.get('authorization')).toBe('Bearer t');
    expect(first.get('content-type')).toBe('application/json');
    expect(second.get('x-from')).toBe('tuple');
  });

  it('should let caller values override the default content-type', async () => {
    const fetchMock = mockFetchResponse(JSON.stringify({ ok: true }));
    await apiClient('/upload', { headers: { 'Content-Type': 'multipart/form-data' } });

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get('content-type')).toBe('multipart/form-data');
  });

  it('should preserve other RequestInit fields', async () => {
    const fetchMock = mockFetchResponse(JSON.stringify({ ok: true }));
    await apiClient('/test', { method: 'POST', body: '{"a":1}', cache: 'no-store' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/test');
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"a":1}');
    expect(init.cache).toBe('no-store');
  });
});

describe('apiClient body handling', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should resolve JSON success payloads', async () => {
    mockFetchResponse(JSON.stringify({ id: 1 }));
    await expect(apiClient<{ id: number }>('/x')).resolves.toEqual({ id: 1 });
  });

  it('should resolve undefined for 204 No Content without throwing', async () => {
    mockFetchResponse(null, { status: 204, statusText: 'No Content' });
    await expect(apiClient('/x', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('should resolve undefined for an empty body on a 200 response', async () => {
    mockFetchResponse('');
    await expect(apiClient('/x')).resolves.toBeUndefined();
  });

  it('should throw ApiError carrying status and server message', async () => {
    mockFetchResponse(JSON.stringify({ message: 'Nope' }), {
      status: 400,
      statusText: 'Bad Request',
    });

    await expect(apiClient('/x')).rejects.toBeInstanceOf(ApiError);
    await expect(apiClient('/x')).rejects.toMatchObject({ status: 400, message: 'Nope' });
  });

  it('should fall back to status text when the error body is not JSON', async () => {
    mockFetchResponse('<html>oops</html>', { status: 500, statusText: 'Server Error' });
    await expect(apiClient('/x')).rejects.toMatchObject({ status: 500 });
  });
});

describe('mergeHeaders', () => {
  it('should return defaults when overrides are absent', () => {
    expect(mergeHeaders({ A: '1' }).get('a')).toBe('1');
  });

  it('should overwrite case-insensitively', () => {
    const merged = mergeHeaders({ 'content-type': 'application/json' }, { 'Content-Type': 'text/plain' });
    expect(merged.get('content-type')).toBe('text/plain');
  });
});
