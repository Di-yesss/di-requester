import initRequester from '../index';

const mockResponse = <T>(
  data: T,
  ok = true,
  contentType = 'application/json'
) =>
  ({
    ok,
    json: async () => data,
    headers: { get: () => contentType },
  } as any);

(global.fetch as jest.MockedFunction<typeof fetch>) = jest.fn();

describe('Requester', () => {
  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockReset();
  });

  it('returns JSON when response is ok', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse({ message: 'success' })
    );

    const request = initRequester();
    const data = await request<{ message: string }>('/api');

    expect(data).toEqual({ message: 'success' });
  });

  it('throws error when response is not ok', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse({ error: 'fail' }, false)
    );

    const request = initRequester<{ error: string }>();

    await expect(request('/api')).rejects.toEqual({ error: 'fail' });
  });

  it('throws on text/html response', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse({ message: 'ignored' }, true, 'text/html')
    );

    const request = initRequester();

    await expect(request('/api')).rejects.toThrow('JSON response expected');
  });

  it('supports custom validateError', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse({ code: 123 }, false)
    );

    const validateError = (err: any) => `Custom: ${err.code}`;
    const request = initRequester(validateError);

    await expect(request('/api')).rejects.toBe('Custom: 123');
  });

  // New Spec 1: Not-provided validateError
  it('uses default validateError when none provided', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse({ code: 0 }, false)
    );

    const request = initRequester(); // no validateError
    await expect(request('/api')).rejects.toEqual({ code: 0 });
  });

  // New Spec 2: Passes RequestInit options correctly
  it('sends RequestInit options correctly', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      mockResponse({ message: 'passed' })
    );

    const request = initRequester();

    const init: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 }),
    };

    const data = await request<{ message: string }>('/api', init);

    expect(data).toEqual({ message: 'passed' });
    expect(global.fetch).toHaveBeenCalledWith('/api', init);
  });
});
