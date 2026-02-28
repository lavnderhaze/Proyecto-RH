using Microsoft.EntityFrameworkCore;
using rhAPI.Properties.Models;
using System.Collections.Generic;

namespace rhAPI.Properties.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<Colaborador> Colaboradores { get; set; }
        public DbSet<FormatoGenerado> FormatosGenerados { get; set; }
    }
}
