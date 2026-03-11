// Mock cheerio to avoid ESM issues with enzyme in Jest
module.exports = {
	contains: jest.fn(),
	merge: jest.fn(),
};
