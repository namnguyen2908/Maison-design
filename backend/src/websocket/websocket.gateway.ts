interface SocketLike {
  handshake: { query: Record<string, string> };
  join: (room: string) => void;
}

interface ServerLike {
  to: (room: string) => { emit: (event: string, data: any) => void };
}

export class MaisonGateway {
  private server: ServerLike | null = null;

  setServer(server: ServerLike): void {
    this.server = server;
  }

  handleConnection(client: SocketLike): void {
    const projectId = client.handshake.query.projectId as string;

    if (projectId) {
      client.join(`project:${projectId}`);
    }
  }

  handleDisconnect(_client: SocketLike): void {
  }

  emitToProject(projectId: string, event: string, data: any): void {
    this.server?.to(`project:${projectId}`).emit(event, data);
  }
}
