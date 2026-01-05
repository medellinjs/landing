import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  Link,
} from '@react-email/components'
import * as React from 'react'

interface MedellinJSProposalEmailProps {
  fullName?: string
  proposalTitle?: string
}

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

export const TalkSubmited = ({ fullName, proposalTitle }: MedellinJSProposalEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>¡Gracias por tu propuesta para MedellinJS!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container>
            <Section className="overflow-hidden rounded border border-solid border-[rgba(0,0,0,0.1)]">
              <Row>
                <Img className="max-w-full" width={620} src={`${baseUrl}/email/cover.png`} />
              </Row>

              <Row className="p-[20px] pb-0">
                <Column>
                  <Heading className="text-center text-3xl font-bold" as="h1">
                    Hola {fullName},
                  </Heading>
                  <Text className="mt-4 text-base text-gray-700">
                    Queremos agradecerte por enviar tu propuesta <strong>{proposalTitle}</strong> a
                    la comunidad MedellinJS. Estamos emocionados de recibir tu idea y valoramos
                    mucho tu interés en compartir conocimiento con nuestra comunidad.
                  </Text>

                  <Text className="mt-4 text-base text-gray-700">
                    Nuestro equipo revisará tu propuesta y te contactaremos lo más pronto posible
                    para coordinar los detalles y agendarla en uno de nuestros próximos eventos.
                  </Text>

                  <Text className="mt-4 text-base text-gray-700">
                    Mientras tanto, te invitamos a unirte{' '}
                    <Link href="https://meetup.com/medellinjs" className="text-blue-500 underline">
                      meetup
                    </Link>{' '}
                    para estar al tanto de las novedades y conectar con otros miembros de la
                    comunidad.
                  </Text>

                  <Text className="mt-4 text-base text-gray-700">
                    Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos
                    a través de{' '}
                    <Link href="mailto:hola@medellinjs.org" className="text-blue-500 underline">
                      hola@medellinjs.org
                    </Link>
                    .
                  </Text>

                  <Text className="mt-4 text-base text-gray-700">
                    ¡Gracias por ser parte de MedellinJS y contribuir al crecimiento de la comunidad
                    tech en Medellín!
                  </Text>

                  <Text className="mt-6 text-base text-gray-700">
                    Con cariño,
                    <br />
                    El equipo de <strong>MedellinJS</strong> 💛
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="pt-[45px]">
              <Img className="max-w-full" width={620} src={`${baseUrl}/email/footer.png`} />
            </Section>

            <Text className="text-center text-xs text-[rgba(0,0,0,0.7)]">
              © {new Date().getFullYear()} MedellinJS. Todos los derechos reservados | Síguenos en{' '}
              <Link href="https://twitter.com/medellinjs" className="text-blue-500 underline">
                Twitter
              </Link>{' '}
              y{' '}
              <Link href="https://instagram.com/medellinjs" className="text-blue-500 underline">
                Instagram
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

TalkSubmited.PreviewProps = {
  fullName: 'Cristian Moreno',
  proposalTitle: 'Introducción a React Hooks',
} as MedellinJSProposalEmailProps

export default TalkSubmited
