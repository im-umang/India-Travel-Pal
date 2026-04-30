import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { UserPlus, Eye, EyeOff, MapPin, Plane, Train, Compass, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const FLOATING_ICONS = [
  { icon: Plane, delay: 0, x: '10%', y: '15%', rotate: -15 },
  { icon: Train, delay: 0.5, x: '80%', y: '20%', rotate: 10 },
  { icon: Compass, delay: 1, x: '15%', y: '75%', rotate: 20 },
  { icon: MapPin, delay: 1.5, x: '75%', y: '70%', rotate: -10 },
];

const Register = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const regResult = await registerUser(data.name, data.email, data.password);
      if (!regResult.success) {
        setError(regResult.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }
      
      toast({
        title: t('common.register_success'),
        description: "Welcome to India Travel Pal! Your account is ready.",
      });

      setSuccess(true);
    } catch (err) {
      setError('Connection error. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex overflow-hidden relative bg-background">

      {/* Floating travel icons — identical to Login */}
      {FLOATING_ICONS.map(({ icon: Icon, delay, x, y, rotate }, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ left: x, top: y, color: 'rgba(255,160,50,0.06)' }}
          animate={{ y: [0, -20, 0], rotate: [rotate, rotate + 10, rotate] }}
          transition={{ duration: 4 + i, delay, repeat: Infinity, ease: 'easeInOut' }}>
          <Icon size={80} />
        </motion.div>
      ))}

      {/* Ambient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(28 95% 45% / 0.2), transparent 70%)', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(175 75% 35% / 0.15), transparent 70%)', filter: 'blur(80px)', animation: 'float 10s ease-in-out infinite', animationDelay: '3s' }} />

      {/* Left — Branding (same as Login) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-16 relative z-10">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
          className="text-center max-w-sm">

          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl mb-8 mx-auto flex items-center justify-center shadow-glow logo-ring"
            style={{ background: 'linear-gradient(135deg, hsl(28 95% 48%), hsl(22 90% 38%))' }}>
            <Compass className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight text-slate-900 dark:text-white">
            India Travel Pal
          </h1>
          <p className="text-lg leading-relaxed mb-10 text-slate-600 dark:text-slate-400">
            {t('dashboard.tagline')}
          </p>

          {/* Feature list */}
          {[
            { icon: '🤖', text: 'AI chat for trip planning' },
            { icon: '📍', text: '100+ verified Indian destinations' },
            { icon: '💰', text: 'Smart budget planning in INR' },
            { icon: '🗣️', text: 'Voice support in Hindi & English' },
          ].map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 text-sm mb-3.5 text-left text-slate-700 dark:text-slate-300">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                style={{ background: 'rgba(255,160,50,0.1)', border: '1px solid rgba(255,160,50,0.2)' }}>
                {f.icon}
              </span>
              {f.text}
            </motion.div>
          ))}

          {/* Stats */}
          <div className="mt-10 flex items-center gap-6 justify-center">
            {[[ '100+', t('dashboard.stats.destinations')], ['500+', t('dashboard.stats.routes')], ['EN+HI', t('dashboard.stats.languages')]].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <div className="text-xl font-extrabold bg-gradient-to-r from-orange-700 to-amber-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                  {val}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-amber-200/80 mt-0.5">
                  {lbl}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(28 95% 48%), hsl(22 90% 38%))' }}>
              <Compass className="h-5 w-5 text-white" />
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-xl">India Travel Pal</span>
          </div>

          {/* Card — same glass-panel as Login */}
          <div className="glass-panel rounded-3xl p-8">

            <AnimatePresence>
              {success && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
                  >
                    {/* Background decorative element */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
                    
                    <div className="mb-6 flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                      Registration Successful
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                      Welcome to India Travel Pal! Your account has been created successfully. Redirecting you to the dashboard...
                    </p>
                    
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-bold transition-all shadow-lg"
                    >
                      OK
                    </Button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {!success && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-1.5">{t('auth.register_title')}</h2>
                  <p className="text-sm" style={{ color: 'hsl(224 20% 50%)' }}>{t('auth.register_subtitle')}</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    {/* Error */}
                    {error && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-sm p-3.5 rounded-xl"
                        style={{ background: 'hsl(0 84% 60% / 0.12)', border: '1px solid hsl(0 84% 60% / 0.25)', color: 'hsl(0 84% 72%)' }}>
                        {error}
                      </motion.div>
                    )}

                    {/* Full Name */}
                    <FormField control={form.control} name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'hsl(224 15% 65%)' }}>{t('auth.full_name')}</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Your full name" {...field}
                              className="h-12 rounded-xl border-0 text-white text-sm font-medium placeholder:text-white/20 focus:ring-2 focus:ring-offset-0 transition-all"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" style={{ color: 'hsl(0 84% 70%)' }} />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField control={form.control} name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'hsl(224 15% 65%)' }}>{t('auth.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field}
                              className="h-12 rounded-xl border-0 text-white text-sm font-medium placeholder:text-white/20 focus:ring-2 focus:ring-offset-0 transition-all"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" style={{ color: 'hsl(0 84% 70%)' }} />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField control={form.control} name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'hsl(224 15% 65%)' }}>{t('auth.password')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" {...field}
                                className="h-12 rounded-xl border-0 text-white text-sm placeholder:text-white/20 pr-12 transition-all"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                              />
                              <button type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: 'rgba(255,255,255,0.3)' }}
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" style={{ color: 'hsl(0 84% 70%)' }} />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField control={form.control} name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold" style={{ color: 'hsl(224 15% 65%)' }}>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat your password" {...field}
                                className="h-12 rounded-xl border-0 text-white text-sm placeholder:text-white/20 pr-12 transition-all"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                              />
                              <button type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: 'rgba(255,255,255,0.3)' }}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" style={{ color: 'hsl(0 84% 70%)' }} />
                        </FormItem>
                      )}
                    />

                    {/* Submit — same saffron gradient as Login */}
                    <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} className="pt-1">
                      <Button type="submit" disabled={isLoading}
                        className="w-full h-12 rounded-xl text-white font-bold text-sm border-0 transition-all shadow-saffron"
                        style={{ background: 'linear-gradient(135deg, hsl(28 95% 50%), hsl(22 90% 40%))' }}>
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            {t('auth.signing_up')}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />{t('auth.sign_up')}
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>

                {/* Divider — same as Login */}
                <div className="divider-india my-6" />

                <p className="text-sm text-center" style={{ color: 'hsl(224 20% 45%)' }}>
                  {t('auth.have_account')}{' '}
                  <Link to="/login" className="font-bold transition-colors" style={{ color: 'hsl(28 95% 62%)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'hsl(42 95% 70%)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'hsl(28 95% 62%)')}>
                    {t('auth.login_now')} →
                  </Link>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
