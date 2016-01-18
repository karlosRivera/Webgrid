using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace WebGridSample.Models
{
    public class Student
    {
        public int ID { get; set; }
        [Required(ErrorMessage = "First Name Required")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last Name Required")]
        public string LastName { get; set; }
        public bool IsActive { get; set; }

        public int StateID { get; set; }
        public string StateName { get; set; }

        public int CityID { get; set; }
        public string CityName { get; set; }
    }
}