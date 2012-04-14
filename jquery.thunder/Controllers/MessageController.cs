using System.Web.Mvc;

namespace Jquery.Thunder.Controllers
{
    public class MessageController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View("Index");
        }
    }
}
