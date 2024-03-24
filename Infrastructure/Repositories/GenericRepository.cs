using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private StoreContext _context;
        public GenericRepository(StoreContext context)
        {
            _context = context;
        }
        public async Task<T> GetByIDAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<IReadOnlyList<T>> ListItemsWithSpecs(ISpecification<T> specs)
        {
            return await GetItemsWithSpecs(specs).ToListAsync();
        }
        private IQueryable<T> GetItemsWithSpecs(ISpecification<T> specs)
        {
            return SpecificationEvaluator<T>.AddQuery(_context.Set<T>().AsQueryable(), specs);
        }
    }
}
