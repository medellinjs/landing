import type { Speaker } from '@/payload-types'
import { SpeakerInfo } from './SpeakerInfo'

interface SpeakerListProps {
  speakers: Speaker[]
}

export function SpeakerList({ speakers }: SpeakerListProps) {
  if (speakers.length === 0) return null

  return speakers.map((speaker, index) => (
    <SpeakerInfo key={speaker.id} speaker={speaker} reverse={index % 2 !== 0} />
  ))
}
