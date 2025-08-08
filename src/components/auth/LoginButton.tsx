'use client';

import { useState, FC } from 'react';
import { signIn } from 'next-auth/react';
import { FaLinkedin } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export type LoginButtonProps = {
  title?: string;
};

export const LoginButton: FC<LoginButtonProps> = ({
  title = 'Continuar con LinkedIn',
}) => {
  const [connecting, setConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (provider: string) => {
    try {
      setConnecting(true);
      setIsLoading(true);
      await signIn(provider);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={() => handleSignIn('linkedin')}
      disabled={isLoading}
      className="me-2 mt-2 inline-flex items-center rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
    >
      {connecting ? (
        <>
          <div className="flex items-center justify-center gap-2">
            <Spinner size="small" show className="text-white" />
          </div>
        </>
      ) : (
        <>
          <FaLinkedin className="me-2 text-sm" /> {title}
        </>
      )}
    </Button>
  );
};

export default LoginButton;
