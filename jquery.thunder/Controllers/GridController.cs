using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Jquery.Thunder.Models;
using Thunder.Data;

namespace Jquery.Thunder.Controllers
{
    public class GridController : Controller
    {

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Data(Models.Filter filter)
        {
            return PartialView("_Data", new Paging<Person>(GetPersons(), filter.CurrentPage, filter.PageSize));
        }

        private static IEnumerable<Person> GetPersons()
        {
            var persons = new List<Person>();
            for (var i = 1; i <= 100; i++)
            {
                persons.Add(new Person { Id = i, Name = string.Format("Nome {0}", i), BirthDate = DateTime.Now.AddDays(i), Email = string.Format("email{0}@integgro.com.br", i) });
            }
            return persons;
        } 
    }
}
