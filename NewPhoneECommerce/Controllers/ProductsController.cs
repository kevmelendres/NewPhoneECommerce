using System.Diagnostics;
using System.Linq.Expressions;
using Core.Interfaces;
using Core.Models;
using Core.Specifications;
using Infrastructure;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using API.Dtos;

namespace API.Controllers
{
    public class ProductsController : BaseController
    {
        protected readonly IGenericRepository<Product> _productsRepo;
        protected readonly IMapper _mapper;
        public ProductsController(IGenericRepository<Product> productsRepo, IMapper mapper)
        {
            _productsRepo = productsRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var spec = new BaseSpecification<Product>(x => x.Seller);
            spec.Includes.Add(x => x.PreviousOwner);


            var products = await _productsRepo.ListItemsWithSpecs(spec);

            var data = _mapper.Map<IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var data = await _productsRepo.GetByIDAsync(id);

            return Ok(data);
        }
    }
}
