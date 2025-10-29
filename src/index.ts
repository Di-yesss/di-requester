// function that validates error based on provided type
type TValidateError<T = unknown> = (err: unknown) => T;

class Requester<E = unknown> {
  validateError: TValidateError<E>;

  constructor(validateError?: TValidateError<E>) {
    this.validateError = validateError ?? ((err) => err as E);
  }

  async request<T>(input: RequestInfo | URL, init?: RequestInit) {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('JSON response expected');
    }

    const data: T = await res.json();

    if (!res.ok) {
      throw this.validateError(data);
    }

    return data;
  }
}

const initRequester = <E>(validateError?: TValidateError<E>) => {
  const requester = new Requester<E>(validateError);

  const request: <T>(
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<T> = requester.request.bind(requester);

  return request;
};

export default initRequester;
