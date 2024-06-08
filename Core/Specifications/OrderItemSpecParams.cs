using Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class OrderItemSpecParams : BaseSpecification<OrderItem>
    {
        public OrderItemSpecParams() : base()
        {
            this.Includes = [x => x.Product, x => x.Product.Seller, x => x.Product.PreviousOwner];
        }
    }
}
