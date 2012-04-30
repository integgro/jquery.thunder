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
            System.Threading.Thread.Sleep(2000);
            return View("_Ajax");
        }

        public ActionResult Iframe()
        {
            System.Threading.Thread.Sleep(2000);
            return View("_Iframe");
        }

    }
}
