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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Learning Architect
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A comprehensive platform for creating, managing, and delivering educational content. 
            Build IBOs, design learning cards, create sessions, and export your educational materials.
          </p>
          
          {/* API Status */}
          <div className="flex justify-center mb-8">
            <Badge variant={apiStatus === 'connected' ? 'default' : 'destructive'} className="text-sm px-4 py-2">
              <Database className="h-4 w-4 mr-2" />
              Database {apiStatus}
            </Badge>
          </div>

          {/* Demo Data Creation */}
          {!demoCreated && (
            <div className="mb-8">
              <Button 
                onClick={createSampleData} 
                disabled={creatingDemo}
                size="lg"
                className="px-8 py-3"
              >
                {creatingDemo ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Demo Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Try with Sample Data
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Creates sample IBO, Card, and Session to get you started
              </p>
            </div>
          )}

          {demoCreated && (
            <Alert className="max-w-md mx-auto mb-8">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Demo data created successfully! Explore the features now.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Target className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>IBO Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create Intended Business Outcomes with learning objectives and observable behaviors.
              </p>
              <Link to="/ibo-builder">
                <Button className="w-full">
                  Build IBOs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Card Composer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Design learning cards with activities using the 4C framework (Connection, Concept, etc.).
              </p>
              <Link to="/card-composer">
                <Button className="w-full">
                  Create Cards
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <PlayCircle className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Session Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Build learning sessions by combining cards and tracking progress through the learning journey.
              </p>
              <Link to="/session-builder">
                <Button className="w-full">
                  Build Sessions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Download className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <CardTitle>Export Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Export your educational content in JSON or CSV formats for external use.
              </p>
              <Link to="/export">
                <Button className="w-full">
                  Export Data
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create an IBO</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Start by defining your Intended Business Outcomes with learning objectives
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-300">2</span>
                </div>
                <h3 className="font-semibold mb-2">Design Cards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create learning cards with activities using the 4C framework
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">3</span>
                </div>
                <h3 className="font-semibold mb-2">Build Sessions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Combine cards into learning sessions and track progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Comprehensive Learning Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600">IBOs</div>
              <div className="text-gray-600 dark:text-gray-300">Business Outcomes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">Cards</div>
              <div className="text-gray-600 dark:text-gray-300">Learning Content</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">Sessions</div>
              <div className="text-gray-600 dark:text-gray-300">Learning Journeys</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">Export</div>
              <div className="text-gray-600 dark:text-gray-300">Data Formats</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}