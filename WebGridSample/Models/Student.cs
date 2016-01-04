using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebGridSample.Models
{
    public class Student
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }
        public int StateID { get; set; }
        public string StateName { get; set; }
        public int CityID { get; set; }
        public string CityName { get; set; }
    }
}