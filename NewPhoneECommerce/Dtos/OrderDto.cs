using Core.Models;

namespace API.Dtos
{
    public class OrderDto
    {
        public string BuyerEmail { get; set; }
        public string ShippingAddress { get; set; }
        public int DeliveryMethodId { get; set; }
        public double Subtotal { get; set; }
    }
}
