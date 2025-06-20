import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAIContent } from "@/hooks/useAIContent";
import { FormattedIBODisplay } from "./FormattedIBODisplay";
import { Loader2, RefreshCw, CheckCircle, Edit3, Target, BookOpen, Briefcase, Lightbulb } from "lucide-react";
import { useState } from "react";

interface GenerateIBOsStepProps {
  sessionId: string | null;
  onStepComplete: (stepId: string) => void;
}

export const GenerateIBOsStep = ({ sessionId, onStepComplete }: GenerateIBOsStepProps) => {
  const { aiContent, generateIBOs, refineIBOs, updateRefinedIBOs } = useAIContent(sessionId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [customRefinementRequest, setCustomRefinementRequest] = useState("");
  const [showRefinementOptions, setShowRefinementOptions] = useState(false);

  const handleGenerate = async () => {
    const result = await generateIBOs();
    if (result.success) {
      // Auto-complete this step when generation succeeds
      setTimeout(() => {
        onStepComplete('generate-ibos');
      }, 1000);
    }
  };

  const handleEdit = () => {
    setEditedContent(aiContent.refinedIBOs || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateRefinedIBOs(editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent("");
    setIsEditing(false);
  };

  const handleRefinement = async (request: string) => {
    const result = await refineIBOs(request);
    if (result.success) {
      setCustomRefinementRequest("");
    }
  };

  const refinementOptions = [
    {
      icon: Target,
      title: "More Specific",
      description: "Make objectives more specific and measurable",
      request: "Make the objectives more specific and measurable with clear success criteria"
    },
    {
      icon: BookOpen,
      title: "Simplify",
      description: "Simplify for beginner level understanding",
      request: "Simplify the language and concepts for beginner-level learners"
    },
    {
      icon: Briefcase,
      title: "Business Impact",
      description: "Focus on immediate business impact",
      request: "Focus more on immediate business impact and ROI for the organization"
    },
    {
      icon: Lightbulb,
      title: "More Practical",
      description: "Add practical application examples",
      request: "Add more practical application examples and real-world scenarios"
    }
  ];

  if (aiContent.generatedIBOs) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Generated Learning Objectives
            </CardTitle>
            <CardDescription>
              AI has created structured IBOs based on your persona and topic. You can refine the content or regenerate it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Refine your IBOs content here..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border max-h-96 overflow-auto">
                  <FormattedIBODisplay rawContent={aiContent.refinedIBOs} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    disabled={aiContent.isGenerating}
                    className="flex items-center gap-2"
                  >
                    {aiContent.isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {aiContent.isGenerating ? 'Regenerating...' : 'Regenerate'}
                  </Button>
                  <Button onClick={handleEdit} variant="outline">
                    Edit Content
                  </Button>
                  <Button 
                    onClick={() => setShowRefinementOptions(!showRefinementOptions)} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Refine with AI
                  </Button>
                  <Button onClick={() => onStepComplete('generate-ibos')}>
                    Continue to Modality Selection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {showRefinementOptions && aiContent.generatedIBOs && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Refine Your IBOs
              </CardTitle>
              <CardDescription>
                Use AI to iteratively improve your generated content with specific refinement requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {refinementOptions.map((option, index) => {
                  const IconComponent = option.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start text-left space-y-2"
                      onClick={() => handleRefinement(option.request)}
                      disabled={aiContent.isGenerating}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{option.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {option.description}
                      </span>
                    </Button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-refinement">Custom Refinement Request</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-refinement"
                    value={customRefinementRequest}
                    onChange={(e) => setCustomRefinementRequest(e.target.value)}
                    placeholder="Describe how you'd like to refine the IBOs..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleRefinement(customRefinementRequest)}
                    disabled={aiContent.isGenerating || !customRefinementRequest.trim()}
                    className="flex items-center gap-2"
                  >
                    {aiContent.isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Edit3 className="h-4 w-4" />
                    )}
                    {aiContent.isGenerating ? 'Refining...' : 'Refine'}
                  </Button>
                </div>
              </div>

              {aiContent.isGenerating && (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is refining your IBOs...</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {aiContent.error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="text-red-600 dark:text-red-400">{aiContent.error}</div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Learning Objectives</CardTitle>
          <CardDescription>
            AI will create complete IBOs (Intended Business Outcomes) with structured hierarchy including Performance Metrics, Observable Behaviors, and Learning Objectives based on your selected persona and topic.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium mb-2">What will be generated:</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
              <li>• 3-4 Business Objectives with clear titles</li>
              <li>• WIIFM (What's In It For Me) for each objective</li>
              <li>• Performance Metrics (2-3 per objective)</li>
              <li>• Observable Behaviors (2-3 per metric)</li>
              <li>• Learning Objectives (1-2 per behavior)</li>
            </ul>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={aiContent.isGenerating || !sessionId}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            {aiContent.isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating IBOs...
              </>
            ) : (
              'Generate IBOs with AI'
            )}
          </Button>

          {aiContent.error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-800">
              {aiContent.error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};