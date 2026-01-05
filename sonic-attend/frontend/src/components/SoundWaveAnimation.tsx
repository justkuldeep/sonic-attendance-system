import { motion } from "framer-motion";

interface SoundWaveAnimationProps {
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SoundWaveAnimation({ 
  isActive = true, 
  size = "md",
  className = ""
}: SoundWaveAnimationProps) {
  const bars = 5;
  const sizeClasses = {
    sm: "h-8 gap-1",
    md: "h-16 gap-1.5",
    lg: "h-24 gap-2",
  };
  
  const barWidths = {
    sm: "w-1",
    md: "w-1.5",
    lg: "w-2",
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`${barWidths[size]} rounded-full bg-gradient-to-t from-primary via-accent to-cyan`}
          initial={{ scaleY: 0.3 }}
          animate={isActive ? {
            scaleY: [0.3, 1, 0.5, 0.8, 0.3],
          } : { scaleY: 0.3 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          style={{ 
            height: "100%",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}
