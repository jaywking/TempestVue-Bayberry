import { useEffect, useRef } from 'react';

interface WebSocketData {
  type: string;
  obs?: number[][];
}

export function useWeatherSocket(onData: (data: WebSocketData) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const connect = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return; // Already connected
      }

      try {
        wsRef.current = new WebSocket(
          `wss://ws.weatherflow.com/swd/data?token=${process.env.NEXT_PUBLIC_TEMPEST_TOKEN}`
        );

        wsRef.current.onopen = () => {
          console.log('WebSocket Connected');
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: "listen_start",
              device_id: process.env.NEXT_PUBLIC_DEVICE_ID,
              id: "1"
            }));
          }
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'obs_st') {
              const now = Date.now();
              // Only update if it's been more than a minute since last update
              if (now - lastUpdateRef.current >= 60000) {
                onData(data);
                lastUpdateRef.current = now;
              }
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          // Clear any existing reconnection timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          wsRef.current?.close();
        };

      } catch (error) {
        console.error('WebSocket connection error:', error);
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [onData]);
} 