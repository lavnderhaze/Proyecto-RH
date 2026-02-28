using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rhAPI.Properties.Data;
using rhAPI.Properties.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace rhAPI.Controllers
{
    [ApiController]
    [Route("api/formatos")]
    public class FormatosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FormatosController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/formatos
        [HttpPost]
        public async Task<ActionResult<FormatoGenerado>> Create([FromBody] FormatoGenerado formato)
        {
            var colaboradorExiste = await _context.Colaboradores
                                    .AnyAsync(c => c.Id == formato.ColaboradorId);

            if (!colaboradorExiste)
                return NotFound("El colaborador no existe");

            _context.FormatosGenerados.Add(formato);
            await _context.SaveChangesAsync();

            return Ok(formato);
        }
    }
}
