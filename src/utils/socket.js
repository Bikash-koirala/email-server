import config from "../config"

import { io } from 'socket.io-client';
import Auth from "../common/apis/Auth";

const baseURL = config.emailSubscribe;

let Socket;
const SOCKET = () => {
  const token = Auth.getLocalAccessToken();
  const configs = {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
    // auth: {
    //   token
    // },
    path: 'ws/mail-notification/'
  //   auth: async (cb) => {
  //     const token = await AsyncStorage.getItem('@token');
  //     cb({
  //       authorization: token ? `Bearer ${token}` : '',
  //     });
  //   },
  };
  return new Promise(async (resolve, reject) => {
    if (!Socket) {
      Socket = io(`ws://es-dev.braintip.ai:8000/ws/mail-notification/?token=${token}`, configs);
      Socket.on('error', function (reason) {
        console.log('error', reason);
        // Socket.socket.reconnect();
      });
      Socket.on('connect', function (socket) {
        resolve(socket);
      });

    //   Socket.on('new_email_received', () => {
    //     console.log('new_email_received');
    //     Socket.connect();
    //   });

    //   Socket.on('dispatchError', function (err) {
    //     console.log('dispatchError', err);
    //     Socket.connect();
    //   });

      Socket.onAny((event, ...args) => {
        console.log(`got ${event} with ${args}`);
      });

      Socket.connect();
    }
    resolve(Socket);
  });
};

// SOCKET().then((socket) => {
//     socket.on('connection_error', () => console.log('socket error'));
//     socket.on('connect', () => console.log('socket connected'));
//     socket.on('disconnect', (socket) =>
//       console.log('socket disconnected', socket),
//     );
//   });

export { SOCKET };



// export
// export ({ API: instance, SOCKET: socket });