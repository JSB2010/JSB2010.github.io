'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const storedApiKey = localStorage.getItem('adminApiKey');
    if (storedApiKey) {
      // Verify the API key
      verifyApiKey(storedApiKey);
    }
  }, []);

  // Redirect to submissions page if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/submissions');
    }
  }, [isAuthenticated, router]);

  // Verify API key by making a test request
  const verifyApiKey = async (key: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/submissions?limit=1', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });

      if (response.ok) {
        // Store API key in localStorage
        localStorage.setItem('adminApiKey', key);
        setIsAuthenticated(true);
      } else {
        setError('Invalid API key. Please try again.');
        localStorage.removeItem('adminApiKey');
      }
    } catch (error) {
      setError('An error occurred while verifying the API key. Please try again.');
      console.error('API key verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      verifyApiKey(apiKey);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your API key to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !apiKey}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            This page is restricted to administrators only.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}