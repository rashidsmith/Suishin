import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, FileText, Image, Video, Music } from "lucide-react";

export default function Cards() {
  const cardTypes = [
    {
      type: 'text',
      name: 'Text Card',
      description: 'Create cards with rich text content',
      icon: FileText,
      color: 'bg-green-100 text-green-700'
    },
    {
      type: 'image',
      name: 'Image Card',
      description: 'Add visual content with images',
      icon: Image,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      type: 'video',
      name: 'Video Card',
      description: 'Embed video content for learning',
      icon: Video,
      color: 'bg-red-100 text-red-700'
    },
    {
      type: 'audio',
      name: 'Audio Card',
      description: 'Include audio content and narration',
      icon: Music,
      color: 'bg-yellow-100 text-yellow-700'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Card Composer</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Design interactive learning cards with rich media content
        </p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardContent className="py-6">
          <div className="text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Card Composer Coming Soon
            </h3>
            <p className="text-blue-700">
              This feature will allow you to create rich, interactive learning cards with various content types.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Card Types Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardTypes.map((cardType) => {
          const Icon = cardType.icon;
          return (
            <Card key={cardType.type} className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-3">
                <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${cardType.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{cardType.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {cardType.description}
                </p>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Card
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
              <CardTitle className="text-lg">Rich Content Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create cards with rich text formatting, embedded media, and interactive elements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Template Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from pre-designed card templates for different learning scenarios.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Interactive Elements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Add quizzes, polls, and interactive components to engage learners.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}