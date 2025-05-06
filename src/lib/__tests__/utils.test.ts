import { cn } from '@/lib/utils';

describe('cn function', () => {
  test('should merge class names correctly', () => {
    // Test basic class merging
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    
    // Test conditional class merging
    const isActive = true;
    expect(cn('base-class', isActive && 'active-class')).toBe('base-class active-class');
    
    // Test with false conditions
    expect(cn('base-class', false && 'hidden-class')).toBe('base-class');
    
    // Test with undefined values
    expect(cn('base-class', undefined, 'other-class')).toBe('base-class other-class');
    
    // Test with tailwind conflicts (should use the last one)
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    
    // Test with object notation
    expect(cn({ 'text-red-500': true, 'bg-blue-500': false, 'p-4': true })).toBe('text-red-500 p-4');
  });
});
