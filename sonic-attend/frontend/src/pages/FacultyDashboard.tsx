import { useState } from "react";
import { api } from "@/api/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Volume2, Users, Play, Calendar, BookOpen, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

// Mock data
const recentSessions = [
  { id: 1, date: "2024-01-15", subject: "Data Structures", duration: "50 min", students: 45, attendance: "93%" },
  { id: 2, date: "2024-01-14", subject: "Data Structures", duration: "50 min", students: 42, attendance: "87%" },
  { id: 3, date: "2024-01-13", subject: "Data Structures", duration: "50 min", students: 44, attendance: "91%" },
  { id: 4, date: "2024-01-12", subject: "Data Structures", duration: "50 min", students: 46, attendance: "96%" },
];

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [sessionConfig, setSessionConfig] = useState({
    subject: "Data Structures",
    duration: 10,
  });

  const handleStartSession = async () => {
    try {
      const response = await api.attendance.startSession(sessionConfig.subject, sessionConfig.duration);

      toast.success("Session Started", {
        description: `Subject: ${sessionConfig.subject}, Duration: ${sessionConfig.duration} mins`
      });

      // Navigate to the Dedicated Session Page
      navigate(`/faculty/session/${response.data.sessionId}`);

    } catch (error) {
      toast.error("Failed to start session");
      console.error(error);
    }
  };

  return (
    <DashboardLayout role="faculty" userName="Dr. Sarah Miller">
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Welcome, Dr. Miller!</h1>
              <p className="text-muted-foreground">Department of Computer Science</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Today's Date</p>
                <p className="font-semibold text-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Session Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Volume2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Attendance Session Control</h2>
            </div>

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">Subject</Label>
                  <Input
                    id="subject"
                    value={sessionConfig.subject}
                    onChange={(e) => setSessionConfig({ ...sessionConfig, subject: e.target.value })}
                    className="h-12 rounded-xl bg-background/50"
                    placeholder="Enter subject name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-foreground">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={sessionConfig.duration}
                    onChange={(e) => setSessionConfig({ ...sessionConfig, duration: parseInt(e.target.value) || 10 })}
                    className="h-12 rounded-xl bg-background/50"
                    min={5}
                    max={60}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center py-8">
                <div className="w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                  <Volume2 className="w-16 h-16 text-muted-foreground" />
                </div>
                <Button variant="hero" size="xl" onClick={handleStartSession}>
                  <Play className="w-5 h-5 mr-2" />
                  Start Attendance Session
                </Button>
                <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
                  Starting a session will open the <b>Live Transmission Dashboard</b> where you can monitor attendance in real-time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">91%</p>
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
            </div>
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-sm text-muted-foreground">Sessions This Month</p>
            </div>
            <div className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Classes Today</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Recent Sessions</h2>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Students</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">{session.date}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{session.subject}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{session.duration}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{session.students}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                        {session.attendance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
