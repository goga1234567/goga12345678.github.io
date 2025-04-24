import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useRouter } from "wouter";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Registration schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [location, navigate] = useLocation();
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have been logged in",
        });
        navigate("/");
      },
    });
  };

  // Handle registration submission
  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...registrationData } = values;
    registerMutation.mutate(registrationData, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Your account has been created",
        });
        navigate("/");
      },
    });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-retro-dark flex flex-col">
      <div className="flex flex-grow flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <h1 className="text-3xl font-pixel text-retro-yellow mb-8 text-center">
              {isLogin ? t('welcomeBack') : t('joinUs')}
            </h1>

            {isLogin ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-pixel text-retro-light">{t('username')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-retro-dark border-retro-purple text-retro-light font-retro"
                          />
                        </FormControl>
                        <FormMessage className="text-retro-orange" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-pixel text-retro-light">{t('password')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="bg-retro-dark border-retro-purple text-retro-light font-retro"
                          />
                        </FormControl>
                        <FormMessage className="text-retro-orange" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-retro-green hover:bg-retro-blue text-black font-pixel"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Loading..." : t('loginAction')}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-pixel text-retro-light">{t('username')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-retro-dark border-retro-purple text-retro-light font-retro"
                          />
                        </FormControl>
                        <FormMessage className="text-retro-orange" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-pixel text-retro-light">{t('password')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="bg-retro-dark border-retro-purple text-retro-light font-retro"
                          />
                        </FormControl>
                        <FormMessage className="text-retro-orange" />
                        <p className="text-xs text-retro-light opacity-70 mt-1 font-retro">
                          {t('passwordRequirements')}
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-pixel text-retro-light">{t('confirmPassword')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="bg-retro-dark border-retro-purple text-retro-light font-retro"
                          />
                        </FormControl>
                        <FormMessage className="text-retro-orange" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-retro-pink hover:bg-retro-purple text-white font-pixel"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Loading..." : t('signupAction')}
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-retro-blue hover:text-retro-yellow font-retro transition-colors"
              >
                {isLogin ? t('noAccount') : t('haveAccount')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 bg-retro-purple p-10 flex items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-pixel text-retro-yellow mb-6">{t('appName')}</h2>
            <p className="text-xl font-retro text-retro-light mb-8">
              {t('description')}
            </p>
            <div className="font-mono text-retro-light text-opacity-80 text-sm">
              <p className="mb-2">* {t('disclaimer')}</p>
              <p>* {language === 'en' ? "Defend characters in French too!" : "Défendez des personnages en anglais aussi!"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}