using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Core.Models;

namespace Core.Specifications
{
    public class ProductWithParamsSpec : ProductWithSellerAndPrevOwnerSpec
    {
        public ProductWithParamsSpec(ProductSpecParams paramSpecs) : base()
        {
            this.Criteria = x => (!paramSpecs.SellerId.HasValue || x.SellerID == paramSpecs.SellerId) &&
                    (!paramSpecs.PrevOwnerId.HasValue || x.PrevOwnerID == paramSpecs.PrevOwnerId);

        }
    }
}
