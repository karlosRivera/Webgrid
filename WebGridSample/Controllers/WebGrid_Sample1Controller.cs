using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGridSample.Models;

namespace WebGridSample.Controllers
{
    public class WebGrid_Sample1Controller : Controller
    {
        // GET: WebGrid
        public ActionResult Show1(StudentVm oSVm)
        {
            StudentVm SVm = new StudentVm(); //.GetStudents(oSVm);
            SVm.Students= SVm.GetStudents(oSVm);
            return View(SVm);
        }
    }

    
}