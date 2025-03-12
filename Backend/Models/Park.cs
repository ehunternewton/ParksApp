using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class Park
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    class ParksDb : DbContext
    {
        public ParksDb(DbContextOptions options) : base(options) { }
        public DbSet<Park> Parks { get; set; } = null!;
    }
}