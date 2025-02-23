import useSWR from "swr"
import { useMemo } from "react"

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

export interface Senator {
  foto: string;
  nombre: string;
  provincia: string;
  partido: string;
  email: string;
  telefono: string;
  redes: string[];
}

export function useVotaciones() {
  const { data: rawData, error } = useSWR<Votacion[]>(
    "https://api.argentinadatos.com/v1/senado/actas/",
    fetcher,
  )

  // Usar useMemo para evitar ordenamientos innecesarios
  const votaciones = useMemo(() => {
    if (!rawData) return null;

    // Filtrar votaciones sin fecha y ordenar
    const validVotaciones = rawData.filter(v => v.fecha && v.fecha.trim() !== '');
    
    const sorted = validVotaciones.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      
      // Si alguna fecha es inválida, la movemos al final
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;
      
      return dateB.getTime() - dateA.getTime();
    });

    // Log para debugging
    console.log('Primeras 5 votaciones ordenadas:', 
      sorted.slice(0, 5).map(v => ({
        fecha: v.fecha,
        titulo: v.titulo,
        dateObj: new Date(v.fecha).toISOString()
      }))
    );

    return sorted;
  }, [rawData]);

  return {
    votaciones,
    isLoading: !error && !rawData,
    isError: error,
  }
}

export function useSenatorsData() {
  const { data, error } = useSWR<Senator[]>(
    "https://api.argentinadatos.com/v1/senado/senadores/",
    fetcher,
  )
  return {
    senatorsData: data,
    isLoading: !error && !data,
    isError: error,
  }
}

