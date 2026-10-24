export interface ComentarioAutor {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Comentario {
  _id: string;
  text: string;
  createdAt: string;
  author: ComentarioAutor;
  puedeEliminar: boolean;
}
