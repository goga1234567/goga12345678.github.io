import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PixelBorder } from "@/components/ui/pixel-border";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n"; 
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { LogOut, Settings, Award, User, Users, Gavel } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("my-characters");
  const [_, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: t('logout'),
          description: "Vous avez été déconnecté avec succès!",
          variant: "default"
        });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };
  
  const handleLoginClick = () => {
    setLocation("/auth");
  };
  
  if (!user) {
    return (
      <div className="py-16 bg-gradient-to-b from-retro-dark to-black min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl text-center mb-8 text-retro-pink glitch-animation">{t('profile')} - {t('login')}</h1>
          
          <PixelBorder className="max-w-md mx-auto bg-retro-dark p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl text-retro-yellow mb-4">🔒</div>
              <h2 className="font-pixel text-retro-orange text-lg mb-4">{t('login')}</h2>
              <p className="font-retro text-retro-light text-xl mb-6">
                {t('language') === 'Langue' 
                  ? "Vous devez vous connecter pour accéder à votre profil et créer des défenses pour vos personnages fictifs préférés !"
                  : "You must log in to access your profile and create defenses for your favorite fictional characters!"}
              </p>
            </div>
            
            <button 
              onClick={handleLoginClick}
              className="bg-retro-blue text-white font-pixel px-6 py-3 rounded shadow-pixel transform transition hover:scale-105 hover:bg-retro-green"
            >
              {t('login')} / {t('signup')}
            </button>
          </PixelBorder>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12 bg-gradient-to-b from-retro-dark to-black min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl text-center text-retro-pink">{t('profile')}</h1>
          <Button 
            onClick={handleLogout} 
            variant="destructive"
            className="font-pixel flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <PixelBorder className="bg-retro-dark p-6 text-center col-span-1">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="font-pixel text-retro-yellow text-lg mb-2">{user?.username}</h2>
              <div className="font-mono text-sm text-retro-light mb-4">@{user?.username}</div>
              <div className="font-mono text-xs text-retro-light">
                <div className="mb-2">
                  {t('karma')}: <span className="text-retro-green">+{user?.karma || 0}</span>
                </div>
                <div>
                  {t('language') === 'Langue' ? 'Membre depuis' : 'Member since'}: <span className="text-retro-blue">01/01/2023</span>
                </div>
              </div>
            </PixelBorder>
            
            <PixelBorder className="bg-retro-dark p-6 col-span-2">
              <h2 className="font-pixel text-retro-blue text-lg mb-4">
                {t('language') === 'Langue' ? 'STATISTIQUES DE DÉFENSE' : 'DEFENSE STATISTICS'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black bg-opacity-50 p-4 rounded">
                  <div className="font-retro text-retro-orange text-lg">{t('trials')}</div>
                  <div className="font-pixel text-retro-yellow text-2xl">24</div>
                </div>
                
                <div className="bg-black bg-opacity-50 p-4 rounded">
                  <div className="font-retro text-retro-green text-lg">
                    {t('language') === 'Langue' ? 'VICTOIRES' : 'VICTORIES'}
                  </div>
                  <div className="font-pixel text-retro-yellow text-2xl">18</div>
                </div>
                
                <div className="bg-black bg-opacity-50 p-4 rounded">
                  <div className="font-retro text-retro-pink text-lg">
                    {t('language') === 'Langue' ? 'TAUX DE VICTOIRE' : 'WIN RATE'}
                  </div>
                  <div className="font-pixel text-retro-yellow text-2xl">75%</div>
                </div>
                
                <div className="bg-black bg-opacity-50 p-4 rounded">
                  <div className="font-retro text-retro-blue text-lg">
                    {t('language') === 'Langue' ? 'RANG' : 'RANK'}
                  </div>
                  <div className="font-pixel text-retro-yellow text-2xl">#42</div>
                </div>
              </div>
            </PixelBorder>
          </div>
          
          <Tabs defaultValue="my-characters" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger 
                value="my-characters" 
                className="font-pixel text-sm"
              >
                {t('myCharacters')}
              </TabsTrigger>
              <TabsTrigger 
                value="my-trials" 
                className="font-pixel text-sm"
              >
                {t('myTrials')}
              </TabsTrigger>
              <TabsTrigger 
                value="my-votes" 
                className="font-pixel text-sm"
              >
                {t('language') === 'Langue' ? 'MES VOTES' : 'MY VOTES'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-characters">
              <PixelBorder className="bg-retro-dark p-6">
                <div className="text-center py-8">
                  <p className="font-retro text-retro-light text-xl mb-4">
                    {t('language') === 'Langue' 
                      ? "Vous n'avez pas encore créé de personnages !"
                      : "You haven't created any characters yet!"}
                  </p>
                  <button className="bg-retro-blue text-white font-pixel px-6 py-3 rounded shadow-pixel transform transition hover:scale-105 hover:bg-retro-green">
                    {t('createNewCharacter')}
                  </button>
                </div>
              </PixelBorder>
            </TabsContent>
            
            <TabsContent value="my-trials">
              <PixelBorder className="bg-retro-dark p-6">
                <div className="text-center py-8">
                  <p className="font-retro text-retro-light text-xl mb-4">
                    {t('language') === 'Langue' 
                      ? "Vous n'avez participé à aucun procès !"
                      : "You haven't participated in any trials yet!"}
                  </p>
                  <button className="bg-retro-blue text-white font-pixel px-6 py-3 rounded shadow-pixel transform transition hover:scale-105 hover:bg-retro-green">
                    {t('language') === 'Langue' ? 'COMMENCER UN PROCÈS' : 'START A TRIAL'}
                  </button>
                </div>
              </PixelBorder>
            </TabsContent>
            
            <TabsContent value="my-votes">
              <PixelBorder className="bg-retro-dark p-6">
                <div className="text-center py-8">
                  <p className="font-retro text-retro-light text-xl mb-4">
                    {t('language') === 'Langue' 
                      ? "Vous n'avez voté dans aucun procès !"
                      : "You haven't voted on any trials yet!"}
                  </p>
                  <button className="bg-retro-blue text-white font-pixel px-6 py-3 rounded shadow-pixel transform transition hover:scale-105 hover:bg-retro-green">
                    {t('language') === 'Langue' ? 'EXPLORER LES PROCÈS' : 'EXPLORE TRIALS'}
                  </button>
                </div>
              </PixelBorder>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
