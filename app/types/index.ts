export type Senator = {
  name: string
  totalVotes: number
  affirmativeVotes: number
  negativeVotes: number
  img?: string
  party?: string
  wikipedia_url?: string
  province?: string
  email?: string
  telefono?: string
  twitter?: string
  instagram?: string
  periodoReal?: {
    inicio: string
    fin: string
  }
}

export interface Votacion {
  act_id: string
  motion_number: string
  date: string
  affirmative: number
  negative: number
  abstentions: number
  votes: {
    name: string
    vote: string
  }[]
}
