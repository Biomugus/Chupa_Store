import '@testing-library/jest-dom';
import React from 'react';
import { configure, cleanup } from '@testing-library/react';

configure({ asyncUtilTimeout: 3000 });

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
})

jest.mock('next/image', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: (props: any) => {
      const { fill, priority, unoptimized, 'data-testid': dataTestId, ...rest } = props;
      return <img {...rest} data-testid={dataTestId} />;
    },
  };
});
