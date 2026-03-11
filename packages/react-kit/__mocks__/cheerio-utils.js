// Mock cheerio/lib/utils to avoid ESM issues with enzyme in Jest
module.exports = {
	isHtml: jest.fn(() => false),
	isCheerio: jest.fn(() => false),
};
