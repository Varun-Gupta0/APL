import { motion } from "framer-motion";

interface StatBarsProps {
  stats: {
    bat: number;
    bowl: number;
    field: number;
    mental: number;
    fitness: number;
  };
}

export function StatBars({ stats }: StatBarsProps) {
  const statEntries = [
    { label: "BAT", value: stats.bat },
    { label: "BOWL", value: stats.bowl },
    { label: "FIELD", value: stats.field },
    { label: "MENTAL", value: stats.mental },
    { label: "FITNESS", value: stats.fitness },
  ];

  return (
    <div className="flex justify-between items-center w-full px-6 py-4 border-t border-white/10">
      {statEntries.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
            {stat.label}
          </span>
          <span className="text-2xl font-bold font-heading text-white tracking-tight drop-shadow-md">
            {stat.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
