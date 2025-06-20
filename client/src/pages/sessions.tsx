import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Plus, Clock, Users, BarChart } from "lucide-react";

export default function Sessions() {
  const sessionTypes = [
    {
      type: 'individual',
      name: 'Individual Session',
      description: 'Self-paced learning sessions',
      icon: Users,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      type: 'group',
      name: 'Group Session',
      description: 'Collaborative learning experiences',
      icon: Users,
      color: 'bg-green-100 text-green-700'
    },
    {
      type: 'assessment',
      name: 'Assessment Session',
      description: 'Evaluate learning progress',
      icon: BarChart,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      type: 'timed',
      name: 'Timed Session',
      description: 'Time-limited learning activities',
      icon: Clock,
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <PlayCircle className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Session Builder</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create and manage learning sessions to deliver your educational content
        </p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardContent className="py-6">
          <div className="text-center">
            <PlayCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Session Builder Coming Soon
            </h3>
            <p className="text-blue-700">
              This feature will allow you to create structured learning sessions with progress tracking and analytics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Session Types Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sessionTypes.map((sessionType) => {
          const Icon = sessionType.icon;
          return (
            <Card key={sessionType.type} className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-3">
                <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${sessionType.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{sessionType.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {sessionType.description}
                </p>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Preview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Upcoming Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor learner progress through sessions with detailed analytics and reporting.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sessions that adapt to learner performance and adjust difficulty automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Collaborative Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Enable group discussions, peer feedback, and collaborative learning activities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}