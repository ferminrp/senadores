import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type VotacionFilterProps = {
  selectedResult: string
  onResultChange: (value: string) => void
}

export default function VotacionFilter({ selectedResult, onResultChange }: VotacionFilterProps) {
  return (
    <div className="mb-6">
      <Select value={selectedResult} onValueChange={onResultChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por resultado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos los resultados</SelectItem>
          <SelectItem value="AFIRMATIVA">Afirmativa</SelectItem>
          <SelectItem value="NEGATIVA">Negativa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 