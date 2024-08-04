using API.Dtos;
using API.Helpers;
using Core.Interfaces;
using Core.Models;
using Core.Models.Identity;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace API.Controllers
{
    public class ProductsController : BaseController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<Seller> _sellersRepo;
        private readonly IGenericRepository<PreviousOwner> _prevOwnersRepo;

        public ProductsController(IGenericRepository<Product> productsRepo,
            IGenericRepository<Seller> sellersRepo,
            IGenericRepository<PreviousOwner> prevOwnersRepo)
        {
            _productsRepo = productsRepo;
            _sellersRepo = sellersRepo;
            _prevOwnersRepo = prevOwnersRepo;
        }

        [HttpGet]
        public async Task<ActionResult<ProductToReturnDto>> ListAllProducts(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow, [FromQuery] string? sortBy,
            [FromQuery] string? searchString, [FromQuery] string? availability,
            [FromQuery] string? brand, [FromQuery] string? seller)
        {
            var specParam = new ProductSpecParams();
            specParam.ItemsToShow = 10;
            specParam.PageNumber = 1;

            if (pageNumber != 0) { specParam.PageNumber = pageNumber; }
            specParam.ItemsToShow = itemsToShow;
            if (sortBy != null) { specParam.SortBy = sortBy; }
            if (searchString != null) { specParam.SearchString = searchString; }

            if (availability != null) { specParam.Availability = availability; }
            if (availability == "All Products") { specParam.Availability = null; }

            if (brand != null) { specParam.BrandName = brand; }
            if (brand == "All Brands") { specParam.BrandName = null; }

            if (seller != null) { specParam.Seller = seller; }
            if (seller == "All Sellers") { specParam.Seller = null; }

            var newSpecs = new ProductWithParamsSpec(specParam);

            var data = await _productsRepo.GetAllItems(newSpecs);
            var returnData = MapperHelper.MapProductList(data);

            if (itemsToShow == 0)
            {
                data = _productsRepo.ApplySpecification(newSpecs).ToList();
            }

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
        public async Task<ActionResult<List<string>>> GetProductBrands([FromQuery] int topValue)
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs);

            List<string> distinctData = data.Select(x => x.Brand).Distinct().ToList();
            distinctData.Sort();

            IDictionary<string, int> distinctDataDict = new Dictionary<string, int>();

            foreach (string item in distinctData)
            {
                distinctDataDict.Add(item, 0);
            }

            foreach (Product product in data)
            {
                distinctDataDict[product.Brand.ToString()] += 1;
            }

            List<string> sortedData = distinctDataDict.Keys.ToList();

            if (topValue != 0)
            {
                IDictionary<string, int> takeOnlyFewDistinctDataDict = distinctDataDict.OrderBy(pair => pair.Value).Take(topValue)
                    .ToDictionary(pair => pair.Key, pair => pair.Value);
                sortedData = takeOnlyFewDistinctDataDict.Keys.ToList();
            }

            return Ok(sortedData);
        }

        [HttpGet("UniqueColors")]
        public async Task<ActionResult<List<string>>> GetProductColors([FromQuery] int topValue)
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs);

            List<string> distinctData = data.Select(x => x.Color).Distinct().ToList();
            distinctData.Sort();

            IDictionary<string, int> distinctDataDict = new Dictionary<string, int>();

            foreach (string item in distinctData)
            {
                distinctDataDict.Add(item, 0);
            }

            foreach (Product product in data)
            {
                distinctDataDict[product.Color.ToString()] += 1;
            }

            List<string> sortedData = distinctDataDict.Keys.ToList();

            if (topValue != 0)
            {
                IDictionary<string, int> takeOnlyFewDistinctDataDict = distinctDataDict.OrderBy(pair => pair.Value).Take(topValue)
                    .ToDictionary(pair => pair.Key, pair => pair.Value);
                sortedData = takeOnlyFewDistinctDataDict.Keys.ToList();
            }

            return Ok(sortedData);
        }

        [HttpGet("UniqueSellers")]
        public async Task<ActionResult<List<string>>> GetProductSellers([FromQuery] int topValue)
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs);
         
            List<string> distinctData = data.Select(x => x.Seller.Name).Distinct().ToList();
            distinctData.Sort();

            IDictionary<string, int> distinctDataDict = new Dictionary<string, int>();

            foreach (string item in distinctData)
            {
                distinctDataDict.Add(item, 0);
            }

            foreach (Product product in data)
            {
                distinctDataDict[product.Seller.Name.ToString()] += 1;
            }

            List<string> sortedData = distinctDataDict.Keys.ToList();

            if (topValue != 0)
            {
                IDictionary<string, int> takeOnlyFewDistinctDataDict = distinctDataDict.OrderBy(pair => pair.Value).Take(topValue)
                    .ToDictionary(pair => pair.Key, pair => pair.Value);
                sortedData = takeOnlyFewDistinctDataDict.Keys.ToList();
            }

            return Ok(sortedData);
        }

        [HttpGet("GetAllProductsCount")]
        public ActionResult<int> GetAllProductsCount()
        {

            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs);

            return Ok(data.Count());
        }

        [HttpGet("GetAllProductsModels")]
        public async Task<ActionResult<List<string>>> GetAllProductsModels()
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs);

            List<string> returnData = data.Select(x => x.Model).Distinct().ToList();

            return Ok(returnData);
        }

        [HttpGet("GetProductsByBrand")]
        public async Task<ActionResult<ProductToReturnDto>> GetProductsByBrand(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow, [FromQuery] string? sortBy,
            [FromQuery] string? brandName)
        {
            var specParam = new ProductSpecParams();
            specParam.ItemsToShow = 3;
            specParam.PageNumber = 1;

            if (pageNumber != 0) { specParam.PageNumber = pageNumber; }
            if (itemsToShow != 0) { specParam.ItemsToShow = itemsToShow; }
            if (sortBy != null) { specParam.SortBy = sortBy; }
            if (brandName != null) { specParam.BrandName = brandName; }

            var newSpecs = new ProductWithParamsSpec(specParam);

            var data = await _productsRepo.GetAllItems(newSpecs);
            var returnData = MapperHelper.MapProductList(data);

            return Ok(returnData);
        }

        [HttpGet("GetDealsOfTheDay")]
        public async Task<ActionResult<ProductToReturnDto>> GetDealsOfTheDay()
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs).ToList();

            Random rnd = new Random();
            HashSet<Product> uniqueRandomList = new HashSet<Product>();
            
            while (uniqueRandomList.Count < 5)
            {
                uniqueRandomList.Add(data[rnd.Next(data.Count)]);
            }

            List<Product> dealsOfTheDayList = uniqueRandomList.ToList();

            var returnData = MapperHelper.MapProductList(dealsOfTheDayList);

            return Ok(returnData);
        }
        
        [HttpGet("GetOnSaleProducts")]
        public async Task<ActionResult<ProductToReturnDto>> GetOnSaleProducts()
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs).ToList();

            data = data.OrderByDescending(x => x.Discount).ToList();

            List<Product> onSaleProductList = new List<Product>();

            for (int i =0; i < 5; i++)
            {
                onSaleProductList.Add(data[i]);
            }

            var returnData = MapperHelper.MapProductList(onSaleProductList);

            return Ok(returnData);
        }

        [HttpGet("GetBestSellerProducts")]
        public async Task<ActionResult<ProductToReturnDto>> GetBestSellerProducts()
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs).ToList();

            data = data.OrderByDescending(x => x.SoldItems).ToList();

            List<Product> onSaleProductList = new List<Product>();

            for (int i = 0; i < 5; i++)
            {
                onSaleProductList.Add(data[i]);
            }

            var returnData = MapperHelper.MapProductList(onSaleProductList);

            return Ok(returnData);
        }

        [HttpGet("GetWhatsNewProducts")]
        public async Task<ActionResult<ProductToReturnDto>> GetWhatsNewProducts()
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs).ToList();

            data = data.OrderByDescending(x => x.ReleaseDate).ToList();

            List<Product> onSaleProductList = new List<Product>();

            for (int i = 0; i < 5; i++)
            {
                onSaleProductList.Add(data[i]);
            }

            var returnData = MapperHelper.MapProductList(onSaleProductList);

            return Ok(returnData);
        }

        [HttpGet("GetRandomSellersAndProducts")]
        public async Task<ActionResult<string>> GetRandomSellersAndProducts()
        {
            var specs = new ProductWithSellerAndPrevOwnerSpec();
            var data = _productsRepo.ApplySpecification(specs).ToList();

            List<string> sellerList = data.Select(x => x.Seller.Name).Distinct().ToList();
            List<string> randomSellers = new();
            Random rnd = new();

            while (randomSellers.Count < 3)
            {
                string addSeller = sellerList[rnd.Next(sellerList.Count)];
                if (!randomSellers.Contains(addSeller))
                    randomSellers.Add(addSeller);
            }

            Dictionary<string, IReadOnlyList<ProductToReturnDto>> randomSellerWithProducts= new();

            foreach (string seller in randomSellers)
            {
                List<Product> sellerProducts = new();
                var allSellerProducts = data.Where(x => x.Seller.Name == seller).ToList();

                while (sellerProducts.Count < 21)
                {
                    Product addProduct = allSellerProducts[rnd.Next(allSellerProducts.Count)];
                    if (!sellerProducts.Contains(addProduct))
                        sellerProducts.Add(addProduct);
                }

                var sellerProductsValue = MapperHelper.MapProductList(sellerProducts);

                randomSellerWithProducts.Add(seller, sellerProductsValue);
            }

            var returnData = Newtonsoft.Json.JsonConvert.SerializeObject(randomSellerWithProducts);

            return Ok(returnData);
        }

        [HttpGet("GetProductsBySeller")]
        public async Task<ActionResult<ProductToReturnDto>> GetProductsBySeller(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow, [FromQuery] string? sortBy,
            [FromQuery] string? seller)
        {
            var specParam = new ProductSpecParams();
            specParam.ItemsToShow = 5;
            specParam.PageNumber = 1;

            if (pageNumber != 0) { specParam.PageNumber = pageNumber; }
            if (itemsToShow != 0) { specParam.ItemsToShow = itemsToShow; }
            if (sortBy != null) { specParam.SortBy = sortBy; }
            if (seller != null) { specParam.Seller = seller; }

            var newSpecs = new ProductWithParamsSpec(specParam);

            var data = await _productsRepo.GetAllItems(newSpecs);
            var returnData = MapperHelper.MapProductList(data);

            return Ok(returnData);
        }

        [HttpGet("GetProductsByPrevOwner")]
        public async Task<ActionResult<ProductToReturnDto>> GetProductsByPrevOwner(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow, [FromQuery] string? sortBy,
            [FromQuery] int previousOwnerId)
        {
            var specParam = new ProductSpecParams();
            specParam.ItemsToShow = 5;
            specParam.PageNumber = 1;

            if (pageNumber != 0) { specParam.PageNumber = pageNumber; }
            if (itemsToShow != 0) { specParam.ItemsToShow = itemsToShow; }
            if (sortBy != null) { specParam.SortBy = sortBy; }
            specParam.PrevOwnerId = previousOwnerId;

            var newSpecs = new ProductWithParamsSpec(specParam);

            var data = await _productsRepo.GetAllItems(newSpecs);
            var returnData = MapperHelper.MapProductList(data);

            return Ok(returnData);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("Edit")]
        public async Task<ActionResult<string>> EditProduct([FromBody] ProductToEditDto editedProduct)
        {
            var orderSpecs = new ProductWithSellerAndPrevOwnerSpec();
            orderSpecs.Criteria = x => x.Id == editedProduct.Id;

            var productToEdit = await _productsRepo.GetItemById(editedProduct.Id, orderSpecs);

            #region Editing Values
            productToEdit.Brand = editedProduct.Brand ?? productToEdit.Brand;
            productToEdit.Model = editedProduct.Model ?? productToEdit.Model;
            productToEdit.DeviceOS = editedProduct.DeviceOS ?? productToEdit.DeviceOS;
            productToEdit.ReleaseDate = editedProduct.ReleaseDate ?? productToEdit.ReleaseDate;
            productToEdit.Price = editedProduct.Price ?? productToEdit.Price;
            productToEdit.Color = editedProduct.Color ?? productToEdit.Color;
            productToEdit.Description = editedProduct.Description ?? productToEdit.Description;
            productToEdit.Image = editedProduct.Image ?? productToEdit.Image;
            productToEdit.Rating = editedProduct.Rating ?? productToEdit.Rating;
            productToEdit.Discount = editedProduct.Discount ?? productToEdit.Discount;
            productToEdit.AvailableStocks = editedProduct.AvailableStocks ?? productToEdit.AvailableStocks;
            productToEdit.SoldItems = editedProduct.SoldItems ?? productToEdit.SoldItems;

            if (editedProduct.Discount != null || editedProduct.Price != null)
            {
                var priceToUse = editedProduct.Price ?? productToEdit.Price;
                var discountToUse = editedProduct.Discount ?? productToEdit.Discount;
                productToEdit.DiscountedPrice = (priceToUse * (100 - discountToUse) / 100);
                productToEdit.DiscountedPrice = Math.Round(productToEdit.DiscountedPrice, 2);
            }

            if (editedProduct.Seller != null)
            {
                var sellerSpecs = new BaseSpecification<Seller>();
                sellerSpecs.Criteria = x => x.Name == editedProduct.Seller;

                var sellers = await _sellersRepo.GetItemsWithSpecs(sellerSpecs);

                if (sellers.Count > 0)
                {
                    var sellerId = sellers[0].Id;
                    productToEdit.SellerID = sellerId;
                } else
                {
                    var newSeller = new Seller(editedProduct.Seller);
                    var addSellerResult = await _sellersRepo.AddItem(newSeller);

                    if (addSellerResult == "Failed")
                    {
                        return Json("Failed adding seller.");
                    }

                    int sellerId = -1;
                    if (Int32.TryParse(addSellerResult, out sellerId))
                    {
                        productToEdit.SellerID = sellerId;
                    };
                }
            }

            if (editedProduct.PreviousOwnerFirstName != null)
            {
                var prevOwnerSpecs = new BaseSpecification<PreviousOwner>();
                prevOwnerSpecs.Criteria = x => ((x.FirstName == editedProduct.PreviousOwnerFirstName) &&
                    (x.LastName == editedProduct.PreviousOwnerLastName));

                var previousOwners = await _prevOwnersRepo.GetItemsWithSpecs(prevOwnerSpecs);

                if (previousOwners.Count > 0)
                {
                    var prevOwnerId = previousOwners[0].Id;
                    productToEdit.PrevOwnerID = prevOwnerId;
                }
                else
                {
                    var newPrevOwner = new PreviousOwner(editedProduct.PreviousOwnerFirstName,
                        editedProduct.PreviousOwnerLastName);
                    var addPrevOwnerResult = await _prevOwnersRepo.AddItem(newPrevOwner);

                    if (addPrevOwnerResult == "Failed")
                    {
                        return Json("Failed adding previous owner.");
                    }

                    int prevOwnerId = -1;
                    if (Int32.TryParse(addPrevOwnerResult, out prevOwnerId))
                    {
                        productToEdit.PrevOwnerID = prevOwnerId;
                    };
                }
            }
            #endregion

            var result = await _productsRepo.EditItem(editedProduct.Id);

            if (result != "Success")
            {
                return Json("Fail");
            }

            return Json("Success");
        }

        [HttpGet("GetProductCountWithSearchString")]
        public ActionResult<int> GetProductCountWithSearchString(
            [FromQuery] string? searchString)
        {
            if (searchString != null)
            {
                var specs = new ProductWithSellerAndPrevOwnerSpec();
                specs.Criteria = x => x.Model.ToString().ToLower().Contains(searchString.ToLower());

                var data = _productsRepo.ApplySpecification(specs).ToList();

                return Ok(data.Count());
            }

            return GetAllProductsCount();
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<string>> AddProduct([FromBody] ProductToAddDto productToAdd)
        {

            Product newProduct = new()
            {
                Brand = productToAdd.Brand!,
                Model = productToAdd.Model!,
                DeviceOS = productToAdd.DeviceOS!,
                ReleaseDate = (int)productToAdd.ReleaseDate!,
                Price = (int)productToAdd.Price!,
                Color = productToAdd.Color!,
                Description = productToAdd.Description!,
                Image = productToAdd.Image!,

                Rating = (double)productToAdd.Rating!,
                Discount = (int)productToAdd.Discount!,
                AvailableStocks = (int)productToAdd.AvailableStocks!,
                SoldItems = (int)productToAdd.SoldItems!,
            };

            if (productToAdd.Discount != null || productToAdd.Price != null)
            {
                newProduct.DiscountedPrice = ((double)productToAdd.Price * (100 - (int)productToAdd.Discount!) / 100);
                newProduct.DiscountedPrice = Math.Round(newProduct.DiscountedPrice, 2);
            }

            if (productToAdd.Seller != null)
            {
                var sellerSpecs = new BaseSpecification<Seller>();
                sellerSpecs.Criteria = x => x.Name == productToAdd.Seller;

                var sellers = await _sellersRepo.GetItemsWithSpecs(sellerSpecs);

                if (sellers.Count > 0)
                {
                    var sellerId = sellers[0].Id;
                    newProduct.SellerID = sellerId;
                }
                else
                {
                    var newSeller = new Seller(productToAdd.Seller);
                    var addSellerResult = await _sellersRepo.AddItem(newSeller);

                    if (addSellerResult == "Failed")
                    {
                        return Json("Failed adding seller.");
                    }

                    int sellerId = -1;
                    if (Int32.TryParse(addSellerResult, out sellerId))
                    {
                        newProduct.SellerID = sellerId;
                    };
                }
            }

            if (productToAdd.PreviousOwnerFirstName != null)
            {
                var prevOwnerSpecs = new BaseSpecification<PreviousOwner>();
                prevOwnerSpecs.Criteria = x => ((x.FirstName == productToAdd.PreviousOwnerFirstName) &&
                    (x.LastName == productToAdd.PreviousOwnerLastName));

                var previousOwners = await _prevOwnersRepo.GetItemsWithSpecs(prevOwnerSpecs);

                if (previousOwners.Count > 0)
                {
                    var prevOwnerId = previousOwners[0].Id;
                    newProduct.PrevOwnerID = prevOwnerId;
                }
                else
                {
                    var newPrevOwner = new PreviousOwner(productToAdd.PreviousOwnerFirstName,
                        productToAdd.PreviousOwnerLastName);
                    var addPrevOwnerResult = await _prevOwnersRepo.AddItem(newPrevOwner);

                    if (addPrevOwnerResult == "Failed")
                    {
                        return Json("Failed adding previous owner.");
                    }

                    int prevOwnerId = -1;
                    if (Int32.TryParse(addPrevOwnerResult, out prevOwnerId))
                    {
                        newProduct.PrevOwnerID = prevOwnerId;
                    };
                }
            }

            var result = await _productsRepo.AddItem(newProduct);

            return result;
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("Delete")]
        public async Task<ActionResult<string>> DeleteDeliveryMethod(
            [FromBody] int productId)
        {
            var result = await _productsRepo.DeleteItem(productId);

            if (result == "Success")
            {
                return Json("Success");
            }

            return Json("Failed");
        }

        [HttpGet("GetAllPreviousOwners")]
        public async Task<ActionResult<List<PreviousOwnerDto>>> GetAllPreviousOwners(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow)
        {
            var specs = new BaseSpecification<PreviousOwner>();
            specs.Includes = [x => x.Products];
            specs.ItemsToShow = 0;
            specs.PageNumber = 1;

            if (pageNumber != 0) { specs.PageNumber = pageNumber; }
            if (itemsToShow != 0) { specs.ItemsToShow = itemsToShow; }


            var data = await _prevOwnersRepo.GetAllItems(specs);
            List<PreviousOwnerDto> returnList = MapperHelper.MapPreviousOwnerList(data);

            return Ok(returnList);
        }

        [HttpGet("GetAllSellers")]
        public async Task<ActionResult<List<SellerDto>>> GetAllSellers(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow)
        {
            var specs = new BaseSpecification<Seller>();
            specs.Includes = [x => x.Products];
            specs.ItemsToShow = 0;
            specs.PageNumber = 1;

            if (pageNumber != 0) { specs.PageNumber = pageNumber; }
            if (itemsToShow != 0) { specs.ItemsToShow = itemsToShow; }

            var data = await _sellersRepo.GetAllItems(specs);

            List<SellerDto> returnList = MapperHelper.MapSellerList(data);

            return Ok(returnList);
        }
    }
}
