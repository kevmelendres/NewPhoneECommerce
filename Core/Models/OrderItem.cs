using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class OrderItem : BaseEntity
    {
        public int ProductItemId { get; set; }
        public string ProductName { get; set; }
        public string ProductURL { get; set; }
        public double ProductPrice { get; set; }
        public int Quantity { get; set; }


        public int OrderId { get; set; }
        public Order Order { get; set; }
    }
}
