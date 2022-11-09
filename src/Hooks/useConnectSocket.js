import { useState, useEffect } from "react";

function useConnectSocket(io) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIO = io();
    setSocket(socketIO);
    return () => socketIO.close();
  }, [io]);

  return socket;
}

export default useConnectSocket;
