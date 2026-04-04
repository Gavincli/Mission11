import './App.css';
import { Route, Routes } from 'react-router-dom';
import AdminBooks from './AdminBooks';
import BookList from './BookList';
import CartPage from './CartPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
    );
}

export default App;
