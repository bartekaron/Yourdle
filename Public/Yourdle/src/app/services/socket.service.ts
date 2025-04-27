import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  emit(event: string, data?: any, callback?: Function) {
    if (!this.socket.connected) {
      console.warn(`Socket not connected while trying to emit ${event}. Attempting reconnection...`);
      this.connect();
    }
    
    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  off(event: string) {
    this.socket.off(event);
  }

  disconnect() {
    this.socket.disconnect();
  }

  get connected(): boolean {
    return this.socket.connected;
  }
  
  // Add these new methods
  
  isConnected(): boolean {
    return this.socket.connected;
  }
  
  connect() {
    if (!this.socket.connected) {
      // Close existing socket if needed
      if (this.socket) {
        this.socket.close();
      }
      // Create a new socket connection
      this.socket = io('http://localhost:3000');
    }
    return this.socket;
  }
  
  // Make the socket accessible when needed
  get socketInstance(): Socket {
    return this.socket;
  }

  // Add a new method for one-time listeners
  once(event: string, callback: (...args: any[]) => void) {
    this.socket.once(event, callback);
  }
}
