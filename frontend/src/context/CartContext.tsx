import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';

const STORAGE_KEY = 'bookstoreSession';

export interface BrowsingSnapshot {
    page: number;
    pageSize: number;
    category: string;
    sortByTitle: boolean;
}

export interface CartLine {
    book: Book;
    quantity: number;
}

interface PersistedState {
    lines: CartLine[];
    browsingSnapshot: BrowsingSnapshot | null;
}

function loadPersisted(): PersistedState {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { lines: [], browsingSnapshot: null };
        }
        return JSON.parse(raw) as PersistedState;
    } catch {
        return { lines: [], browsingSnapshot: null };
    }
}

function savePersisted(state: PersistedState) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function lineSubtotal(line: CartLine): number {
    return line.quantity * line.book.price;
}

interface CartContextValue {
    lines: CartLine[];
    browsingSnapshot: BrowsingSnapshot | null;
    addToCart: (book: Book, snapshot: BrowsingSnapshot) => void;
    setQuantity: (bookId: number, quantity: number) => void;
    removeLine: (bookId: number) => void;
    totalItemCount: number;
    grandTotal: number;
    continueShopping: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    const [lines, setLines] = useState<CartLine[]>(() => loadPersisted().lines);
    const [browsingSnapshot, setBrowsingSnapshot] = useState<BrowsingSnapshot | null>(
        () => loadPersisted().browsingSnapshot,
    );

    useEffect(() => {
        savePersisted({ lines, browsingSnapshot });
    }, [lines, browsingSnapshot]);

    const addToCart = useCallback((book: Book, snapshot: BrowsingSnapshot) => {
        setBrowsingSnapshot(snapshot);
        setLines((prev) => {
            const idx = prev.findIndex((l) => l.book.bookID === book.bookID);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
                return next;
            }
            return [...prev, { book, quantity: 1 }];
        });
    }, []);

    const setQuantity = useCallback((bookId: number, quantity: number) => {
        const q = Math.max(0, Math.floor(quantity));
        setLines((prev) => {
            if (q <= 0) {
                return prev.filter((l) => l.book.bookID !== bookId);
            }
            return prev.map((l) =>
                l.book.bookID === bookId ? { ...l, quantity: q } : l,
            );
        });
    }, []);

    const removeLine = useCallback((bookId: number) => {
        setLines((prev) => prev.filter((l) => l.book.bookID !== bookId));
    }, []);

    const totalItemCount = useMemo(
        () => lines.reduce((sum, l) => sum + l.quantity, 0),
        [lines],
    );

    const grandTotal = useMemo(
        () => lines.reduce((sum, l) => sum + lineSubtotal(l), 0),
        [lines],
    );

    const continueShopping = useCallback(() => {
        const s = browsingSnapshot;
        if (s) {
            const p = new URLSearchParams({
                page: String(s.page),
                pageSize: String(s.pageSize),
                sortByTitle: String(s.sortByTitle),
            });
            if (s.category) {
                p.set('category', s.category);
            }
            navigate(`/?${p.toString()}`);
        } else {
            navigate('/');
        }
    }, [navigate, browsingSnapshot]);

    const value = useMemo(
        () => ({
            lines,
            browsingSnapshot,
            addToCart,
            setQuantity,
            removeLine,
            totalItemCount,
            grandTotal,
            continueShopping,
        }),
        [
            lines,
            browsingSnapshot,
            addToCart,
            setQuantity,
            removeLine,
            totalItemCount,
            grandTotal,
            continueShopping,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within CartProvider');
    }
    return ctx;
}

export { lineSubtotal };
