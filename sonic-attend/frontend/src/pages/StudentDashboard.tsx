import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Volume2, CheckCircle2, Clock, Calendar, BookOpen, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";

// Mock attendance history
const attendanceHistory = [
  { id: 1, date: "2024-01-15", subject: "Data Structures", status: "confirmed" as const, time: "09:00 AM" },
  { id: 2, date: "2024-01-15", subject: "Algorithms", status: "confirmed" as const, time: "11:00 AM" },
  { id: 3, date: "2024-01-14", subject: "Database Systems", status: "confirmed" as const, time: "10:00 AM" },
  { id: 4, date: "2024-01-14", subject: "Operating Systems", status: "invalid" as const, time: "02:00 PM" },
  { id: 5, date: "2024-01-13", subject: "Computer Networks", status: "confirmed" as const, time: "09:00 AM" },
];

export default function StudentDashboard() {
  const [sessionStatus, setSessionStatus] = useState("idle");

  return (
    <DashboardLayout role="student" userName="Alex Johnson">
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back, Alex!</h1>
              <p className="text-muted-foreground">Student ID: STU2024001 • Computer Science</p>
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
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Attendance Session Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <Volume2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Mark Attendance</h2>
            </div>

            <div className="text-center py-6">
              <div className="space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                  <Mic className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Ready to Check-In?</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    Click below to open the Sonic Listener. Make sure you are in the classroom.
                  </p>
                </div>
                <div className="max-w-xs mx-auto mb-4">
                  <Link to="/student/attendance">
                    <Button variant="hero" size="lg" className="w-full">
                      Open Attendance Scanner
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">92%</p>
                <p className="text-sm text-muted-foreground">Overall Attendance</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">45</p>
                <p className="text-sm text-muted-foreground">Classes This Month</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">6</p>
                <p className="text-sm text-muted-foreground">Active Subjects</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Missed Classes</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Attendance History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Attendance History</h2>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record) => (
                  <tr key={record.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">{record.date}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{record.subject}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{record.time}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={record.status} />
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
