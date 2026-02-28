using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rhAPI.Properties.Data;
using rhAPI.Properties.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace rhAPI.Controllers
{
    [ApiController]
    [Route("api/colaboradores")]
    public class ColaboradoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ColaboradoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/colaboradores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Colaborador>>> Get()
        {
            return await _context.Colaboradores.ToListAsync();
        }
    }
}
