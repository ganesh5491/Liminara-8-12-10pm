import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface CountUpStatProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    className?: string;
}

export function CountUpStat({
    end,
    duration = 2,
    suffix = "",
    prefix = "",
    decimals = 0,
    className = "",
}: CountUpStatProps) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (inView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [inView, hasAnimated]);

    return (
        <div ref={ref} className={className}>
            {hasAnimated ? (
                <CountUp
                    end={end}
                    duration={duration}
                    suffix={suffix}
                    prefix={prefix}
                    decimals={decimals}
                    separator=","
                />
            ) : (
                <span>0</span>
            )}
        </div>
    );
}
