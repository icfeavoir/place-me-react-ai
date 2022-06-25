import axios from 'axios';
import { GADTO, GAResponseDTO } from '../types/types';

export const callGA = (body: GADTO): Promise<GAResponseDTO> => {
  return axios.post('http://localhost:3000/generate', body).then(({ data }) => data);
}