using Bookstore.API.Data;
using Bookstore.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Bookstore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookController(BookDbContext temp)
        {
            _context = temp;
        }

        // GET: api/Book/categories
        [HttpGet("categories")]
        public ActionResult<IEnumerable<string>> GetCategories()
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }

        // GET: api/book
        [HttpGet]
        public ActionResult<BooksPagedResponse> GetBooks(
            int page = 1,
            int pageSize = 5,
            bool sortByTitle = false,
            string? category = null)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(b => b.Category == category);
            }

            if (sortByTitle)
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalCount = query.Count();

            var books = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new BooksPagedResponse
            {
                Books = books,
                TotalCount = totalCount
            });
        }

        // GET: api/book/5
        [HttpGet("{id:int}")]
        public ActionResult<Book> GetBook(int id)
        {
            var book = _context.Books.Find(id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }
    }
}
