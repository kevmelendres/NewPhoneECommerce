using API.Dtos;
using API.Helpers;
using Core.Interfaces;
using Core.Models;
using Core.Specifications;
using Infrastructure.SpecificationEvaluator;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseController
    {
        private readonly IGenericRepository<Product> _productsRepo;

        public ProductsController(IGenericRepository<Product> productsRepo)
        {
            _productsRepo = productsRepo;
        }

        [HttpGet]
        public async Task<ActionResult<ProductToReturnDto>> ListAllProducts()
        {

            var specParam = new ProductSpecParams { SellerId = 17, PrevOwnerId = 84};

            var newSpecs = new ProductWithParamsSpec(specParam);
            var data = await _productsRepo.GetAllItems(newSpecs);

            var returnData = MapperHelper.MapProductList(data);

            return Ok(returnData);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProductById(int id)
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();

            var data = await _productsRepo.GetItemById(id, specs);
            var returnData = MapperHelper.MapProductItem(data);

            return Ok(returnData);
        }
    }
}
