import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for Jest 29 + jsdom (MUST be before enzyme)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Enzyme setup for existing tests
configure({ adapter: new Adapter() });

// React Testing Library is ready to use (import in test files as needed)
// Note: @testing-library/jest-dom can be imported in individual test files after expect is defined
