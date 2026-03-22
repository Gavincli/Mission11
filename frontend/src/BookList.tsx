import { useEffect, useState } from 'react';
import type { Book } from './types/Book';

function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sortByTitle, setSortByTitle] = useState(false);


    useEffect(() => {
    const fetchBooks = async () => {
        const response = await fetch(
            `http://localhost:5248/api/Book?page=${page}&pageSize=${pageSize}&sortByTitle=${sortByTitle}`
        );
        const data = await response.json();
        setBooks(data);
    };

    fetchBooks();
}, [page, pageSize, sortByTitle]);

    return (
        <div className="container py-4">
        {/* Header */}
        <h1 className="text-center mb-4">📚 Bookstore</h1>

        {/* Controls Row */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            {/* Page Size */}
            <div>
            <label className="me-2 fw-bold">Books per page:</label>
            <select
                className="form-select d-inline w-auto"
                value={pageSize}
                onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
                }}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
            </select>
            </div>
        </div>

        {/*Sort by Title */}
            <button
        className="btn btn-success"
        onClick={() => {
            setSortByTitle(!sortByTitle);
            setPage(1);
        }}
        >
        {sortByTitle ? "Unsort" : "Sort by Title"}
        </button>

        {/* Book Grid */}
        <div className="row">
            {books.map((b) => (
            <div className="col-md-6 col-lg-4 mb-4" key={b.bookID}>
                <div className="card h-100 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">{b.title}</h5>

                    <p className="card-text">
                    <strong>Author:</strong> {b.author}
                    <br />
                    <strong>Publisher:</strong> {b.publisher}
                    <br />
                    <strong>ISBN:</strong> {b.isbn}
                    <br />
                    <strong>Category:</strong> {b.category}
                    <br />
                    <strong>Pages:</strong> {b.pageCount}
                    <br />
                    <strong>Price:</strong> ${b.price}
                    </p>
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
            <button
            className="btn btn-outline-primary"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            >
            ⬅ Previous
            </button>

            <span className="fw-bold">Page {page}</span>

            <button
            className="btn btn-outline-primary"
            onClick={() => setPage(page + 1)}
            disabled={books.length < pageSize}
            >
            Next ➡
            </button>
        </div>
        </div>
    );
    }

export default BookList;
