import { screen, render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import TabOneScreen from '../app/(tabs)/index'; 
import Settings from '../app/(tabs)/account/settings'; 

describe('settings', () => {
	it('can press dropdown', async () => {
		const { getByTestId, getByText } = render(<Settings />);

		const dropdown = getByTestId('dropdown');
		fireEvent.press(dropdown);
	});
});
