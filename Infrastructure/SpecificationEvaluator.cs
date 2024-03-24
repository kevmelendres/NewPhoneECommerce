using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class SpecificationEvaluator<T> where T : BaseEntity
    {
        public static IQueryable<T> AddQuery
            (IQueryable<T> inputQuery, ISpecification<T> specs) 
        {
            var query = inputQuery;

            if (specs.Criteria != null)
            {
                query = query.Where(specs.Criteria);
            }

            if (specs.OrderBy != null)
            {
                query = query.OrderBy(specs.OrderBy);
            }

            if (specs.OrderByDescending != null)
            {
                query = query.OrderByDescending(specs.OrderByDescending);
            }

            if (specs.IsPagingEnabled)
            {
                query = query.Skip(specs.Skip).Take(specs.Take);
            }

            query = specs.Includes.Aggregate(query, (current, include) => current.Include(include));

            return query;
        }
    }
}
