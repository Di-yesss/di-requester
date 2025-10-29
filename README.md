# @di/requester

A type-safe fetch wrapper for TypeScript with pluggable error validators.

## Install

```bash
npm install @di/requester
```

## Usage

```ts
import initRequester from '@di/requester';

type ErrorType = {
  status: number;
  message: string;
};

type DataType = {
  data: string[];
};

const validateError = (err: unknown): ErrorType => {
  if (typeof err === 'object' && err && 'status' in err && 'message' in err) {
    return err as ErrorType;
  }
  return { status: 500, message: 'Unknown error' };
};

const request = initRequester<ErrorType>(validateError);

(async () => {
  try {
    const data = await request<DataType>('https://api.example.com');
    /* handling data */
  } catch (error) {
    console.error('Request failed:', error);
    /* handling error */
  }
})();
```

If no validateError function is provided, the requester will throw the raw error:

```ts
const request = initRequester();

type DataType = {
  data: string[];
};

try {
  const data = await request<DataType>('https://api.example.com');
  /* handling data */
} catch (err) {
  console.error(err);
  /* handling error */
}
```

[MIT](./LICENSE) © 2025 Di
