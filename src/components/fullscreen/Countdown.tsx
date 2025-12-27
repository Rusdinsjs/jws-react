interface CountdownProps {
    minutes: number;
    seconds: number;
    label?: string;
}

function Countdown({ minutes, seconds, label }: CountdownProps) {
    const formatTime = (val: number) => val.toString().padStart(2, "0");

    return (
        <div className="flex flex-col items-center justify-center">
            {label && <p className="text-2xl text-amber-500 mb-2 uppercase tracking-widest font-semibold">{label}</p>}
            <div className="text-[12rem] font-bold leading-none tabular-nums tracking-tighter drop-shadow-2xl text-white"
                style={{ fontFamily: 'var(--font-family-numeric)' }}>
                {formatTime(minutes)}:{formatTime(seconds)}
            </div>
        </div>
    );
}

export default Countdown;
