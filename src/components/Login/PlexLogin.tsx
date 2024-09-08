import globalMessages from '@app/i18n/globalMessages';
import PlexOAuth from '@app/utils/plex';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  signinwithplex: 'Sign in with Plex',
  signingin: 'Signing in…',
});

const plexOAuth = new PlexOAuth();

interface PlexLoginProps {
  onAuthenticated: () => void;
  isProcessing?: boolean;
  setProcessing?: (state: boolean) => void;
  onError?: (message: string) => void;
}

const PlexLogin: React.FC<PlexLoginProps> = ({
  onAuthenticated,
  onError,
  isProcessing,
  setProcessing,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  // Effect that is triggered when the `authToken` comes back from the Plex OAuth
  // We take the token and attempt to sign in. If we get a success message, we will
  // ask swr to revalidate the user which _should_ come back with a valid user.
  useEffect(() => {
    const login = async () => {
      setProcessing?.(true);
      try {
        const res = await fetch('/api/v1/auth/plex', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ authToken }),
        });
        if (!res.ok) throw new Error(res.statusText, { cause: res });
        const data = await res.json();

        if (data?.id) {
          onAuthenticated();
        }
      } catch (e) {
        let errorData;
        try {
          errorData = await e.cause?.text();
          errorData = JSON.parse(errorData);
        } catch {
          /* empty */
        }
        onError?.(errorData?.message || '');
        setAuthToken(undefined);
        setProcessing?.(false);
      }
    };
    if (authToken) {
      login();
    }
  }, [authToken, onAuthenticated, onError, setProcessing]);

  const getPlexLogin = async () => {
    setLoading(true);
    try {
      const authToken = await plexOAuth.login();
      setLoading(false);
      setAuthToken(authToken);
    } catch (e) {
      if (onError) onError(e.message);
      setLoading(false);
    }
  };
  return (
    <span className="block w-full rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => {
          plexOAuth.preparePopup();
          setTimeout(() => getPlexLogin(), 1500);
        }}
        disabled={loading || isProcessing}
        className="plex-button"
      >
        <ArrowLeftOnRectangleIcon />
        <span>
          {loading
            ? intl.formatMessage(globalMessages.loading)
            : isProcessing
            ? intl.formatMessage(messages.signingin)
            : intl.formatMessage(messages.signinwithplex)}
        </span>
      </button>
    </span>
  );
};

export default PlexLogin;
