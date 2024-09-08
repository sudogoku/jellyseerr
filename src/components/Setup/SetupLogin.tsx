import Button from '@app/components/Common/Button';
import JellyfinLogin from '@app/components/Login/JellyfinLogin';
import PlexLogin from '@app/components/Login/PlexLogin';
import defineMessages from '@app/utils/defineMessages';
import { MediaServerType } from '@server/constants/server';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const messages = defineMessages('components.Setup', {
  welcome: 'Welcome to Jellyseerr',
  signinMessage: 'Get started by signing in',
  signin: 'Sign in to your account',
  signinWithJellyfin: 'Enter your Jellyfin details',
  signinWithEmby: 'Enter your Emby details',
  signinWithPlex: 'Enter your Plex details',
  back: 'Go back',
});

interface LoginWithMediaServerProps {
  serverType: MediaServerType;
  onCancel: () => void;
  onAuthenticated: () => void;
}

const SetupLogin: React.FC<LoginWithMediaServerProps> = ({
  serverType,
  onCancel,
  onAuthenticated,
}) => {
  return (
    <div className="p-4">
      <div className="mb-2 flex justify-center text-xl font-bold">
        <FormattedMessage {...messages.signin} />
      </div>
      <div className="mb-2 flex justify-center pb-6 text-sm">
        {serverType === MediaServerType.JELLYFIN ? (
          <FormattedMessage {...messages.signinWithJellyfin} />
        ) : serverType === MediaServerType.EMBY ? (
          <FormattedMessage {...messages.signinWithEmby} />
        ) : (
          <FormattedMessage {...messages.signinWithPlex} />
        )}
      </div>
      {serverType === MediaServerType.PLEX && (
        <>
          <div
            className="px-10 py-8"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            <PlexLogin onAuthenticated={onAuthenticated} />
          </div>
          <div className="mt-4">
            <Button buttonType="default" onClick={() => onCancel()}>
              <FormattedMessage {...messages.back} />
            </Button>
          </div>
        </>
      )}
      {[MediaServerType.JELLYFIN, MediaServerType.EMBY].includes(
        serverType
      ) && (
        <JellyfinLogin
          initial={true}
          serverType={serverType}
          onCancel={onCancel}
          onAuthenticated={onAuthenticated}
        />
      )}
    </div>
  );
};

export default SetupLogin;
