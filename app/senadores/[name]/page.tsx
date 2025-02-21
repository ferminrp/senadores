"use client"

import SenadorDetalleContent from "./SenadorDetalleContent"

export default function SenadorDetalle({ params }: { params: { name: string } }) {
  return <SenadorDetalleContent name={params.name} />
}

