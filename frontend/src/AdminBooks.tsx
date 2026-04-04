import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from './types/Book';

const API_BASE = 'http://localhost:5248';

type BookForm = Omit<Book, 'bookID'> & { bookID?: number };

const emptyForm: BookForm = {
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
};

function AdminBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addForm, setAddForm] = useState<BookForm>({ ...emptyForm });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<BookForm>({ ...emptyForm });

    const loadBooks = useCallback(async () => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/Book/all`);
            if (!response.ok) {
                throw new Error(`Failed to load books (${response.status})`);
            }
            const data = (await response.json()) as Book[];
            setBooks(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load books');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/Book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: addForm.title,
                    author: addForm.author,
                    publisher: addForm.publisher,
                    isbn: addForm.isbn,
                    classification: addForm.classification,
                    category: addForm.category,
                    pageCount: Number(addForm.pageCount),
                    price: Number(addForm.price),
                }),
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || `Add failed (${response.status})`);
            }
            setAddForm({ ...emptyForm });
            await loadBooks();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Add failed');
        }
    };

    const startEdit = (book: Book) => {
        setEditingId(book.bookID);
        setEditForm({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            isbn: book.isbn,
            classification: book.classification,
            category: book.category,
            pageCount: book.pageCount,
            price: book.price,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ ...emptyForm });
    };

    const handleUpdate = async (id: number) => {
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/Book/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookID: id,
                    title: editForm.title,
                    author: editForm.author,
                    publisher: editForm.publisher,
                    isbn: editForm.isbn,
                    classification: editForm.classification,
                    category: editForm.category,
                    pageCount: Number(editForm.pageCount),
                    price: Number(editForm.price),
                }),
            });
            if (!response.ok) {
                throw new Error(`Update failed (${response.status})`);
            }
            cancelEdit();
            await loadBooks();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Update failed');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this book?')) {
            return;
        }
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/api/Book/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Delete failed (${response.status})`);
            }
            if (editingId === id) {
                cancelEdit();
            }
            await loadBooks();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Delete failed');
        }
    };

    return (
        <div className="container py-4">
            <div className="row mb-4">
                <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h1 className="mb-0">Admin — books</h1>
                    <div className="d-flex gap-2">
                        <Link to="/" className="btn btn-outline-secondary">
                            Bookstore
                        </Link>
                        <Link to="/cart" className="btn btn-outline-primary">
                            Cart
                        </Link>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-header fw-semibold">Add book</div>
                <div className="card-body">
                    <form onSubmit={handleAdd} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Title</label>
                            <input
                                className="form-control"
                                value={addForm.title}
                                onChange={(e) =>
                                    setAddForm((f) => ({ ...f, title: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Author</label>
                            <input
                                className="form-control"
                                value={addForm.author}
                                onChange={(e) =>
                                    setAddForm((f) => ({ ...f, author: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Publisher</label>
                            <input
                                className="form-control"
                                value={addForm.publisher}
                                onChange={(e) =>
                                    setAddForm((f) => ({ ...f, publisher: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">ISBN</label>
                            <input
                                className="form-control"
                                value={addForm.isbn}
                                onChange={(e) =>
                                    setAddForm((f) => ({ ...f, isbn: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Classification</label>
                            <input
                                className="form-control"
                                value={addForm.classification}
                                onChange={(e) =>
                                    setAddForm((f) => ({
                                        ...f,
                                        classification: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Category</label>
                            <input
                                className="form-control"
                                value={addForm.category}
                                onChange={(e) =>
                                    setAddForm((f) => ({ ...f, category: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Page count</label>
                            <input
                                type="number"
                                min={1}
                                className="form-control"
                                value={addForm.pageCount || ''}
                                onChange={(e) =>
                                    setAddForm((f) => ({
                                        ...f,
                                        pageCount: Number(e.target.value),
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min={0}
                                className="form-control"
                                value={addForm.price || ''}
                                onChange={(e) =>
                                    setAddForm((f) => ({
                                        ...f,
                                        price: Number(e.target.value),
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary">
                                Add book
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header fw-semibold">All books</div>
                <div className="card-body p-0">
                    {loading ? (
                        <p className="p-3 mb-0 text-muted">Loading…</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th style={{ width: '12rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book) =>
                                        editingId === book.bookID ? (
                                            <tr key={book.bookID}>
                                                <td>{book.bookID}</td>
                                                <td colSpan={4}>
                                                    <div className="row g-2 small">
                                                        <div className="col-12">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                value={editForm.title}
                                                                onChange={(e) =>
                                                                    setEditForm((f) => ({
                                                                        ...f,
                                                                        title: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="Author"
                                                                value={editForm.author}
                                                                onChange={(e) =>
                                                                    setEditForm((f) => ({
                                                                        ...f,
                                                                        author: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="Publisher"
                                                                value={editForm.publisher}
                                                                onChange={(e) =>
                                                                    setEditForm((f) => ({
                                                                        ...f,
                                                                        publisher: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="ISBN"
                                                                value={editForm.isbn}
                                                                onChange={(e) =>
                                                                    setEditForm((f) => ({
                                                                        ...f,
                                                                        isbn: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="Classification"
                                                                value={editForm.classification}
                                                                onChange={(e) =>
                                                                    setEditForm((f) => ({
                                                                        ...f,
                                                                        classification:
                                                                            e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <input
                                                                className="form-control form-control-sm"
                                                                placeholder="Category"
                                                                value={editForm.category}
                                                                onChange={(e) =>
                                                                    setEditForm((f) => ({
                                                                        ...f,
                                                                        category: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                placeholder="Pages"
                                                                value={editForm.pageCount || ''}
                                                                onChange={(e) =>
                                                                    setEditForm((f) => ({
                                                                        ...f,
                                                                        pageCount: Number(
                                                                            e.target.value,
                                                                        ),
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className="form-control form-control-sm"
                                                                placeholder="Price"
                                                                value={editForm.price || ''}
                                                                onChange={(e) =>
                                                                    setEditForm((f) => ({
                                                                        ...f,
                                                                        price: Number(
                                                                            e.target.value,
                                                                        ),
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-success"
                                                            onClick={() =>
                                                                handleUpdate(book.bookID)
                                                            }
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={cancelEdit}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={book.bookID}>
                                                <td>{book.bookID}</td>
                                                <td>{book.title}</td>
                                                <td>{book.author}</td>
                                                <td>{book.category}</td>
                                                <td>${Number(book.price).toFixed(2)}</td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => startEdit(book)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                handleDelete(book.bookID)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminBooks;
