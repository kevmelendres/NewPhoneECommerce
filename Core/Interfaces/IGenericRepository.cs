using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Models;
using Core.Specifications;



namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<IReadOnlyList<T>> GetAllItems(ISpecification<T> specs);
        Task<T> GetItemById(int id, ISpecification<T> specs);
        Task<IReadOnlyList<T>> GetItemsWithSpecs(ISpecification<T> specs);
        IQueryable<T> ApplySpecification(ISpecification<T> specs);
    }
}
