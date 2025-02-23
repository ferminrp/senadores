import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type VotacionFilterProps = {
  selectedResult: string
  onResultChange: (value: string) => void
  possibleResults: string[]
}

export default function VotacionFilter({ selectedResult, onResultChange, possibleResults }: VotacionFilterProps) {
  return (
    <div className="mb-6">
      <Select value={selectedResult} onValueChange={onResultChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por resultado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos los resultados</SelectItem>
          {possibleResults.map((result) => (
            <SelectItem key={result} value={result}>
              {result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 