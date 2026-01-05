import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import ggwave from "ggwave";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Volume2, Users, Square, Clock, Play, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { SoundWaveAnimation } from "@/components/SoundWaveAnimation";
import { CountdownTimer } from "@/components/CountdownTimer";
import { StatusBadge } from "@/components/StatusBadge";

export default function FacultySession() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useState<any>(null);
    const [studentCount, setStudentCount] = useState(0);
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const transmissionRequested = useRef(false);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Initialize ggwave safely
    useEffect(() => {
        try {
            if (ggwave) ggwave.init();
        } catch (e) {
            console.error("Failed to initialize ggwave audio library", e);
        }
    }, []);

    // Fetch Session Details on Mount
    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) return;
            try {
                const data = await api.attendance.getSession(sessionId);
                setSessionData(data);
                setIsLoading(false);
                // Automatically try to start if we can (though browser might block)
            } catch (e) {
                toast.error("Failed to recover session details");
                navigate('/faculty');
            }
        };
        fetchSession();
    }, [sessionId, navigate]);


    const startTransmission = async () => {
        if (transmissionRequested.current) return;

        // Resume or Create AudioContext
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioCtxRef.current.state === 'suspended') {
            await audioCtxRef.current.resume();
        }

        transmissionRequested.current = true;
        setIsTransmitting(true);
        toast.success("Transmission Started (Audible Mode)");
        transmitLoop(sessionData.sonicCode);
    };

    const stopTransmission = () => {
        transmissionRequested.current = false;
        setIsTransmitting(false);
        toast.info("Transmission Paused");
    };

    const transmitLoop = (code: string) => {
        if (!transmissionRequested.current) return;

        // Protocol 1: Audible Robust
        // Volume: 10-30 is usually good for audible
        let waveform = null;
        try {
            waveform = ggwave.encode(code, { protocolId: 1, volume: 30 });
        } catch (e) {
            console.error("ggwave encode failed", e);
            return;
        }

        if (waveform && audioCtxRef.current) {
            const buffer = audioCtxRef.current.createBuffer(1, waveform.length, audioCtxRef.current.sampleRate);
            buffer.getChannelData(0).set(waveform);

            const source = audioCtxRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtxRef.current.destination);
            source.start();

            source.onended = () => {
                setTimeout(() => {
                    if (transmissionRequested.current) transmitLoop(code);
                }, 3000); // 3-second gap between chirps
            };
        }
    };

    // Start Polling Stats
    useEffect(() => {
        if (sessionId) {
            pollInterval.current = setInterval(async () => {
                try {
                    const stats = await api.attendance.getStats(sessionId);
                    setStudentCount(stats.count);
                } catch (e) {
                    console.error("Polling stats failed", e);
                }
            }, 5000);
        }

        return () => {
            transmissionRequested.current = false;
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [sessionId]);

    const handleStopSession = async () => {
        try {
            await api.attendance.stopSession();
            transmissionRequested.current = false;
            toast.info("Session Stopped & Finalized");
            navigate('/faculty');
        } catch (error) {
            console.error(error);
            toast.error("Failed to stop session");
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading Session...</div>;

    return (
        <DashboardLayout role="faculty" userName="Dr. Sarah Miller">
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 rounded-2xl text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <StatusBadge status={isTransmitting ? "active" : "waiting"} />
                        <h1 className="text-3xl font-bold text-foreground">
                            {sessionData?.subject || "Live Session"}
                        </h1>
                    </div>

                    <div className={`bg-primary/5 p-8 rounded-2xl mb-8 border-2 transition-all ${isTransmitting ? 'border-primary' : 'border-transparent'}`}>
                        <div className="flex flex-col items-center">
                            {isTransmitting ? (
                                <>
                                    <SoundWaveAnimation size="lg" />
                                    <p className="text-primary font-medium mt-6 animate-pulse text-xl">
                                        Broadcasting Audible Beeps...
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Students must be within range to hear the signal.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-6"
                                        onClick={stopTransmission}
                                    >
                                        <VolumeX className="w-4 h-4 mr-2" />
                                        Pause Sound
                                    </Button>
                                </>
                            ) : (
                                <div className="py-10 space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                                        <Volume2 className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Transmission Paused</h3>
                                    <Button
                                        variant="hero"
                                        size="xl"
                                        onClick={startTransmission}
                                        className="px-12"
                                    >
                                        <Play className="w-5 h-5 mr-3" />
                                        Start Sound Transmission
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="glass-card p-6 rounded-xl">
                            <div className="flex flex-col items-center gap-2">
                                <Users className="w-8 h-8 text-primary" />
                                <span className="text-4xl font-bold gradient-text">
                                    {studentCount}
                                </span>
                                <span className="text-sm text-muted-foreground">Students Verified</span>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-xl">
                            <div className="flex flex-col items-center gap-2">
                                <Clock className="w-8 h-8 text-primary" />
                                {sessionData && (
                                    <CountdownTimer
                                        duration={Math.max(0, Math.floor((new Date(sessionData.endTime).getTime() - Date.now()) / 1000))}
                                        isActive={true}
                                    />
                                )}
                                <span className="text-sm text-muted-foreground">Time Remaining</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center flex-col items-center gap-4">
                        <Button
                            variant="destructive"
                            size="xl"
                            onClick={handleStopSession}
                            className="w-full max-w-md"
                        >
                            <Square className="w-5 h-5 mr-3" />
                            End Session & Finalize
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-8">
                        Sonic Code: <span className="font-mono font-bold text-primary">{sessionData?.sonicCode}</span>
                    </p>

                </motion.div>
            </div>
        </DashboardLayout>
    );
}
