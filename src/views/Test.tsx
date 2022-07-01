import { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';

type Props = {
  test: string;
}

export const TestComponent = ({ test }: Props) => {

  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = socketIOClient('http://localhost:3000');
    socket.on('connection', () => { console.log('ok connected') });
    socket.on('test', (data: string) => {
      console.log('received', data);
    });

    setTimeout(() => {
      socket.emit('test', {});
    }, 1000);
  }, []);

  return (
    <div className="tools-list">
      {test}
    </div>
  );
}