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

        [Route("book")]
        [HttpPost]
        public async Task<IActionResult> BookEngineer()
        {
            using (var reader = new StreamReader(Request.Body))
            {
                string body = await reader.ReadToEndAsync();
                var result = JsonConvert.DeserializeObject<FormData>(body);
                System.Diagnostics.Debug.WriteLine(result.ValidateInput());
                System.Diagnostics.Debug.WriteLine(result.Registration);
                return Ok(result.Registration);
            }
        }
    }
}
