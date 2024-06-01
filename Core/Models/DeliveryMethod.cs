using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class DeliveryMethod : BaseEntity
    {
        public string Name { get; set; }
        public int DeliveryDays { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }

        public ICollection<Order> Orders { get; set; }
    }
}
