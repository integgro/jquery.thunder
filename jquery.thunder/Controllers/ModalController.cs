using System.Web.Mvc;

namespace Jquery.Thunder.Controllers
{
    public class ModalController : Controller
    {

        public ActionResult Index()
        {
            return View("Index");
        }

        public ActionResult Ajax()
        {
            return View("_Ajax");
        }

        public ActionResult Iframe()
        {
            return View("_Iframe");
        }

    }
}
