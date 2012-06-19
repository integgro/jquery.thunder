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
            //System.Threading.Thread.Sleep(10000);
            return View("_Iframe");
        }

    }
}
