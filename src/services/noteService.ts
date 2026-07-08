import axios from "axios";
import type { Note } from "../Types/note";
interface NotesFetchResponse {
  notes: Note[];
  totalPages: number;
}
interface CreatePostBody {
  title: string;
  content: string;
  tag: string;
}
axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] =
  `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`;
export const fetchNotes = async (
  page: number,
  search: string,
): Promise<NotesFetchResponse> => {
  const response = await axios.get<NotesFetchResponse>("/notes", {
    params: {
      search,
      page,
      perPage: 12,
    },
  });
  return response.data;
};
export const createNote = async (newPost: CreatePostBody): Promise<Note> => {
  const response = await axios.post<Note>("/notes", newPost);
  return response.data;
};
export const deleteNote = async (postId: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${postId}`);
  return response.data;
};
