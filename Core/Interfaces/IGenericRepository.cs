using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        public Task<T> GetByIDAsync(int id);
        public Task<IReadOnlyList<T>> ListAllAsync();
        public Task<IReadOnlyList<T>> ListItemsWithSpecs(ISpecification<T> specs);
    }
}
