import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useVotaciones() {
  const { data, error } = useSWR(
    "https://raw.githubusercontent.com/ferminrp/arg-senate-data/refs/heads/main/senate_voting_data_2024.json",
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

