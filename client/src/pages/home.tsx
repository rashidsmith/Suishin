import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Server, 
  Database, 
  Code, 
  Play,
  Plus,
  Users 
} from "lucide-react";
import { apiClient } from '../lib/api';
import { useAppStore } from '../lib/store';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('checking...');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { user, setUser, setLoading } = useAppStore();

  // Test API connection
  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await apiClient.get('/health');
        setApiStatus('connected');
      } catch (error) {
        setApiStatus('disconnected');
      }
    };
    testApi();
  }, []);

  const handleCreateUser = async () => {
    if (!userName || !userEmail) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.post('/users', {
        username: userName,
        email: userEmail
      });
      
      if (response.data) {
        setUser(response.data as any);
        setUserName('');
        setUserEmail('');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
              <Code className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Fullstack JS App
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            React + Express + TypeScript + Tailwind CSS with Supabase integration
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Frontend</h3>
                  <p className="text-sm text-gray-600">React + Vite</p>
                  <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                    Running
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  apiStatus === 'connected' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Server className={`w-6 h-6 ${
                    apiStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Backend</h3>
                  <p className="text-sm text-gray-600">Express API</p>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 ${
                      apiStatus === 'connected' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {apiStatus === 'connected' ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Database</h3>
                  <p className="text-sm text-gray-600">Supabase</p>
                  <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-700">
                    Ready
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test API Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Test API Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Enter username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                  placeholder="Enter email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleCreateUser}
                disabled={isLoading || !userName || !userEmail}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create Test User'}
              </Button>
              
              {user && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">User Created Successfully!</h4>
                  <div className="text-sm text-green-700">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Username:</strong> {user.email}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <h4 className="font-semibold">React</h4>
                <p className="text-sm text-gray-600">Frontend</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <h4 className="font-semibold">Express</h4>
                <p className="text-sm text-gray-600">Backend</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <h4 className="font-semibold">TypeScript</h4>
                <p className="text-sm text-gray-600">Language</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <div className="w-12 h-12 bg-cyan-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <h4 className="font-semibold">Tailwind</h4>
                <p className="text-sm text-gray-600">Styling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}