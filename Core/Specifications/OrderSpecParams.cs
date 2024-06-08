using Core.Models;

namespace Core.Specifications
{
    public class OrderSpecParams : BaseSpecification<Order>
    {
        public OrderSpecParams(): base()
        {
            this.Includes = [x => x.OrderItems, x => x.DeliveryMethod];
        }
    }
}
