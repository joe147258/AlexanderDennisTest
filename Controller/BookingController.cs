using AlexanderDennisTest.Domain;
using AlexanderDennisTest.Service;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AlexanderDennisTest.Controller
{
    [Route("api")]
    public class BookingController : ControllerBase
    {
        [Route("book")]
        [HttpPost]
        public async Task<IActionResult> BookEngineer()
        {
            using (var reader = new StreamReader(Request.Body))
            {
                string body = await reader.ReadToEndAsync();
                if (body != null)
                {
                    if (BookingService.ValidateAndStore(body))
                    {
                        return Ok();
                    }
                }

                return StatusCode(500, "Failed to validate submitted data.");
            }
        }
    }
}
