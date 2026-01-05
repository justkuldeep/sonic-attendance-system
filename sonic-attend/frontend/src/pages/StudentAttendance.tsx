import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import ggwave from "ggwave";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, CheckCircle2, Mic, ArrowLeft, MicOff, AlertCircle, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { SoundWaveAnimation } from "@/components/SoundWaveAnimation";
import { StatusBadge } from "@/components/StatusBadge";

export default function StudentAttendance() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'listening' | 'detected' | 'failed' | 'verifying'>('idle');
    const [detectedCode, setDetectedCode] = useState<string | null>(null);
    const [manualCode, setManualCode] = useState("");
    const [showManual, setShowManual] = useState(false);

    // ggwave RX state
    const isListening = useRef(false);
    const audioContext = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize ggwave Safely
    useEffect(() => {
        try {
            if (ggwave) ggwave.init();
        } catch (e) {
            console.error("Failed to initialize ggwave", e);
        }
        return () => {
            stopListening();
        };
    }, []);

    const startListening = async () => {
        setStatus('listening');
        try {
            if (!audioContext.current) {
                audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (audioContext.current.state === 'suspended') {
                await audioContext.current.resume();
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                }
            });
            streamRef.current = stream;

            const source = audioContext.current.createMediaStreamSource(stream);
            const scriptNode = audioContext.current.createScriptProcessor(4096, 1, 1);

            source.connect(scriptNode);
            scriptNode.connect(audioContext.current.destination);

            isListening.current = true;

            scriptNode.onaudioprocess = (e) => {
                if (!isListening.current) return;

                const inputData = e.inputBuffer.getChannelData(0);
                let res = null;
                try {
                    // Decoding expects the buffer
                    res = ggwave.decode(inputData);
                } catch (e) {
                    // Ignore decode errors
                }

                if (res) {
                    console.log("Detected Sonic Code:", res);
                    stopListening();
                    verifySonicCode(res);
                }
            };

            toast.info("Listening for audible signal...");
        } catch (e) {
            console.error("Mic Error", e);
            setStatus('failed');
            toast.error("Could not access microphone. Ensure you are on HTTPS/localhost.");
        }
    };

    const stopListening = () => {
        isListening.current = false;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContext.current) {
            audioContext.current.suspend();
        }
    };

    const verifySonicCode = async (code: string) => {
        setStatus('verifying');
        try {
            // Backend expects { sessionId, token, sonicCode }
            // We only have the code, backend should lookup active session by code
            await api.attendance.detect(undefined, undefined, code);
            setDetectedCode(code);
            setStatus('detected');
            toast.success("Attendance Verified!");
        } catch (error: any) {
            console.error("Verification error", error);
            setStatus('failed');
            toast.error(error.response?.data?.error || "Invalid Sonic Code");
        }
    };

    const handleManualSubmit = () => {
        if (manualCode.length < 5) {
            toast.error("Code too short");
            return;
        }
        verifySonicCode(manualCode.toUpperCase());
    };

    return (
        <DashboardLayout role="student" userName="Alex Johnson">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link to="/student" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 rounded-2xl text-center min-h-[500px] flex flex-col justify-center relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {status === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-8"
                            >
                                <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                    <Mic className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground mb-4">Sonic Check-In</h1>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        Listen for the audible chirps from your faculty's device to automatically mark your attendance.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 items-center">
                                    <Button variant="hero" size="xl" onClick={startListening} className="w-full max-w-sm">
                                        Start Listening
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowManual(!showManual)}
                                        className="text-muted-foreground"
                                    >
                                        <Hash className="w-4 h-4 mr-2" />
                                        {showManual ? "Hide Manual Input" : "Use Manual Code"}
                                    </Button>
                                </div>

                                {showManual && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-2 max-w-sm mx-auto"
                                    >
                                        <Input
                                            placeholder="Enter 6-char code"
                                            value={manualCode}
                                            onChange={(e) => setManualCode(e.target.value)}
                                            className="uppercase font-mono text-center"
                                        />
                                        <Button onClick={handleManualSubmit}>Verify</Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {status === 'listening' && (
                            <motion.div
                                key="listening"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                <SoundWaveAnimation size="lg" />
                                <div>
                                    <StatusBadge status="waiting" />
                                    <h2 className="text-2xl font-bold text-foreground mt-8 mb-2">Analyzing Audio...</h2>
                                    <p className="text-muted-foreground animate-pulse">
                                        Searching for sonic data packets
                                    </p>
                                </div>
                                <Button variant="outline" onClick={() => { stopListening(); setStatus('idle'); }}>
                                    Cancel
                                </Button>
                            </motion.div>
                        )}

                        {status === 'verifying' && (
                            <motion.div
                                key="verifying"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                                <h2 className="text-xl font-medium">Verifying with Server...</h2>
                            </motion.div>
                        )}

                        {status === 'detected' && (
                            <motion.div
                                key="detected"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="w-24 h-24 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-12 h-12 text-success" />
                                </div>
                                <div>
                                    <StatusBadge status="confirmed" />
                                    <h2 className="text-3xl font-bold text-foreground mt-6 mb-2">Success!</h2>
                                    <p className="text-muted-foreground">
                                        Your attendance has been confirmed for this session.
                                    </p>
                                </div>
                                <Button onClick={() => navigate('/student')} className="w-full max-w-sm" size="lg">
                                    Go to Dashboard
                                </Button>
                            </motion.div>
                        )}

                        {status === 'failed' && (
                            <motion.div
                                key="failed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                                    <AlertCircle className="w-12 h-12 text-destructive" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2">Check-In Failed</h2>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        We couldn't verify your presence. Make sure you can hear the faculty device and try again.
                                    </p>
                                </div>
                                <div className="flex gap-4 justify-center">
                                    <Button variant="hero" onClick={() => setStatus('idle')}>
                                        Try Again
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </div>
        </DashboardLayout>
    );
}
