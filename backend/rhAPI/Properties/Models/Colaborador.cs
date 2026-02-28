using System;

namespace rhAPI.Properties.Models
{
    public class Colaborador
    {
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public DateTime? FechaIngreso { get; set; }
        public string Departamento { get; set; }
        public string Puesto { get; set; }
        public bool Activo { get; set; }
    }
}
