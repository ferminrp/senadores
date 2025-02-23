import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type VotacionFilterProps = {
  selectedResult: string
  selectedYear: string
  onResultChange: (value: string) => void
  onYearChange: (value: string) => void
  possibleResults: string[]
  possibleYears: string[]
}

export default function VotacionFilter({ 
  selectedResult, 
  selectedYear,
  onResultChange, 
  onYearChange,
  possibleResults,
  possibleYears 
}: VotacionFilterProps) {
  return (
    <div className="mb-6 flex gap-4">
      <Select value={selectedResult} onValueChange={onResultChange}>
        <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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

      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <SelectValue placeholder="Filtrar por año" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TODOS">Todos los años</SelectItem>
          {possibleYears.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 