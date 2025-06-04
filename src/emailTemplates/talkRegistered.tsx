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
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

interface TalkRegisteredProps {
  proposalTitle: string;
  description: string;
  email: string;
}

export const TalkRegistered = ({
  proposalTitle,
  description,
  email,
}: TalkRegisteredProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nueva propuesta de charla recibida: {proposalTitle}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container>
            <Section className="overflow-hidden rounded border border-solid border-[rgba(0,0,0,0.1)]">
              <Row>
                <Img
                  className="max-w-full"
                  width={620}
                  src={`${baseUrl}/email/cover.png`}
                />
              </Row>

              <Row className="p-[20px] pb-0">
                <Column>
                  <Heading className="text-center text-2xl font-bold" as="h1">
                    Nueva propuesta de charla recibida
                  </Heading>

                  <Section className="mt-4 rounded border border-solid border-[rgba(0,0,0,0.1)] p-4">
                    <Text className="text-lg font-bold text-gray-800">
                      Título:{' '}
                      <span className="font-normal">{proposalTitle}</span>
                    </Text>

                    <Text className="mt-2 text-lg font-bold text-gray-800">
                      Email:{' '}
                      <Link
                        href={`mailto:${email}`}
                        className="font-normal text-blue-500 underline"
                      >
                        {email}
                      </Link>
                    </Text>

                    <Text className="mt-2 text-lg font-bold text-gray-800">
                      Descripción:
                    </Text>
                    <Text className="text-base text-gray-700">
                      {description}
                    </Text>
                  </Section>

                  <Text className="mt-4 text-base text-gray-700">
                    Por favor revisa esta propuesta y contacta al presentador
                    para coordinar los próximos pasos. Puedes ver todas las
                    charlas registradas en el siguiente enlace:
                  </Text>

                  <Text className="mt-2 text-center">
                    <Link
                      href="https://airtable.com/appLVzfWuxjALkG1e/shrGuv4Ly894drDRb"
                      className="font-medium text-blue-600 underline"
                    >
                      Ver todas las charlas registradas
                    </Link>
                  </Text>

                  <Text className="mt-6 text-base text-gray-700">
                    Sistema automático de notificaciones
                    <br />
                    <strong>MedellinJS</strong> 💛
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="pt-[45px]">
              <Img
                className="max-w-full"
                width={620}
                src={`${baseUrl}/email/footer.png`}
              />
            </Section>

            <Text className="text-center text-xs text-[rgba(0,0,0,0.7)]">
              © {new Date().getFullYear()} MedellinJS. Todos los derechos
              reservados | Síguenos en{' '}
              <Link
                href="https://twitter.com/medellinjs"
                className="text-blue-500 underline"
              >
                Twitter
              </Link>{' '}
              y{' '}
              <Link
                href="https://instagram.com/medellinjs"
                className="text-blue-500 underline"
              >
                Instagram
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

TalkRegistered.PreviewProps = {
  description: 'Buena práctica de JavaScript ...',
  proposalTitle: 'Introducción a React Hooks',
  email: 'hola@medellinjs.org',
} as TalkRegisteredProps;

export default TalkRegistered;
