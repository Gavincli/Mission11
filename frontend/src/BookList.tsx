import { useEffect, useState } from "react";
import type { Book } from './types/Book'

function BookList() {

    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch("http://localhost:5248/api/Book");
            const data = await response.json();
            setBooks(data);
        };

        fetchBooks();
    }, []);

    return (
        <>
            <h1>Bookstore</h1>
            <br />
            {books.map((b) => 
            <div id="bookCard">
                <h3>{b.title}</h3>
                
                
                <ul>
                    <li>Author: {b.author}</li>
                    <li>Publisher: {b.publisher}</li>
                    <li>ISBN: {b.isbn}</li>
                    <li>Classification/Category: {b.classification} / {b.category}</li>
                    <li>Number of Pages: {b.pageCount}</li>
                    <li>Price: {b.price}</li>

                </ul>
            </div>
        
        )}
        </>
    );
}

export default BookList;