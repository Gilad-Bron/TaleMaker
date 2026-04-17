import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SkillCheckRollProps {
  skill: string;
  dc: number;
  dieFaces: number;
  onComplete: (result: { success: boolean; roll: number }) => void;
}

export default function SkillCheckRoll({ skill, dc, dieFaces, onComplete }: SkillCheckRollProps) {
  const [display, setDisplay] = useState(() => Math.floor(Math.random() * dieFaces) + 1);
  const [phase, setPhase] = useState<"rolling" | "settling" | "revealed">("rolling");
  const [roll, setRoll] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const actualRoll = Math.floor(Math.random() * dieFaces) + 1;
    const won = actualRoll >= dc;
    let cancelled = false;
    let tid: ReturnType<typeof setTimeout>;

    const steps = [
      ...Array(8).fill(35),
      ...Array(5).fill(70),
      ...Array(4).fill(130),
      ...Array(2).fill(220),
    ];
    let step = 0;

    const tick = () => {
      if (cancelled) return;
      if (step < steps.length) {
        setDisplay(Math.floor(Math.random() * dieFaces) + 1);
        tid = setTimeout(tick, steps[step++]);
      } else {
        setDisplay(actualRoll);
        setPhase("settling");
        tid = setTimeout(() => {
          if (!cancelled) {
            setRoll(actualRoll);
            setSuccess(won);
            setPhase("revealed");
            // Auto-dismiss failure after showing result
            if (!won) {
              tid = setTimeout(() => {
                if (!cancelled) onComplete({ success: false, roll: actualRoll });
              }, 1600);
            }
          }
        }, 300);
      }
    };
    tick();

    return () => { cancelled = true; clearTimeout(tid); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const color =
    phase === "rolling" || phase === "settling"
      ? "#c8963e"
      : success
      ? "#4a9a5a"
      : "#8a2222";

  const dieClass =
    phase === "rolling" ? "animate-die-wobble"
    : phase === "settling" ? "animate-die-settle"
    : "";

  return (
    <div className="flex items-center gap-6 px-6 py-4 animate-fade-up">
      {/* Die */}
      <div className="relative flex items-center justify-center w-[56px] h-[56px] shrink-0">
        <div
          className={`absolute inset-0 border-2 ${dieClass}`}
          style={{
            transform: "rotate(45deg)",
            borderColor: color,
            borderRadius: "3px",
            boxShadow: `0 0 ${phase === "revealed" ? "18px 4px" : "6px 1px"} ${color}${phase === "revealed" ? "55" : "22"}`,
            transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          }}
        />
        <span
          className="relative z-10 text-xl tabular-nums select-none"
          style={{
            color,
            fontFamily: "var(--font-display)",
            transition: "color 0.4s ease",
            lineHeight: 1,
          }}
        >
          {display}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <p
          className="text-xs tracking-[0.15em] uppercase text-muted-foreground/50"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {skill || "skill"} check
        </p>
        <p
          className="text-xs text-muted-foreground/35 tabular-nums"
          style={{ fontFamily: "var(--font-display)" }}
        >
          d{dieFaces} · vs DC {dc}
        </p>

        {phase === "revealed" && (
          <div className="flex items-center gap-3 mt-1 animate-fade-up">
            <span
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color, fontFamily: "var(--font-display)" }}
            >
              {success ? "Success" : "Failure"}
            </span>
            {success && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                style={{ borderRadius: "2px" }}
                onClick={() => onComplete({ success: true, roll })}
              >
                Continue →
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
