import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/api/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Waves, Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainLayout } from "@/layouts/MainLayout";
import { SoundWaveAnimation } from "@/components/SoundWaveAnimation";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get("role") as "student" | "faculty" || "student";

  const [role, setRole] = useState<"student" | "faculty">(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Real API Login
    try {
      await api.auth.login(formData.email, formData.password, role);
      toast.success(`Welcome back!`);
      navigate(role === "student" ? "/student" : "/faculty");
    } catch (error: any) {
      console.error("Login failed", error);
      let msg = "Login failed. Check credentials.";
      if (error.code === 'auth/invalid-credential') msg = "Invalid Email or Password.";
      if (error.code === 'auth/user-not-found') msg = "User not found. Please Sign Up first.";
      if (error.message.includes("User profile not found")) msg = "Account outdated or invalid role. Please Create a New Account.";
      if (error.message.includes("Unauthorized")) msg = error.message;

      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="glass-card p-8 rounded-3xl">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Waves className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground">SonicAttend</span>
              </Link>

              <h2 className="text-2xl font-bold text-foreground mb-4">
                Welcome to the Future of Attendance
              </h2>
              <p className="text-muted-foreground mb-8">
                Experience seamless, fraud-proof attendance with our innovative
                sound wave technology. No proxies, no hassle.
              </p>

              <div className="flex justify-center my-8">
                <SoundWaveAnimation size="lg" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-2xl font-bold gradient-text">99.9%</p>
                  <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-2xl font-bold gradient-text">0</p>
                  <p className="text-xs text-muted-foreground">Proxy Cases</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="glass-card p-8 rounded-3xl">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Sign In</h1>
                <p className="text-muted-foreground">Access your attendance dashboard</p>
              </div>

              {/* Role Toggle */}
              <div className="flex gap-2 p-1 glass-card rounded-xl mb-8">
                <button
                  onClick={() => setRole("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${role === "student"
                    ? "bg-gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <User className="w-4 h-4" />
                  Student
                </button>
                <button
                  onClick={() => setRole("faculty")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${role === "faculty"
                    ? "bg-gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Waves className="w-4 h-4" />
                  Faculty
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      Sign In as {role === "student" ? "Student" : "Faculty"}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{" "}
                  <Link to={`/signup?role=${role}`} className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
