import type { Book } from './Book';

export interface BooksPagedResponse {
    books: Book[];
    totalCount: number;
}
