import Image from "next/image";
import Link from "next/link";

const images = [
  {
    href: "/",
    src: "/assets/gallery/5.jpeg",
    alt: "Mixer Grinder",
  },
  {
    href: "/",
    src: "/assets/gallery/2.jpeg",
    alt: "BoAt Speaker",
  },
  {
    href: "/",
    src: "/assets/gallery/3.jpeg",
    alt: "Fashionable Watches",
  },
  {
    href: "/",
    src: "/assets/gallery/4.jpeg",
    alt: "Mixer Grinder",
  },
  // add more if you want
];

const Gallery = () => {
  return (
    <div className="w-full max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Mobile: Vertical scrolling like Shorts/Reels */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:hidden">
        <div className="flex gap-3 pb-4">
          {images.map((img, index) => (
            <Link
              key={index}
              href={img.href}
              className="flex-shrink-0 w-[41vw] snap-center" // ~85% of screen width = perfect Shorts feel
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-2xl shadow-lg bg-gray-100">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="85vw"
                  className="object-cover"
                  priority={index < 2} // load first two fast
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet & Desktop: Nice 2–4 column grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {images.map((img, index) => (
          <Link
            key={index}
            href={img.href}
            className="block overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery;