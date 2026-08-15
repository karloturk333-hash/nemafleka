import data from './recenzije.json';

export interface Recenzija {
  ime: string;
  grad: string;
  ocjena: number;
  tekst: string;
  usluga: string;
  datum: string;
}

export const RECENZIJE = data as Recenzija[];
