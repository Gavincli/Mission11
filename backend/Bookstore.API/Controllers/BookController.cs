using Bookstore.API.Data;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

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

        // GET: api/book
        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetBooks(int page = 1, int pageSize = 5, bool sortByTitle = false)
        {
            var query = _context.Books.AsQueryable();

            // Optional sorting
            if (sortByTitle)
            {
                query = query.OrderBy(b => b.Title);
            }

            // Pagination
            var books = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(books);
        }

        // GET: api/book/5
        [HttpGet("{id}")]
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