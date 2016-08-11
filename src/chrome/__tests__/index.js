/*
 eslint-disable prefer-arrow-callback,
 func-names,
 space-before-function-paren,
 no-unused-expressions
*/
import { startChromePlugin } from '..';
import { mockChrome } from '../__mocks__/chrome';
import { mockSocket } from '../../socket/__mocks__';
import { expect } from 'chai';

describe('startChromePlugin', function() {
  it('listens for authentication', function() {
    const chrome = mockChrome();
    startChromePlugin(null, chrome, undefined, mockSocket());
    expect(chrome.getNumMessageListeners());
  });

  describe('when the user is unauthenticated', function() {
    it('marks the socket as unauthenticated', function() {
      const chrome = mockChrome();
      const plugin = startChromePlugin(null, chrome, undefined, mockSocket());
      const store = plugin.getStore();
      expect(store.getState().socket.get('state')).to.equal('unauthenticated');
    });
  });

  describe('when the user is already authenticated', function() {
    it('authenticates and connects', function() {
      const auth = {
        workerUUID: 'abc123',
        socketAuth: {
          auth: 'SEKRET',
          sig: 'SIG',
        },
      };
      const chrome = mockChrome({ storage: { websocket_auth: auth } });
      const socketConstructor = mockSocket({ joinReply: 'ok' });

      const plugin = startChromePlugin(auth, chrome, undefined, socketConstructor);
      const store = plugin.getStore();

      expect(store.getState().socket.get('state')).to.equal('connected');
    });
  });
});