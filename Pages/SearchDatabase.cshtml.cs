using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace AlexanderDennisTest.Pages
{
    public class SearchDatabaseModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public SearchDatabaseModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }
    }
}