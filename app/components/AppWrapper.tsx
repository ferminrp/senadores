"use client"

import type React from "react"

import Navigation from "./Navigation"

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  )
}

