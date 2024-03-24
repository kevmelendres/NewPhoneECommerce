using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Models;

namespace Core.Specifications
{
    public class ProductWithSellerAndPrevOwnerSpec : BaseSpecification<Product>
    {
        public ProductWithSellerAndPrevOwnerSpec() : base()
        {
            this.Includes = [x => x.Seller, x => x.PreviousOwner];
        }
    }
}
