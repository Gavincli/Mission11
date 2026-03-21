using Bookstore.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bookstore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _context;
        public BookController(BookDbContext temp) => _context = temp;

        public IEnumerable<Book> GetBooks()
        {
            var something = _context.Books.ToList();
            return something;
        }
    }
}
