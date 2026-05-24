import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PersonalitySelector({ value, onChange }: PersonalitySelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Personality</Label>
      <Select value={value} onValueChange={(val) => onChange(val || "")}>
        <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900 h-11 rounded-xl shadow-sm">
          <SelectValue placeholder="Select Personality" />
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-xl">
          <SelectItem value="Aggressive">Aggressive</SelectItem>
          <SelectItem value="Defensive">Defensive</SelectItem>
          <SelectItem value="Balanced">Balanced</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
