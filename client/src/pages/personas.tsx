import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePersonaStore } from '../lib/personaStore';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PersonasPage() {
  const { personas, loading, error, loadPersonas, createPersona, updatePersona, deletePersona, clearError } = usePersonaStore();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    context: '',
    experience: '',
    motivations: '',
    constraints: ''
  });

  useEffect(() => {
    loadPersonas();
  }, [loadPersonas]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      context: '',
      experience: '',
      motivations: '',
      constraints: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPersona) {
        await updatePersona(editingPersona.id, formData);
        setEditingPersona(null);
        toast({
          title: "Success",
          description: "Persona updated successfully",
        });
      } else {
        await createPersona(formData);
        setIsCreateOpen(false);
        toast({
          title: "Success",
          description: "Persona created successfully",
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save persona",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (persona: any) => {
    setFormData({
      name: persona.name,
      description: persona.description,
      context: persona.context,
      experience: persona.experience,
      motivations: persona.motivations,
      constraints: persona.constraints
    });
    setEditingPersona(persona);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this persona?')) {
      try {
        await deletePersona(id);
        toast({
          title: "Success",
          description: "Persona deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete persona",
          variant: "destructive",
        });
      }
    }
  };

  const PersonaForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., New Managers, Senior Engineers"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed context about this group"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="context">Context</Label>
          <Textarea
            id="context"
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            placeholder="Their work environment, challenges"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="experience">Experience</Label>
          <Textarea
            id="experience"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder="What they know coming in"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="motivations">Motivations</Label>
          <Textarea
            id="motivations"
            value={formData.motivations}
            onChange={(e) => setFormData({ ...formData, motivations: e.target.value })}
            placeholder="What drives them, pain points"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="constraints">Constraints</Label>
          <Textarea
            id="constraints"
            value={formData.constraints}
            onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
            placeholder="Time, attention, learning preferences"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm();
            setIsCreateOpen(false);
            setEditingPersona(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {editingPersona ? 'Update' : 'Create'} Persona
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Personas
          </h1>
          <p className="text-muted-foreground mt-1">
            Define foundational design entities for your learning experiences
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Persona
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Persona</DialogTitle>
              <DialogDescription>
                Define a learner persona that will guide your content creation
              </DialogDescription>
            </DialogHeader>
            <PersonaForm />
          </DialogContent>
        </Dialog>
      </div>

      {loading && personas.length === 0 ? (
        <div className="text-center py-8">
          <p>Loading personas...</p>
        </div>
      ) : personas.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No personas yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first persona to start building targeted learning experiences
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Persona
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => (
            <Card key={persona.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {persona.description}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(persona)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(persona.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Context</h4>
                  <p className="text-sm">{persona.context}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Experience</h4>
                  <p className="text-sm">{persona.experience}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Motivations</h4>
                  <p className="text-sm">{persona.motivations}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Constraints</h4>
                  <p className="text-sm">{persona.constraints}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPersona} onOpenChange={() => setEditingPersona(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Persona</DialogTitle>
            <DialogDescription>
              Update the persona details
            </DialogDescription>
          </DialogHeader>
          <PersonaForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}