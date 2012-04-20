using System;
using System.Collections.Generic;
using System.Linq;
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
            return View("Index");
        }

        [HttpPost]
        public ActionResult Data(Models.Filter filter)
        {
            var persons = GetPersons();

            if(!filter.Orders.Count.Equals(0))
            {
                if(filter.Orders[0].Column.Equals("Name"))
                {
                    persons = persons.OrderBy(p => p.Name).ToList();
                }

                if (filter.Orders[0].Column.Equals("Id"))
                {
                    persons = persons.OrderByDescending(p => p.Id).ToList();
                }
            }

            return PartialView("_Data", new Paging<Person>(persons, filter.CurrentPage, filter.PageSize));
        }

        private static IList<Person> GetPersons()
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
