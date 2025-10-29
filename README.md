# @di_yes/requester

A type-safe fetch wrapper for TypeScript with pluggable error validators.
Check out my project on [GitHub](https://github.com/Di-yesss/di-requester)

## Install

```bash
npm install @di_yes/requester
```

## Usage

```ts
import initRequester from '@di_yes/requester';

type ErrorType = {
  status: number;
  message: string;
};

type DataType = {
  data: string[];
};

const validateError = (err: unknown): ErrorType => {
  /* validation error */
};

const request = initRequester<ErrorType>(validateError);

const requestData = async () => {
  try {
    const data = await request<DataType>('https://api.example.com');
    /* handling data */
  } catch (error) {
    console.error('Request failed:', error);
    /* handling error */
  }
};
```

If validateError function **is not provided**, the requester will throw the raw error:

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
