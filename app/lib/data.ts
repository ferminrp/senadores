import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface Voto {
  nombre: string;
  voto: string;
  banca: string;
}

export interface Votacion {
  actaId: number;
  titulo: string;
  proyecto: string;
  descripcion: string;
  quorumTipo: string;
  fecha: string;
  acta: string;
  mayoria: string;
  miembros: number;
  afirmativos: number;
  negativos: number;
  abstenciones: number;
  presentes: number;
  ausentes: number;
  amn: number;
  resultado: string;
  votos: Voto[];
  observaciones: string[];
}

export function useVotaciones() {
  const { data, error } = useSWR<Votacion[]>(
    "https://api.argentinadatos.com/v1/senado/actas/",
    fetcher,
  )
  return {
    votaciones: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useSenatorsData() {
  const { data, error } = useSWR(
    "https://raw.githubusercontent.com/ferminrp/arg-senate-data/refs/heads/main/senators.json",
    fetcher,
  )
  return {
    senatorsData: data, // Return the data as-is, without transforming it
    isLoading: !error && !data,
    isError: error,
  }
}

