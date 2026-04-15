import Image from 'next/image'
import type { Sponsor, Media } from '@/payload-types'

interface EventSponsorsProps {
  sponsors?: (Sponsor | number)[]
}

const TIER_ORDER: Record<string, number> = {
  platinum: 0,
  gold: 1,
  silver: 2,
  community: 3,
}

export function EventSponsors({ sponsors }: EventSponsorsProps) {
  if (!sponsors || sponsors.length === 0) return null

  // Filter populated Sponsor objects (discard bare IDs)
  const populated = sponsors.filter((s): s is Sponsor => typeof s === 'object' && s !== null)

  if (populated.length === 0) return null

  // Sort by tier hierarchy
  const sorted = [...populated].sort(
    (a, b) => (TIER_ORDER[a.tier ?? 'community'] ?? 3) - (TIER_ORDER[b.tier ?? 'community'] ?? 3),
  )

  return (
    <section className="relative py-16" id="sponsors">
      <div className="container relative">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h6 className="mb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">
            Sponsors
          </h6>
          <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
            Gracias a nuestros patrocinadores
          </h3>
          <p className="mx-auto max-w-xl text-slate-400">
            Este evento es posible gracias al apoyo de las siguientes empresas.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          {sorted.map((sponsor) => {
            const logo = sponsor.logo as Media | undefined
            const logoUrl = logo?.url

            if (!logoUrl) return null

            return (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar sitio web de ${sponsor.name}`}
                title={sponsor.name}
                className="group flex items-center justify-center px-10 py-6"
              >
                <Image
                  src={logoUrl}
                  alt={`Logo de ${sponsor.name}`}
                  width={160}
                  height={60}
                  className="max-h-14 w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
