using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Seller : BaseEntity
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }

        public ICollection<Product> Products { get; set; }


        public Seller(string name)
        {
            this.Name = name;
            this.Phone = "N/A";
            this.Email = "N/A";
            this.Address = "N/A";

            this.Products = new List<Product>();
        }
    }
}
