import React from 'react';
import { render } from '@testing-library/react-native';
import TabOneScreen from '../app/(tabs)/index.tsx';

test('Text renders correctly', () => {
  const { getByText } = render(<TabOneScreen />);
  const textElement = getByText('Recent Posts');
  expect(textElement).toBeDefined();
});
