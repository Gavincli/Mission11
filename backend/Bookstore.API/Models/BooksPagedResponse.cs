using Bookstore.API.Data;

namespace Bookstore.API.Models;

public class BooksPagedResponse
{
    public List<Book> Books { get; set; } = [];
    public int TotalCount { get; set; }
}
