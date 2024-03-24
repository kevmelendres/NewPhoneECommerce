using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Models;
using Core.Specifications;
using Infrastructure.SpecificationEvaluator;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private StoreContext _storeContext;

        public GenericRepository(StoreContext context)
        {
            _storeContext = context;
            _storeContext.Set<Product>().AsQueryable();
        }

        public async Task<IReadOnlyList<T>> GetAllItems(ISpecification<T> specs)
        {
            return await ApplySpecification(specs).ToListAsync();
        }
            
        public async Task<T> GetItemById(int id, ISpecification<T> specs)
        {
            return await ApplySpecification(specs).FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<IReadOnlyList<T>> GetItemsWithSpecs(ISpecification<T> specs)
        {
            return await ApplySpecification(specs).ToListAsync();
        }
        public IQueryable<T> ApplySpecification(ISpecification<T> specs)
        {
            var data = SpecificationEvaluator<T>.GetQuery(_storeContext.Set<T>().AsQueryable(), specs);
            return data;
        }
    }
}
