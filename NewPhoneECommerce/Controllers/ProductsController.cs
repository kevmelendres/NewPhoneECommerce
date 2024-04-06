using System.Diagnostics;
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
        public async Task<ActionResult<ProductToReturnDto>> ListAllProducts(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow)
        {
            var specParam = new ProductSpecParams();
            specParam.ItemsToShow = 10;
            specParam.PageNumber = 1;

            Console.WriteLine(pageNumber);

            if (pageNumber != 0) { specParam.PageNumber = pageNumber; }
            if (itemsToShow != 0) { specParam.ItemsToShow = itemsToShow; }

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

        [HttpGet("UniqueBrands")]
        public async Task<ActionResult<List<string>>> GetProductBrands(int id)
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs);

            List<string> distinctData = data.Select(x => x.Brand).Distinct().ToList();
            distinctData.Sort();

            return Ok(distinctData);
        }

        [HttpGet("UniqueColors")]
        public async Task<ActionResult<List<string>>> GetProductColors(int id)
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs);

            List<string> distinctData = data.Select(x => x.Color).Distinct().ToList();
            distinctData.Sort();

            return Ok(distinctData);
        }
    }
}
