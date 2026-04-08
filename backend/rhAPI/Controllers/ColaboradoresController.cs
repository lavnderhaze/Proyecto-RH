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

        // DELETE: api/colaboradores/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var colaborador = await _context.Colaboradores.FindAsync(id);

            if (colaborador == null)
            {
                return NotFound(new { message = $"Colaborador con Id {id} no encontrado" });
            }

            // Verificar si tiene formatos generados asociados
            var tieneFormatos = await _context.FormatosGenerados
                .AnyAsync(f => f.ColaboradorId == id);

            if (tieneFormatos)
            {
                return BadRequest(new { message = "No se puede eliminar: el colaborador tiene formatos generados asociados" });
            }

            _context.Colaboradores.Remove(colaborador);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
