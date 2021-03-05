import io from 'socket.io-client';

const socket = () => {
  return io('http://10.0.0.103:8000');
};

export default socket;
