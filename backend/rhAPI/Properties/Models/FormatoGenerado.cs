using System;

namespace rhAPI.Properties.Models
{
    public class FormatoGenerado
    {
        public int Id { get; set; }
        public int ColaboradorId { get; set; }
        public string TipoFormato { get; set; }
        public DateTime? FechaEfectividad { get; set; }
        public string Observaciones { get; set; }
    }
}
