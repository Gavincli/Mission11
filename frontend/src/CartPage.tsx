import { Link } from 'react-router-dom';
import { FreeShippingProgress } from './components/FreeShippingProgress';
import { lineSubtotal, useCart } from './context/CartContext';

function formatMoney(n: number) {
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function CartPage() {
    const { lines, setQuantity, removeLine, grandTotal, continueShopping } = useCart();

    if (lines.length === 0) {
        return (
            <div className="container py-4">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="mb-0">Shopping cart</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <p className="text-muted">Your cart is empty.</p>
                        <Link to="/" className="btn btn-primary">
                            Browse books
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="mb-0">Shopping cart</h1>
                </div>
            </div>

            <div className="row g-4 align-items-start">
                <div className="col-12 col-lg-8">
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th className="text-end">Price</th>
                                    <th
                                        className="text-center"
                                        style={{ width: '10rem' }}
                                    >
                                        Qty
                                    </th>
                                    <th className="text-end">Subtotal</th>
                                    <th style={{ width: '5rem' }} />
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map(({ book, quantity }) => {
                                    const sub = lineSubtotal({ book, quantity });
                                    return (
                                        <tr key={book.bookID}>
                                            <td>
                                                <div className="fw-semibold">{book.title}</div>
                                                <div className="small text-muted">
                                                    {book.author}
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                {formatMoney(book.price)}
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() =>
                                                            setQuantity(
                                                                book.bookID,
                                                                quantity - 1,
                                                            )
                                                        }
                                                        aria-label="Decrease quantity"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="fw-bold">{quantity}</span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() =>
                                                            setQuantity(
                                                                book.bookID,
                                                                quantity + 1,
                                                            )
                                                        }
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-end">{formatMoney(sub)}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeLine(book.bookID)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm position-sticky z-3" style={{ top: '0.75rem' }}>
                        <div className="card-header fw-semibold">Order summary</div>
                        <div className="card-body">
                            <p className="d-flex justify-content-between mb-2">
                                <span>Items</span>
                                <span>{lines.reduce((n, l) => n + l.quantity, 0)}</span>
                            </p>
                            <p className="d-flex justify-content-between fs-5 fw-bold border-top pt-3 mb-3">
                                <span>Total</span>
                                <span>{formatMoney(grandTotal)}</span>
                            </p>
                            <FreeShippingProgress grandTotal={grandTotal} />
                            <div className="d-grid gap-2 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={continueShopping}
                                >
                                    Continue shopping
                                </button>
                                <Link to="/" className="btn btn-outline-secondary">
                                    Browse books
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
