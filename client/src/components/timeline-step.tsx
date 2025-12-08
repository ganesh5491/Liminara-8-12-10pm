import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineStepProps {
    icon: LucideIcon;
    label: string;
    index: number;
    isLast?: boolean;
}

export function TimelineStep({ icon: Icon, label, index, isLast = false }: TimelineStepProps) {
    return (
        <motion.div
            className="flex flex-col items-center text-center relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {!isLast && (
                <div className="absolute top-10 left-1/2 w-full h-1 bg-[#F5D7B0]/30 hidden md:block" />
            )}

            <motion.div
                className="w-20 h-20 bg-gradient-to-br from-[#F5D7B0] to-[#E3C7A0] rounded-full flex items-center justify-center mb-4 relative z-10 shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Icon className="h-10 w-10 text-[#4B3A2F]" />
            </motion.div>

            <p className="font-medium text-white">{label}</p>
        </motion.div>
    );
}
