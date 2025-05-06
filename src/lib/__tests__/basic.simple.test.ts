describe('Basic Test', () => {
  test('sum function works', () => {
    function sum(a: number, b: number): number {
      return a + b;
    }
    
    expect(sum(1, 2)).toBe(3);
  });
});
