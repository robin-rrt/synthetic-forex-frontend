import Image from 'next/image'

interface BackgroundProps {
  videoPath?: string
  imagePath?: string
  alt?: string
  className?: string
}

export default function Background({ 
  videoPath,
  imagePath, 
  alt = "Background", 
  className = "" 
}: BackgroundProps) {
  if (videoPath) {
    return (
      <div className={`absolute inset-0 z-0 ${className}`}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animationDuration: '20s' }}
        >
          <source src={videoPath} type="video/mp4" />
          <source src={videoPath.replace('.mp4', '.webm')} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
    )
  }

  if (imagePath) {
    return (
      <div className={`absolute inset-0 z-0 ${className}`}>
        <Image
          src={imagePath}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
    )
  }

  // Fallback gradient background
  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
    </div>
  )
}
