namespace Jquery.Thunder.Models
{
    public class Order
    {
        public Order()
        {
            Asc = true;
        }
        public string Column { get; set; }
        public bool Asc { get; set; }
    }
}