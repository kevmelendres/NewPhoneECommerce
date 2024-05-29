using Core.Models.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Order : BaseEntity
    {
        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public string ShippingAddress { get; set; }
        public double SubTotal { get; set; }
        public OrderStatusEnum OrderStatus { get; set; }

        public int DeliveryMethodId { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }


        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
