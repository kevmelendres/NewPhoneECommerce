using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Models;
using Core.Specifications;
using Infrastructure.SpecificationEvaluator;
using Microsoft.AspNetCore.Http.HttpResults;
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
            if (specs.ItemsToShow == 0)
            {
                return await ApplySpecification(specs).ToListAsync();
            }

            var query = await ApplySpecification(specs).ToListAsync();
            int skip = (specs.PageNumber - 1) * specs.ItemsToShow;
            int take = specs.ItemsToShow;

            IReadOnlyList<T> returnQuery = query.Skip(skip).Take(take).ToList().AsReadOnly();
            return returnQuery;
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
        public async Task<string> AddItem(T item)
        {
            var addItem = await _storeContext.Set<T>().AddAsync(item);
            var result = _storeContext.SaveChangesAsync();

            if (result.IsCompleted)
            {
                return item.Id.ToString();
            }

            return "Failed";
        }

        public async Task<string> DeleteItem(int itemID)
        {
            var itemToDelete = await _storeContext.Set<T>().FindAsync(itemID);

            if (itemToDelete != null)
            {
                var remove = _storeContext.Set<T>().Remove(itemToDelete);
                var result = _storeContext.SaveChangesAsync();

                if (result.IsCompleted)
                {
                    return "Success";
                }

                return "Something went wrong";
            }

            return "Something went wrong";
        }

        public async Task<string> EditItem(int itemID, T newValue)
        {
            var itemToEdit = await _storeContext.Set<T>().FindAsync(itemID);

            if (itemToEdit != null)
            {
                itemToEdit = newValue;

                var result = _storeContext.SaveChangesAsync();

                if (result.IsCompleted)
                {
                    return "Success";
                }

                return "Something went wrong";
            }

            return "Something went wrong";
        }
    }
}
