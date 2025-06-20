import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Monitor, RefreshCw, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useSessionStore } from "../lib/sessionStore";
import { useToast } from "@/hooks/use-toast";

interface ModalitySelectionStepProps {
  sessionId: string | null;
  onStepComplete: (stepId: string) => void;
}

interface ModalityOption {
  id: 'onsite' | 'virtual' | 'hybrid';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
  considerations: string[];
}

export const ModalitySelectionStep = ({ sessionId, onStepComplete }: ModalitySelectionStepProps) => {
  const [selectedModality, setSelectedModality] = useState<'onsite' | 'virtual' | 'hybrid' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateSession } = useSessionStore();
  const { toast } = useToast();

  const modalities: ModalityOption[] = [
    {
      id: 'onsite',
      title: 'In-Person',
      description: 'Face-to-face training in a physical location',
      icon: Building2,
      benefits: ['Direct interaction', 'Hands-on activities', 'Group dynamics', 'Immediate feedback'],
      considerations: ['Travel required', 'Scheduling coordination', 'Physical materials', 'Venue costs']
    },
    {
      id: 'virtual',
      title: 'Virtual',
      description: 'Online training via video conferencing',
      icon: Monitor,
      benefits: ['No travel', 'Recording possible', 'Digital tools', 'Global reach'],
      considerations: ['Screen fatigue', 'Tech requirements', 'Engagement challenges', 'Internet dependency']
    },
    {
      id: 'hybrid',
      title: 'Hybrid',
      description: 'Mix of in-person and virtual components',
      icon: RefreshCw,
      benefits: ['Flexibility', 'Best of both', 'Phased delivery', 'Cost optimization'],
      considerations: ['Complex coordination', 'Dual preparation', 'Tech setup', 'Consistency challenges']
    }
  ];

  const handleSelectModality = async (modalityId: 'onsite' | 'virtual' | 'hybrid') => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      await updateSession(sessionId, { modality: modalityId });
      setSelectedModality(modalityId);
      toast({
        title: "Modality Selected",
        description: `${modalities.find(m => m.id === modalityId)?.title} delivery method selected`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save modality selection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedModality) {
      onStepComplete('choose-modality');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Choose Your Delivery Method
          </CardTitle>
          <CardDescription>
            Your learning objectives are set. Now choose how to deliver them effectively to maximize impact.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6">
        {modalities.map((modality) => {
          const IconComponent = modality.icon;
          const isSelected = selectedModality === modality.id;
          
          return (
            <Card
              key={modality.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              }`}
              onClick={() => handleSelectModality(modality.id)}
            >
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-full ${
                    isSelected 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      isSelected 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                </div>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  {modality.title}
                  {isSelected && <CheckCircle className="w-5 h-5 text-green-600" />}
                </CardTitle>
                <CardDescription className="text-sm">
                  {modality.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                    ✓ Benefits
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {modality.benefits.map((benefit, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-1">
                    ⚠ Considerations
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {modality.considerations.map((consideration, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {consideration}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedModality 
                ? `Selected: ${modalities.find(m => m.id === selectedModality)?.title}`
                : 'Please select a delivery method to continue'}
            </p>
            <Button
              onClick={handleContinue}
              disabled={!selectedModality || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue to 4C Activities
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};