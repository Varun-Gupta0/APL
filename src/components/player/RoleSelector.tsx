import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Batsman / Bowler</Label>
      <Select value={value} onValueChange={(val) => onChange(val || "")}>
        <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 h-11 rounded-xl shadow-sm">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-xl">
          <SelectItem value="Batsman">Batsman</SelectItem>
          <SelectItem value="Bowler">Bowler</SelectItem>
          <SelectItem value="All-Rounder">All-Rounder</SelectItem>
          <SelectItem value="Wicketkeeper">Wicketkeeper</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
