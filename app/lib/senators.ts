export async function getSenatorsData() {
  const res = await fetch("https://raw.githubusercontent.com/ferminrp/arg-senate-data/refs/heads/main/senators.json")
  const data = await res.json()
  return data.reduce((acc: { [key: string]: string }, senator: { name: string; img: string }) => {
    acc[senator.name] = senator.img
    return acc
  }, {})
}

