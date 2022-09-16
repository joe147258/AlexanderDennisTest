using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AlexanderDennisTest.Controller
{
    [Route("api/status")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        [HttpGet]
        public IActionResult Status()
        {
            return Ok("App is running.");
        }
    }
}
