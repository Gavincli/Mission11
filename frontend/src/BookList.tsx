import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FreeShippingProgress } from './components/FreeShippingProgress';
import { lineSubtotal, useCart } from './context/CartContext';
import type { Book } from './types/Book';
import type { BooksPagedResponse } from './types/BooksPagedResponse';

const API_BASE = 'http://localhost:5248';

function formatMoney(n: number) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function parseListFromSearch(searchParams: URLSearchParams) {
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSizeRaw = Number(searchParams.get('pageSize'));
    const pageSize = [5, 10, 20].includes(pageSizeRaw) ? pageSizeRaw : 5;
    const sortByTitle = searchParams.get('sortByTitle') === 'true';
    const category = searchParams.get('category') ?? '';
    return { page, pageSize, sortByTitle, category };
}

function BookList() {
    const [searchParams] = useSearchParams();
    const fromUrl = parseListFromSearch(searchParams);

    const { addToCart, lines, totalItemCount, grandTotal } = useCart();

    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(fromUrl.page);
    const [pageSize, setPageSize] = useState(fromUrl.pageSize);
    const [sortByTitle, setSortByTitle] = useState(fromUrl.sortByTitle);
    const [category, setCategory] = useState(fromUrl.category);
    const [categories, setCategories] = useState<string[]>([]);

    const searchKey = searchParams.toString();

    useEffect(() => {
        const next = parseListFromSearch(searchParams);
        setPage(next.page);
        setPageSize(next.pageSize);
        setSortByTitle(next.sortByTitle);
        setCategory(next.category);
    }, [searchKey, searchParams]);

    useEffect(() => {
        const loadCategories = async () => {
            const response = await fetch(`${API_BASE}/api/Book/categories`);
            const data = (await response.json()) as string[];
            setCategories(data);
        };

        loadCategories();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(pageSize),
                sortByTitle: String(sortByTitle),
            });
            if (category) {
                params.set('category', category);
            }

            const response = await fetch(`${API_BASE}/api/Book?${params.toString()}`);
            const data = (await response.json()) as BooksPagedResponse;
            setBooks(data.books);
            setTotalCount(data.totalCount);
        };

        fetchBooks();
    }, [page, pageSize, sortByTitle, category]);

    const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
    const canGoNext = totalPages > 0 && page < totalPages;

    const browsingSnapshot = {
        page,
        pageSize,
        category,
        sortByTitle,
    };

    return (
        <div className="container py-4">
            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h1 className="mb-0">📚 Bookstore</h1>
                    <div className="d-flex flex-wrap gap-2">
                        <Link to="/adminbooks" className="btn btn-outline-secondary">
                            Admin books
                        </Link>
                        <Link to="/cart" className="btn btn-outline-primary">
                            View cart
                        </Link>
                    </div>
                </div>
            </div>

            <div className="row g-4 align-items-start">
                <div className="col-12 col-lg-3 order-2 order-lg-1">
                    <div
                        className="position-sticky z-3 py-1"
                        style={{ top: '0.75rem' }}
                    >
                        <div className="vstack gap-4">
                            <div>
                                <h2 className="h6 text-uppercase text-muted mb-3">Browse</h2>
                                <div className="vstack gap-3">
                                    <div>
                                        <label className="form-label fw-bold mb-1 small">
                                            Books per page
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
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
                                    <div>
                                        <label className="form-label fw-bold mb-1 small">
                                            Category
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={category}
                                            onChange={(e) => {
                                                setCategory(e.target.value);
                                                setPage(1);
                                            }}
                                        >
                                            <option value="">All</option>
                                            {categories.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-success btn-sm"
                                        onClick={() => {
                                            setSortByTitle(!sortByTitle);
                                            setPage(1);
                                        }}
                                    >
                                        {sortByTitle ? 'Unsort' : 'Sort by title'}
                                    </button>
                                </div>
                            </div>

                            <div className="card shadow-sm">
                                <div className="card-header fw-semibold">Your cart</div>
                                <ul className="list-group list-group-flush">
                                    {lines.length === 0 ? (
                                        <li className="list-group-item text-muted small">
                                            Cart is empty
                                        </li>
                                    ) : (
                                        lines.map(({ book, quantity }) => (
                                            <li
                                                className="list-group-item px-3 py-2"
                                                key={book.bookID}
                                            >
                                                <div className="d-flex justify-content-between align-items-start gap-2">
                                                    <div className="min-w-0 flex-grow-1">
                                                        <div
                                                            className="fw-semibold text-truncate small"
                                                            title={book.title}
                                                        >
                                                            {book.title}
                                                        </div>
                                                        <small className="text-muted">
                                                            {quantity} × {formatMoney(book.price)}
                                                        </small>
                                                    </div>
                                                    <span className="text-nowrap small">
                                                        {formatMoney(
                                                            lineSubtotal({ book, quantity }),
                                                        )}
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                    <li className="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2">
                                        <div>
                                            <strong>Total</strong>
                                            <div className="small text-muted">
                                                {totalItemCount}{' '}
                                                {totalItemCount === 1 ? 'item' : 'items'}
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-semibold">
                                                {formatMoney(grandTotal)}
                                            </span>
                                            <Link to="/cart" className="btn btn-sm btn-primary">
                                                Go to cart
                                            </Link>
                                        </div>
                                    </li>
                                </ul>
                                <div className="card-body pt-0">
                                    <FreeShippingProgress grandTotal={grandTotal} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-9 order-1 order-lg-2">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                        {books.map((b) => (
                            <div className="col" key={b.bookID}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{b.title}</h5>

                                        <p className="card-text flex-grow-1 small">
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
                                            <strong>Price:</strong> {formatMoney(b.price)}
                                        </p>
                                        <button
                                            type="button"
                                            className="btn btn-primary mt-auto"
                                            onClick={() => addToCart(b, browsingSnapshot)}
                                        >
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row mt-4">
                        <div className="col-12 d-flex justify-content-center align-items-center flex-wrap gap-3">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                            >
                                ⬅ Previous
                            </button>

                            <span className="fw-bold">
                                {totalPages > 0 ? (
                                    <>
                                        Page {page} of {totalPages}
                                    </>
                                ) : (
                                    <>Page {page}</>
                                )}
                            </span>

                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => setPage(page + 1)}
                                disabled={!canGoNext}
                            >
                                Next ➡
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookList;
