using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ISpecification<T>
    {
        Expression<Func<T,bool>> Criteria { get; set; }
        List<Expression<Func<T, object>>> Includes { get; }
        Expression<Func<T, object>> OrderBy { get; set; }
        Expression<Func<T, object>> OrderByDescending { get; set; }
        int Take { get; }
        int Skip { get; }
        bool IsPagingEnabled { get; }
    }
}
