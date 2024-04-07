using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public static class StoreContextSeed
    {
        public static async void SeedData(StoreContext context)
        {
            if (!context.Sellers.Any())
            {
                var sellersData = File.ReadAllText("../Infrastructure/MockData/Sellers.json");
                var sellers = JsonSerializer.Deserialize<List<Seller>>(sellersData);

                foreach (Seller seller in sellers)
                {
                    context.Sellers.Add(seller);
                }

                await context.SaveChangesAsync();
            }

            if (!context.PreviousOwners.Any())
            {
                var previousOwnersData = File.ReadAllText("../Infrastructure/MockData/PreviousOwners.json");
                var prevOwners = JsonSerializer.Deserialize<List<PreviousOwner>>(previousOwnersData);

                foreach (PreviousOwner prevOwner in prevOwners)
                {
                    context.PreviousOwners.Add(prevOwner);
                }

                await context.SaveChangesAsync();
            }

            if (!context.Products.Any())
            {
                var productsData = File.ReadAllText("../Infrastructure/MockData/Products.json");
                var products = JsonSerializer.Deserialize<List<Product>>(productsData);

                foreach (Product product in products)
                {
                    context.Products.Add(product);
                }

                await context.SaveChangesAsync();
            }
        }

        public static async void ResetData(StoreContext context)
        {
            await context.Products.ExecuteDeleteAsync();

            await context.Sellers.ExecuteDeleteAsync();
            await context.PreviousOwners.ExecuteDeleteAsync();
        }
    }
}
