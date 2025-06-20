import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAIContent } from "@/hooks/useAIContent";
import { Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { useState } from "react";

interface GenerateIBOsStepProps {
  sessionId: string | null;
  onStepComplete: (stepId: string) => void;
}

export const GenerateIBOsStep = ({ sessionId, onStepComplete }: GenerateIBOsStepProps) => {
  const { aiContent, generateIBOs, updateRefinedIBOs } = useAIContent(sessionId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

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
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
                    {aiContent.refinedIBOs}
                  </pre>
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
                  <Button onClick={() => onStepComplete('generate-ibos')}>
                    Continue to Activities
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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