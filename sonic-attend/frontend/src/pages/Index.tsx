import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Volume2, Clock, Lock, ArrowRight, CheckCircle2, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { SoundWaveAnimation } from "@/components/SoundWaveAnimation";
import { MainLayout } from "@/layouts/MainLayout";

const features = [
  {
    icon: Shield,
    title: "No IMEI / No Biometrics",
    description: "Privacy-first approach that doesn't require device fingerprinting or biometric data collection.",
  },
  {
    icon: Volume2,
    title: "Sound Wave Verification",
    description: "Unique inaudible sound signatures ensure physical presence in the classroom.",
  },
  {
    icon: Clock,
    title: "Time-Bound Attendance",
    description: "Configurable session windows prevent late marking and ensure punctuality.",
  },
  {
    icon: Lock,
    title: "Privacy Friendly",
    description: "No location tracking, no personal data harvesting. Just smart sound technology.",
  },
];

const benefits = [
  "Eliminates proxy attendance completely",
  "Works offline after initial sync",
  "No special hardware required",
  "Real-time attendance dashboard",
  "Detailed analytics and reports",
  "Easy integration with existing systems",
];

export default function Index() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-muted-foreground">
                <Waves className="w-4 h-4 text-primary" />
                Next-gen Attendance System
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">Proxy-Free Attendance</span>
              <br />
              <span className="gradient-text">Using Smart Sound Technology</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Revolutionary attendance system that uses inaudible sound waves to verify physical presence. 
              No biometrics, no GPS tracking, just smart technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/login?role=student">
                  Student Login
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/login?role=faculty">Faculty Login</Link>
              </Button>
            </motion.div>
          </div>

          {/* Sound Wave Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex justify-center"
          >
            <div className="glass-card p-8 rounded-3xl">
              <SoundWaveAnimation size="lg" />
              <p className="text-center text-sm text-muted-foreground mt-4">
                Live Sound Wave Detection
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose SonicAttend?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with privacy and security at its core. Our sound-based verification 
              ensures authentic attendance without compromising personal data.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                How Sound Wave Attendance Works
              </h2>
              <p className="text-muted-foreground mb-8">
                Our proprietary technology uses ultrasonic sound waves that are inaudible to 
                humans but can be detected by smartphone microphones. When a faculty member 
                starts a session, their device emits a unique sound signature that students' 
                devices can verify.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card p-8 rounded-3xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Faculty Starts Session</h4>
                      <p className="text-sm text-muted-foreground">Configures subject and duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Sound Wave Broadcast</h4>
                      <p className="text-sm text-muted-foreground">Unique signature emitted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Student Detection</h4>
                      <p className="text-sm text-muted-foreground">App listens for 10 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-primary-foreground font-semibold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Attendance Confirmed</h4>
                      <p className="text-sm text-muted-foreground">Verified and recorded securely</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-5" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Attendance System?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join hundreds of institutions already using SonicAttend for 
                accurate, fraud-proof attendance management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to="/login?role=faculty">Faculty Demo</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Waves className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">SonicAttend</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SonicAttend. All rights reserved.
          </p>
        </div>
      </footer>
    </MainLayout>
  );
}
