using Core.Models.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Order : BaseEntity
    {
        public string BuyerEmail { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressRegion { get; set; }
        public string? AddressProvince { get; set; }
        public string? AddressMunicipality { get; set; }
        public string? AddressBarangay { get; set; }
        public int? AddressZipCode { get; set; }
        public string? AddressStreet { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;

        public double SubTotal { get; set; }
        public OrderStatusEnum OrderStatus { get; set; } = OrderStatusEnum.OrderPlaced;

        public int DeliveryMethodId { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }

        
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
