using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using AlexanderDennisTest.Domain;

namespace AlexanderDennisTest.Controller
{
    [Route("api")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        [Route("status")]
        [HttpGet]
        public IActionResult Status()
        {
            return Ok("App is running.");
        }
    }
}
