using System.Collections.Generic;
using System.Web.Mvc;
using Thunder;
using Thunder.Web;
using JsonResult = Thunder.Web.Mvc.JsonResult;
using Controller = Thunder.Web.Mvc.Controller;

namespace Jquery.Thunder.Controllers
{
    public class FormController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Json(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return new JsonResult
                {
                    Status = ResultStatus.Attention,
                    Messages = new List<Message> { new Message("Preencha o campo nome", "name") }
                };
            }

            return new JsonResult();
        }

        [HttpPost]
        public ActionResult Html(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return View(ResultStatus.Attention, "Preencha o campo nome.");
            }

            return new JsonResult();
        }
    }
}
