import './App.css';
import { Route, Routes } from 'react-router-dom';
import BookList from './BookList';
import CartPage from './CartPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/cart" element={<CartPage />} />
        </Routes>
    );
}

export default App;
