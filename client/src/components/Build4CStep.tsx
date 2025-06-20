import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIContent } from "@/hooks/useAIContent";
import { FormattedIBODisplay } from "./FormattedIBODisplay";
import { Loader2, RefreshCw, CheckCircle, BookOpen, Users, Target, Lightbulb } from "lucide-react";

interface Build4CStepProps {
  sessionId: string | null;
  onStepComplete: (stepId: string) => void;
}

export const Build4CStep = ({ sessionId, onStepComplete }: Build4CStepProps) => {
  const { aiContent, saveActivities } = useAIContent(sessionId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use persisted activities if available, otherwise local state
  const generated4C = aiContent.generatedActivities;

  const generate4CActivities = async () => {
    if (!sessionId) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/sessions/${sessionId}/generate-4c`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          iboContent: aiContent.refinedIBOs || aiContent.generatedIBOs
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Persist 4C activities to database via useAIContent hook
        await saveActivities(data.content);
      } else {
        setError(data.error || 'Failed to generate 4C activities');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate 4C activities');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinue = () => {
    onStepComplete('build-4c');
  };

  const fourCExplanation = [
    {
      title: "Connection",
      icon: Users,
      description: "Connect learners to the topic and each other",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Concept",
      icon: Lightbulb,
      description: "Introduce key concepts and knowledge",
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Concrete Practice",
      icon: Target,
      description: "Apply learning through hands-on activities",
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Conclusion",
      icon: CheckCircle,
      description: "Summarize, reflect, and plan next steps",
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  if (!generated4C) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Build 4C Learning Activities
            </CardTitle>
            <CardDescription>
              AI will create Connection, Concept, Concrete Practice, and Conclusion activities 
              optimized for your chosen delivery method and learning objectives.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 4C Framework Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fourCExplanation.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <IconComponent className={`w-5 h-5 mt-0.5 ${item.color}`} />
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show current IBOs for context */}
            {aiContent.refinedIBOs && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Activities will be based on these learning objectives:
                </h4>
                <div className="bg-white dark:bg-gray-800 p-3 rounded border max-h-48 overflow-auto">
                  <FormattedIBODisplay rawContent={aiContent.refinedIBOs} />
                </div>
              </div>
            )}

            <Button
              onClick={generate4CActivities}
              disabled={isGenerating || !aiContent.refinedIBOs}
              className="w-full flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating 4C Activities...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Generate 4C Activities
                </>
              )}
            </Button>

            {error && (
              <div className="text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                <strong>Error:</strong> {error}
              </div>
            )}

            {!aiContent.refinedIBOs && (
              <div className="text-amber-600 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                <strong>Note:</strong> Please complete the IBO generation step first before creating 4C activities.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Generated 4C Activities
          </CardTitle>
          <CardDescription>
            Your learning activities are ready! Review and refine as needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border max-h-96 overflow-auto">
            <FormattedIBODisplay rawContent={generated4C} />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={generate4CActivities}
              variant="outline"
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isGenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
            
            <Button onClick={handleContinue} className="flex items-center gap-2">
              Continue to Review
              <CheckCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};