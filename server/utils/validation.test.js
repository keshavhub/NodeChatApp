const expect = require('expect');

const {isRealString} = require('./validation');

describe('generateMessage', () => {
  it('should reject non-string values', () => {
    var testString = 98;
    var check = isRealString(testString)
    expect(check).toBe(false);
  });

  it('should reject string with only spaces', () => {
    var testString = '    ';
    var check = isRealString(testString)
    expect(check).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    var testString = '   validString   ';
    var check = isRealString(testString)
    expect(check).toBe(true);
  });
});
