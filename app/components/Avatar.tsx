"use client"

import Image from "next/image"

type AvatarProps = {
  name: string
  imgUrl?: string
  size?: number
}

export default function Avatar({ name, imgUrl, size = 40 }: AvatarProps) {
  const initials = name
    .split(",")[0]
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (imgUrl) {
    return (
      <div
        className="relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src={imgUrl || "/placeholder.svg"}
          alt={name}
          className="object-cover"
          fill
          sizes={`${size}px`}
          quality={75}
        />
      </div>
    )
  }

  return (
    <div
      className="bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: `${Math.max(size * 0.4, 12)}px`,
      }}
    >
      {initials}
    </div>
  )
}

