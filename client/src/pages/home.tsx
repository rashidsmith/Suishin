import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Database, 
  Plus,
  BookOpen,
  CreditCard,
  PlayCircle,
  ArrowRight,
  Target,
  FileText,
  Download,
  Loader2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { apiClient } from '../lib/api';
import { useIBOStore, useCardStore } from '../lib/store';
import { useSessionStore } from '../lib/sessionStore';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('checking...');
  const [creatingDemo, setCreatingDemo] = useState(false);
  const [demoCreated, setDemoCreated] = useState(false);
  const { createIBO, loadIBOs } = useIBOStore();
  const { createCard, loadCards } = useCardStore();
  const { createSession, loadSessions } = useSessionStore();
  const { toast } = useToast();

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

  const createSampleData = async () => {
    setCreatingDemo(true);
    try {
      // Create sample IBO
      await createIBO('Digital Marketing Fundamentals', 'Learn the essentials of digital marketing strategy, social media management, and content creation');
      
      // Load IBOs to get the created one
      await loadIBOs();
      
      // Create sample Card
      await createCard({
        title: 'Social Media Strategy Basics',
        description: 'Understanding platform-specific strategies for maximum engagement',
        ibo_id: 'sample-ibo-id',
        learning_objective_id: 'sample-lo-id',
        target_duration: 45,
        activities: [
          {
            title: 'Platform Analysis',
            description: 'Analyze different social media platforms and their audiences',
            type: 'C1' as const,
            duration: 15
          },
          {
            title: 'Content Planning',
            description: 'Create a content calendar for social media posts',
            type: 'C2' as const,
            duration: 20
          },
          {
            title: 'Engagement Strategies',
            description: 'Develop techniques for increasing audience engagement',
            type: 'C3' as const,
            duration: 10
          }
        ]
      });

      // Create sample Session
      await createSession({
        user_id: 'demo-user',
        learning_objective_id: 'sample-lo-id',
        title: 'Introduction to Digital Marketing',
        description: 'Complete learning session covering digital marketing basics',
        card_ids: []
      });

      setDemoCreated(true);
      toast({
        title: "Demo Data Created!",
        description: "Sample IBO, Card, and Session have been created. Explore the application now.",
      });
    } catch (error) {
      toast({
        title: "Error Creating Demo Data",
        description: error instanceof Error ? error.message : "Failed to create sample data",
        variant: "destructive",
      });
    } finally {
      setCreatingDemo(false);
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

        {/* Quick Navigation */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Get started with the Learning Architect by exploring our main features:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/ibos">
                <Card className="cursor-pointer hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">IBO Builder</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Create learning objectives
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Start Building <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/cards">
                <Card className="cursor-pointer hover:shadow-md transition-shadow bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold text-green-900">Card Composer</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Design learning cards
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Coming Soon <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/sessions">
                <Card className="cursor-pointer hover:shadow-md transition-shadow bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <PlayCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Session Builder</h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Create learning sessions
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Coming Soon <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}