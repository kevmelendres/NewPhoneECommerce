using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class PreviousOwner : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }

        public ICollection<Product> Products { get; set; }

        public PreviousOwner(string firstName, string? lastName)
        {
            this.FirstName = firstName;
            this.LastName = lastName ?? "N/A";
            this.Address = "N/A";
            this.PhoneNumber = "N/A";

            this.Products = new List<Product>();
        }
    }
}
