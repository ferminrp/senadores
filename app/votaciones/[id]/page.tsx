"use client"

import VotacionDetalleContent from "./VotacionDetalleContent"

export default function VotacionDetalle({ params }: { params: { id: string } }) {
  return <VotacionDetalleContent id={params.id} />
}

