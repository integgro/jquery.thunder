using System.Collections.Generic;

namespace Jquery.Thunder.Models
{
    public class Filter
    {
        public Filter()
        {
            Orders = new List<Order>();
        }
        public IList<Order> Orders { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
    }
}