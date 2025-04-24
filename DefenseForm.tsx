import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PixelBorder } from "@/components/ui/pixel-border";
import { useLocation } from "wouter";

interface DefenseFormProps {
  accusation: {
    id: number;
    content: string;
  };
  character: {
    id: number;
    name: string;
    type: string;
    description: string;
    avatarUrl: string;
  };
}

const defenseSchema = z.object({
  defenseTitle: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  defenseContent: z.string().min(20, "Defense must be at least 20 characters").max(1000, "Defense must be less than 1000 characters"),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the terms"),
});

type DefenseFormValues = z.infer<typeof defenseSchema>;

export default function DefenseForm({ accusation, character }: DefenseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const form = useForm<DefenseFormValues>({
    resolver: zodResolver(defenseSchema),
    defaultValues: {
      defenseTitle: "",
      defenseContent: "",
      acceptTerms: false,
    }
  });
  
  const { mutate: submitDefense, isPending } = useMutation({
    mutationFn: async (values: DefenseFormValues) => {
      return apiRequest('POST', '/api/trials', {
        characterId: character.id,
        accusationId: accusation.id,
        defenseTitle: values.defenseTitle,
        defenseContent: values.defenseContent,
        userId: 1, // In a real app, this would be the current user's ID
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/trials'] });
      toast({
        title: "DEFENSE SUBMITTED!",
        description: "Your case has been submitted to the Satirical Court of Justice!",
      });
      navigate("/trials");
    },
    onError: (error) => {
      toast({
        title: "SUBMISSION ERROR",
        description: `Failed to submit your defense: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (values: DefenseFormValues) => {
    submitDefense(values);
  };
  
  return (
    <section className="py-12 bg-gradient-to-b from-black to-retro-dark">
      <div className="container mx-auto px-4">
        <h2 className="font-pixel text-2xl text-center mb-8 text-retro-yellow">CREATE YOUR DEFENSE</h2>
        
        <PixelBorder className="max-w-3xl mx-auto bg-retro-dark p-6 rounded-lg">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <img 
                src={character.avatarUrl}
                alt={character.name} 
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-4">
                <h3 className="font-pixel text-retro-yellow">{character.name.toUpperCase()}</h3>
                <p className="font-mono text-xs text-retro-light">@{character.name.replace(/\s+/g, '')}</p>
              </div>
            </div>
            
            <div className="bg-black p-4 rounded mb-4">
              <h4 className="font-retro text-retro-pink mb-2">THE ACCUSATION:</h4>
              <p className="font-retro text-retro-light">{accusation.content}</p>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="defenseTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-pixel text-retro-green">DEFENSE TITLE</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter a catchy title for your defense..."
                        className="w-full bg-black border-2 border-retro-purple rounded p-3 font-retro text-retro-light focus:border-retro-yellow focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage className="text-retro-orange" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defenseContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-pixel text-retro-green">YOUR DEFENSE</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Make your case here..."
                        className="w-full bg-black border-2 border-retro-purple rounded p-3 font-retro text-retro-light focus:border-retro-yellow focus:outline-none h-32"
                      />
                    </FormControl>
                    <FormMessage className="text-retro-orange" />
                  </FormItem>
                )}
              />
              
              <div className="mb-4">
                <label className="block font-pixel text-retro-green mb-2">SUPPORTING EVIDENCE (OPTIONAL)</label>
                <div className="border-2 border-dashed border-retro-blue rounded p-4 text-center">
                  <i className="fas fa-file-upload text-retro-blue text-2xl mb-2"></i>
                  <p className="font-retro text-retro-light mb-2">Drag your evidence here or click to upload</p>
                  <input type="file" id="evidence" className="hidden" />
                  <button type="button" className="bg-retro-blue text-white font-mono text-xs px-4 py-2 rounded">BROWSE FILES</button>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <div className="flex items-center cursor-pointer" onClick={() => field.onChange(!field.value)}>
                        <div className="w-5 h-5 border-2 border-retro-green mr-2 flex items-center justify-center">
                          {field.value && <i className="fas fa-check text-retro-yellow text-xs"></i>}
                        </div>
                        <span className="font-mono text-sm text-retro-light">
                          I swear this defense is satirical and meant for entertainment purposes only
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-retro-orange" />
                  </FormItem>
                )}
              />
              
              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-retro-yellow text-retro-dark font-pixel px-8 py-3 rounded shadow-pixel transform transition hover:scale-105 hover:bg-retro-green hover:text-white"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    'SUBMIT DEFENSE'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </PixelBorder>
      </div>
    </section>
  );
}
