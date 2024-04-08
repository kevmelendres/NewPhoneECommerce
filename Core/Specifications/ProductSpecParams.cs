using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductSpecParams
    {
        public string? SortBy { get; set; }
        public int? SellerId { get; set; }
        public int? PrevOwnerId { get; set; }
        public int ItemsToShow { get; set; }
        public int PageNumber { get; set; }

    }
}
