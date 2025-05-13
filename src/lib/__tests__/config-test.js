/**
 * Basic test file to verify Jest configuration is working
 */

describe('Jest Configuration Test', () => {
  test('Basic test should pass', () => {
    expect(true).toBeTruthy();
  });

  test('Math operations work correctly', () => {
    expect(1 + 1).toBe(2);
    expect(5 * 5).toBe(25);
    expect(10 / 2).toBe(5);
  });

  test('String operations work correctly', () => {
    expect('hello ' + 'world').toBe('hello world');
    expect('test'.toUpperCase()).toBe('TEST');
    expect('  trim  '.trim()).toBe('trim');
  });

  test('Array operations work correctly', () => {
    const array = [1, 2, 3];
    expect(array).toHaveLength(3);
    expect(array).toContain(2);
    expect(array.map(x => x * 2)).toEqual([2, 4, 6]);
  });
});
