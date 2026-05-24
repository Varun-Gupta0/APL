"use client";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="font-heading text-2xl tracking-wider text-white uppercase">
          {title}
          <span className="ml-2 inline-block h-[3px] w-8 bg-[#D4A94D] align-middle" />
        </h2>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
